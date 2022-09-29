import path from 'canonical-path';
import {spawn} from 'cross-spawn';
import fs from 'fs-extra';
import {globbySync} from 'globby';
import os from 'os';
import shelljs from 'shelljs';
import treeKill from 'tree-kill';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers'
import getPort from 'get-port';
import {constructExampleSandbox} from "./example-sandbox.mjs";

shelljs.set('-e');

process.env.CHROME_BIN = adjustChromeBinPathForWindows();

// Resolve CHROME_BIN and CHROMEDRIVER_BIN from relative paths to absolute paths within the
// runfiles tree so that subprocesses spawned in a different working directory can still find them.
process.env.CHROME_BIN = path.resolve(process.env.CHROME_BIN);
process.env.CHROMEDRIVER_BIN = path.resolve(process.env.CHROMEDRIVER_BIN);

const {argv} = yargs(hideBin(process.argv))
  .command("* <examplePath> <yarnPath> <exampleDepsWorkspaceName>")
  .option('localPackage', {array: true, type: 'string', default: [], describe: 'Locally built package to substitute, in the form `packageName#packagePath`'})
  .version(false)
  .strict();

const EXAMPLE_PATH = path.resolve(argv.examplePath);
const NODE = process.execPath;
const VENDORED_YARN = path.resolve(argv.yarnPath);
const EXAMPLE_DEPS_WORKSPACE_NAME = argv.exampleDepsWorkspaceName;
const LOCAL_PACKAGES = argv.localPackage.reduce((pkgs, pkgNameAndPath) => {
  const [pkgName, pkgPath] = pkgNameAndPath.split('#');
  pkgs[pkgName] = path.resolve(pkgPath);
  return pkgs;
}, {});

const SJS_SPEC_FILENAME = 'e2e-spec.ts';
const CLI_SPEC_FILENAME = 'e2e/src/app.e2e-spec.ts';
const EXAMPLE_CONFIG_FILENAME = 'example-config.json';
const MAX_NO_OUTPUT_TIMEOUT = 1000 * 60 * 5;  // 5 minutes

/**
 * Run Protractor End-to-End Tests for a Docs Example
 *
 * Usage: node run-example-e2e.mjs <examplePath> <yarnPath> <exampleDepsWorkspaceName> [localPackage...]
 *
 * Args:
 *  examplePath: path to the example
 *  yarnPath: path to a vendored version of yarn
 *  exampleDepsWorkspaceName: name of bazel workspace containing example node_omodules
 *  localPackages: a vararg of local packages to substitute in place npm deps, in the form @package/name#pathToPackage.
 *
 * Flags
 *  --retry to retry failed tests (useful for overcoming flakes)
 *    e.g. --retry 3  // To try each test up to 3 times.
 */

async function runE2e(examplePath) {
  const exampleName = path.basename(examplePath);
  const maxAttempts = argv.retry || 1;
  const exampleTestPath = generatePathForExampleTest(exampleName);

  try {

    await constructExampleSandbox(examplePath, exampleTestPath, path.resolve('..', EXAMPLE_DEPS_WORKSPACE_NAME, 'node_modules'), LOCAL_PACKAGES);

    let testFn;
    if (isSystemJsTest(exampleTestPath)) {
      testFn = () => runE2eTestsSystemJS(exampleName, exampleTestPath);
    } else if (isCliTest(exampleTestPath)) {
      testFn = () => runE2eTestsCLI(exampleName, exampleTestPath);
    } else {
      throw new Error(`Unknown e2e test type for example ${exampleName}`);
    }
  
    await attempt(testFn, maxAttempts);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    fs.rmSync(exampleTestPath, {recursive: true, force: true});
  }
}

async function attempt(testFn, maxAttempts) {
  let attempts = 0;
  let passed = false;

  while (true) {
    attempts++;
    passed = await testFn();

    if (passed || (attempts >= maxAttempts)) break;
  }

  if (!passed) {
    throw new Error('Test failed');
  }
}

function generatePathForExampleTest(exampleName) {
  // Note that bazel provides a writeable tmp dir for tests in the env var TEST_TMPDIR,
  // however we do not use it here as in non-sandboxed mode the temp dir sits under the
  // execroot, so yarn will find the .yarnrc in the root of the workspace. If there is ever
  // a version mismatch (e.g., if we use multiple vendored yarn versions) then this could
  // cause subtle errors. Instead, just use a temp dir that bazel doesn't know about.
  return fs.mkdtempSync(`${os.tmpdir()}${path.sep}${exampleName}-`)
}

function isSystemJsTest(examplePath) {
  return fs.existsSync(path.join(examplePath, SJS_SPEC_FILENAME));
}

