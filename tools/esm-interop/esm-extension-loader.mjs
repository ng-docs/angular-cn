/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

const explicitExtensionRe = /\.[mc]?js$/;
const explicitJsExtensionRe = /\.js$/;

/*
 * NodeJS resolver that enables the interop with the current Bazel setup.
 *
 * The loader will attempt resolution by replacing explicit extension with
 * their ESM variants. It also tries completing import specifiers in case no
 * extension of explicit file is specified.
 *
 * There are a few cases:
 *
 *   * Relative imports without an extension. This happens because our
 *     source files cannot use explicit `.mjs` extensions yet.
 *   * Relative imports with an explicit extension to `.js`. This may
 *     be generated by TypeScript as we have `.ts` source files.
 *   * Local module imports. In NPM, extensions are not needed as the
 *     `package.json` `exports` help resolving. In Bazel when dealing with
 *     1st-party packages- `package.json` is not consulted in resolution.
 *        1. The NPM artifacts differ from the source compilation output.
 *        2. It results in additional churn, having to put `package.json` into `bin`.
 */
export async function resolve(specifier, context, nextResolve) {
  const interopAttempts = [];
  if (explicitJsExtensionRe.test(specifier)) {
    interopAttempts.push(specifier.replace(explicitJsExtensionRe, '.mjs'));
  }

  if (!explicitExtensionRe.test(specifier)) {
    interopAttempts.push(`${specifier}.mjs`);
    interopAttempts.push(`${specifier}/index.mjs`);
    // Last attempts are normal `.js` extensions. These could still
    // be valid ESM when there is an type:module `package.json` file
    interopAttempts.push(`${specifier}.js`);
    interopAttempts.push(`${specifier}/index.js`);
  }

  for (const attempt of interopAttempts) {
    try {
      return await nextResolve(attempt, context);
    } catch {}
  }

  // Original specifier is attempted at the end because
  // we want to prioritize the ESM variants first.
  return await nextResolve(specifier, context);
}
