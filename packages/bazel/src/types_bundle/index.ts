/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/// <reference types="node"/>
/// <reference lib="es2020"/>

import {Extractor, ExtractorConfig, IConfigFile, IExtractorConfigPrepareOptions,} from '@microsoft/api-extractor';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Bundles the specified entry-point and writes the output `d.ts` bundle to the specified
 * output path. An optional license banner can be provided to be added to the bundle output.
 */
export async function runMain(
    {entryPointExecpath, outputExecpath, packageJsonExecpath, licenseBannerExecpath}: {
      entryPointExecpath: string,
      outputExecpath: string,
      packageJsonExecpath: string,
      licenseBannerExecpath: string|undefined
    }): Promise<void> {
  const configObject: IConfigFile = {
    compiler: {
      overrideTsconfig:
          // We disable automatic `@types` resolution as this throws-off API reports
          // when the API test is run outside sandbox. Instead we expect a list of
          // hard-coded types that should be included. This works in non-sandbox too.
          {files: [entryPointExecpath], compilerOptions: {types: [], lib: ['es2020', 'dom']}},
    },
    // The execroot is the working directory and it will contain all input files.
    projectFolder: process.cwd(),
    mainEntryPointFilePath: path.resolve(entryPointExecpath),
    newlineKind: 'lf',
    apiReport: {enabled: false, reportFileName: 'invalid'},
    docModel: {enabled: false},
    tsdocMetadata: {enabled: false},
    dtsRollup: {
      enabled: true,
      untrimmedFilePath: path.resolve(outputExecpath),
    },
  };

  // Resolve to an absolute path from the current working directory (i.e. execroot).
  const packageJsonFullPath = path.resolve(packageJsonExecpath);
  const options: IExtractorConfigPrepareOptions = {
    configObject,
    packageJsonFullPath,
    packageJson: undefined,
    configObjectFullPath: undefined,
  };

  const extractorConfig = ExtractorConfig.prepare(options);
  const {succeeded} = Extractor.invoke(extractorConfig);

  if (!succeeded) {
    throw new Error('Type bundling failed. See error above.');
  }

  let bundleOutput = fs.readFileSync(outputExecpath, 'utf8');

  // Strip AMD module directive comments.
  bundleOutput = stripAmdModuleDirectiveComments(bundleOutput);

  // Remove license comments as these are not deduped in API-extractor.
  bundleOutput = bundleOutput.replace(/(\/\*\*\s+\*\s\@license(((?!\*\/).|\s)*)\*\/)/gm, '');

  // Add license banner if provided.
  if (licenseBannerExecpath) {
    bundleOutput = `${fs.readFileSync(licenseBannerExecpath, 'utf8')}\n\n` + bundleOutput;
  }

  // Re-write the output file.
  fs.writeFileSync(outputExecpath, bundleOutput);
}

/**
 * Strip the named AMD module for compatibility from Bazel-generated type
 * definitions. These may end up in the generated type bundles.
 *
 * e.g. `/// <amd-module name="@angular/localize/init" />` should be stripped.

 */
function stripAmdModuleDirectiveComments(content: string): string {
  return content.replace(/^\/\/\/ <amd-module name=.*\/>[\r\n]+/gm, '');
}

// Entry point
const [entryPointExecpath, outputExecpath, packageJsonExecpath, licenseBannerExecpath] =
    process.argv.slice(2);

runMain({entryPointExecpath, outputExecpath, packageJsonExecpath, licenseBannerExecpath})
    .catch(e => {
      console.error(e);
      process.exitCode = 1;
    });
