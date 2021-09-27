#!/usr/bin/env node
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// Must be imported first, because Angular decorators throw on load.
import 'reflect-metadata';

import {NodeJSFileSystem, setFileSystem} from '../ngtsc/file_system';
import {main} from '../main';

process.title = 'Angular Compiler (ngc)';
const args = process.argv.slice(2);
// We are running the real compiler so run against the real file-system
setFileSystem(new NodeJSFileSystem());
process.exitCode = main(args);