function isCliTest(examplePath) {
  return fs.existsSync(path.join(examplePath, CLI_SPEC_FILENAME));
}

async function runE2eTestsSystemJS(exampleName, appDir) {
  const config = loadExampleConfig(appDir);

  const runArgs = await overrideSystemJsExampleToUseRandomPort(config, appDir);

  const appBuildSpawnInfo = spawnExt(NODE, [VENDORED_YARN, config.build], {cwd: appDir});
  const appRunSpawnInfo = spawnExt(NODE, [VENDORED_YARN, ...runArgs, '-s'], {cwd: appDir}, true);

  let run = runProtractorSystemJS(exampleName, appBuildSpawnInfo.promise, appDir, appRunSpawnInfo);

  if (fs.existsSync(appDir + '/aot/index.html')) {
    run = run.then((ok) => ok && runProtractorAoT(exampleName, appDir));
  }

  return run;
}

// The SystemJS examples spawn an http server and protractor using a hardcoded
// port. In order to run these tests concurrently under bazel without contention,
// we need to dynamically acquire a port and overwrite configuration to use that port.
// This is further complicated by the SystemJS tests using two different http servers
// (http-server, lite-server) depending on the example (and sometimes both),
// and the two servers need to be configured differently.
async function overrideSystemJsExampleToUseRandomPort(exampleConfig, exampleDir) {
  const freePort = await getPort();
  let runArgs = [exampleConfig.run];

  const isUsingHttpServerLibrary = exampleConfig.run === 'serve:upgrade';
  if (isUsingHttpServerLibrary) {
    // Override the port in http-server by passing as an argument
    runArgs = [...runArgs, "-p", freePort];
  }

  // Override the port in any lite-server config files
  const liteServerConfigs = globbySync(['bs-config*.json'], {cwd: exampleDir});
  liteServerConfigs.forEach(configFile => {
    const config = JSON.parse(fs.readFileSync(path.join(exampleDir, configFile), 'utf8'));
    if (config.port) {
      config.port = freePort;
      fs.writeFileSync(path.join(exampleDir, configFile), JSON.stringify(config));
    }
  });

  // Override hardcoded port in protractor.config.js
  let protractorConfig = fs.readFileSync(path.join(exampleDir, 'protractor.config.js'), 'utf8');
  protractorConfig = protractorConfig.replaceAll('http://localhost:8080', `http://localhost:${freePort}`);
  fs.writeFileSync(path.join(exampleDir, 'protractor.config.js'), protractorConfig);

  return runArgs;
}

function runProtractorSystemJS(exampleName, prepPromise, appDir, appRunSpawnInfo) {
  const specFilename = path.resolve(`${appDir}/${SJS_SPEC_FILENAME}`);
  return prepPromise
      .catch(() => {
        const emsg = `Application at ${appDir} failed to transpile.\n\n`;
        console.log(emsg);
        return Promise.reject(emsg);
      })
      .then(() => {
        let transpileError = false;

        // Start protractor.
        console.log(`\n\n=========== Running aio example tests for: ${exampleName}`);
        const spawnInfo = spawnExt(NODE, [VENDORED_YARN, 'protractor'], {cwd: appDir});

        spawnInfo.proc.stderr.on('data', function(data) {
          transpileError = transpileError || /npm ERR! Exit status 100/.test(data.toString());
        });
        return spawnInfo.promise.catch(function() {
          if (transpileError) {
            const emsg = `${specFilename} failed to transpile.\n\n`;
            console.log(emsg);
          }
          return Promise.reject();
        });
      })
      .then(
        () => finish(appRunSpawnInfo.proc.pid, true),
        () => finish(appRunSpawnInfo.proc.pid, false)
      );
}

function finish(spawnProcId, ok) {
  // Ugh... proc.kill does not work properly on windows with child processes.
  // appRun.proc.kill();
  treeKill(spawnProcId);
  return ok;
}

// Run e2e tests over the AOT build for projects that examples it.
function runProtractorAoT(exampleName, appDir) {
  const aotBuildSpawnInfo = spawnExt(NODE, [VENDORED_YARN, 'build:aot'], {cwd: appDir});
  let promise = aotBuildSpawnInfo.promise;

  const copyFileCmd = 'copy-dist-files.js';
  if (fs.existsSync(appDir + '/' + copyFileCmd)) {
    promise = promise.then(() => spawnExt('node', [copyFileCmd], {cwd: appDir}).promise);
  }
  const aotRunSpawnInfo = spawnExt(NODE, [VENDORED_YARN, 'serve:aot'], {cwd: appDir}, true);
  return runProtractorSystemJS(exampleName, promise, appDir, aotRunSpawnInfo);
}

