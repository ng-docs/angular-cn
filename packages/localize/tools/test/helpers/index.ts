/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {setFileSystem} from '@angular/compiler-cli/src/ngtsc/file_system';
import {InvalidFileSystem} from '@angular/compiler-cli/src/ngtsc/file_system/src/invalid_file_system';
import {MockFileSystemNative} from '@angular/compiler-cli/src/ngtsc/file_system/testing';

/**
 * Only run these tests on the "native" file-system.
 *
 * 仅在“本机”文件系统上运行这些测试。
 *
 * Babel uses the `path.resolve()` function internally, which makes it very hard to mock out the
 * file-system from the outside. We run these tests on Unix and Windows in our CI jobs, so there is
 * test coverage.
 *
 * Babel 在内部使用 `path.resolve()` 函数，这使得从外部模拟文件系统变得非常困难。我们在 CI 作业中在
 * Unix 和 Windows 上运行这些测试，因此有测试覆盖率。
 *
 */
export function runInNativeFileSystem(callback: () => void) {
  describe(`<<FileSystem: Native>>`, () => {
    beforeEach(() => setFileSystem(new MockFileSystemNative()));
    afterEach(() => setFileSystem(new InvalidFileSystem()));
    callback();
  });
}
