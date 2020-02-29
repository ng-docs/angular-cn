#!/usr/bin/env node
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

'use strict';

const {buildZoneJsPackage} = require('./zone-js-builder');
const {buildTargetPackages} = require('./package-builder');


// Build the legacy (view engine) npm packages into `dist/packages-dist/`.
buildTargetPackages('dist/packages-dist', false, 'Production');

// Build the `zone.js` npm package into `dist/zone.js-dist/`, because it might be needed by other
// scripts/tests.
buildZoneJsPackage();