// Start the example in appDir; then run protractor with the specified
// fileName; then shut down the example.
// All protractor output is appended to the outputFile.
// CLI version
function runE2eTestsCLI(exampleName, appDir) {
  console.log(`\n\n=========== Running aio example tests for: ${exampleName}`);

  const config = loadExampleConfig(appDir);

  // Replace any calls with yarn (which requires yarn to be on the PATH) to instead call our vendored yarn
  if (config.tests) {
    for (let test of config.tests) {
      if (test.cmd === 'yarn') {
        test.cmd = NODE;
        test.args = [VENDORED_YARN, ...test.args];
      }
    }
  }

  // `--no-webdriver-update` is needed to preserve the ChromeDriver version already installed.
  const testCommands = config.tests || [{
                        cmd: NODE,
                         args: [
                          VENDORED_YARN,
                           'e2e',
                           '--configuration=production',
                           '--protractor-config=e2e/protractor-bazel.conf.js',
                           '--no-webdriver-update',
                           '--port=0',
                         ],
                       }];

  const e2eSpawnPromise = testCommands.reduce((prevSpawnPromise, {cmd, args}) => {
    return prevSpawnPromise.then(() => {
      const currSpawn = spawnExt(
          cmd, args, {cwd: appDir}, false);
      return currSpawn.promise.then(
          () => finish(currSpawn.proc.pid, true),
          () => finish(currSpawn.proc.pid, false),
      )
    });
  }, Promise.resolve());

  return e2eSpawnPromise;
}

// Returns both a promise and the spawned process so that it can be killed if needed.
function spawnExt(
    command, args, options, ignoreClose = false, printMessageFn = msg => process.stdout.write(msg)) {
  let proc = null;
  const promise = new Promise((resolveFn, rejectFn) => {
    let noOutputTimeoutId;
    const failDueToNoOutput = () => {
      treeKill(proc.id);
      reject(`No output after ${MAX_NO_OUTPUT_TIMEOUT}ms.`);
    };
    const printMessage = msg => {
      clearTimeout(noOutputTimeoutId);
      noOutputTimeoutId = setTimeout(failDueToNoOutput, MAX_NO_OUTPUT_TIMEOUT);
      return printMessageFn(msg);
    };
    const resolve = val => {
      clearTimeout(noOutputTimeoutId);
      resolveFn(val);
    };
    const reject = err => {
      clearTimeout(noOutputTimeoutId);
      rejectFn(err);
    };

    let descr = command + ' ' + args.join(' ');
    printMessage(`running: ${descr}\n`);
    try {
      proc = spawn(command, args, options);
    } catch (e) {
      console.log(e);
      return reject(e);
    }
    proc.stdout.on('data', printMessage);
    proc.stderr.on('data', printMessage);

    proc.on('close', function(returnCode) {
      printMessage(`completed: ${descr}\n\n`);
      // Many tasks (e.g., tsc) complete but are actually errors;
      // Confirm return code is zero.
      returnCode === 0 || ignoreClose ? resolve(0) : reject(returnCode);
    });
    proc.on('error', function(data) {
      printMessage(`completed with error: ${descr}\n\n`);
      printMessage(`${data.toString()}\n`);
      reject(data);
    });
  });
  return {proc, promise};
}

// Load configuration for an example. Used for SystemJS
function loadExampleConfig(exampleFolder) {
  // Default config.
  let config = {build: 'build', run: 'serve:e2e'};

  try {
    const exampleConfig = fs.readJsonSync(`${exampleFolder}/${EXAMPLE_CONFIG_FILENAME}`);
    Object.assign(config, exampleConfig);
  } catch (e) {
  }

  return config;
}

// TODO: this is a hack; the root cause should be found and fixed
function adjustChromeBinPathForWindows() {
  if (os.platform() === 'win32') {
    /*
      For some unknown reason, the symlinked copy of chromium under runfiles won't run under
      karma on Windows. Instead, modify the CHROME_BIN env var to point to the chrome binary
      under external/ in the execroot.

      CHROME_BIN is equal to the make var $(CHROMIUM), which points to chrome relative
      to the runfiles root.

      The org_chromium_chromium_windows/ in the path below is needed to cancel out the
      leading ../ in CHROME_BIN.

      First, back out of
          bazel-out/x64_windows-fastbuild/bin/aio/content/examples/{EXAMPLE}/e2e.bat.runfiles/angular
      Then go into
          external/
      and then into
          org_chromium_chromium_windows/
      to cancel out the leading ../ in CHROME_BIN
    */
   return path.join(`../../../../../../../../../external/org_chromium_chromium_windows/${process.env.CHROME_BIN}`);
  }
  return process.env.CHROME_BIN;
}

runE2e(EXAMPLE_PATH);
