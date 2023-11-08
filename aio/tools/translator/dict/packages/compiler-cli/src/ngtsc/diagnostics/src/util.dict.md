The formatted diagnostics

格式化的诊断

During formatting of `ts.Diagnostic`s, the numeric code of each diagnostic is prefixed with the
hard-coded "TS" prefix. For Angular's own error codes, a prefix of "NG" is desirable. To achieve
this, all Angular error codes start with "-99" so that the sequence "TS-99" can be assumed to
correspond with an Angular specific error code. This function replaces those occurrences with
just "NG".

在格式化 `ts.Diagnostic` s 期间，每个诊断的数字代码都以硬编码的“TS”前缀为前缀。对于 Angular
自己的错误代码，需要“NG”前缀。为了实现这一点，所有 Angular
错误代码都以“-99”开头，以便可以假定序列“TS-99”与某个 Angular 特定的错误代码相对应。此函数仅用
“NG” 替换这些出现的位置。