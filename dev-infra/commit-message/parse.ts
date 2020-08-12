/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/** A parsed commit message. */
export interface ParsedCommitMessage {
  header: string;
  body: string;
  bodyWithoutLinking: string;
  type: string;
  scope: string;
  subject: string;
  isFixup: boolean;
  isSquash: boolean;
  isRevert: boolean;
}

/** Regex determining if a commit is a fixup. */
const FIXUP_PREFIX_RE = /^fixup! /i;
/** Regex finding all github keyword links. */
const GITHUB_LINKING_RE = /((closed?s?)|(fix(es)?(ed)?)|(resolved?s?))\s\#(\d+)/ig;
/** Regex determining if a commit is a squash. */
const SQUASH_PREFIX_RE = /^squash! /i;
/** Regex determining if a commit is a revert. */
const REVERT_PREFIX_RE = /^revert:? /i;
/** Regex determining the scope of a commit if provided. */
const TYPE_SCOPE_RE = /^(\w+)(?:\(([^)]+)\))?\:\s(.+)$/;
/** Regex determining the entire header line of the commit. */
const COMMIT_HEADER_RE = /^(.*)/i;
/** Regex determining the body of the commit. */
const COMMIT_BODY_RE = /^.*\n\n([\s\S]*)$/;

/** Parse a full commit message into its composite parts. */
export function parseCommitMessage(commitMsg: string): ParsedCommitMessage {
  let header = '';
  let body = '';
  let bodyWithoutLinking = '';
  let type = '';
  let scope = '';
  let subject = '';

  if (COMMIT_HEADER_RE.test(commitMsg)) {
    header = COMMIT_HEADER_RE.exec(commitMsg)![1]
                 .replace(FIXUP_PREFIX_RE, '')
                 .replace(SQUASH_PREFIX_RE, '');
  }
  if (COMMIT_BODY_RE.test(commitMsg)) {
    body = COMMIT_BODY_RE.exec(commitMsg)![1];
    bodyWithoutLinking = body.replace(GITHUB_LINKING_RE, '');
  }

  if (TYPE_SCOPE_RE.test(header)) {
    const parsedCommitHeader = TYPE_SCOPE_RE.exec(header)!;
    type = parsedCommitHeader[1];
    scope = parsedCommitHeader[2];
    subject = parsedCommitHeader[3];
  }
  return {
    header,
    body,
    bodyWithoutLinking,
    type,
    scope,
    subject,
    isFixup: FIXUP_PREFIX_RE.test(commitMsg),
    isSquash: SQUASH_PREFIX_RE.test(commitMsg),
    isRevert: REVERT_PREFIX_RE.test(commitMsg),
  };
}
