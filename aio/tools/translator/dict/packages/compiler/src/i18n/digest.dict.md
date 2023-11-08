A lazily created TextEncoder instance for converting strings into UTF-8 bytes

用于将字符串转换为 UTF-8 字节的延迟创建的 TextEncoder 实例

Return the message id or compute it using the XLIFF1 digest.

返回消息 ID 或使用 XLIFF1 摘要计算它。

Compute the message id using the XLIFF1 digest.

使用 XLIFF1 摘要计算消息 ID。

Return the message id or compute it using the XLIFF2/XMB/$localize digest.

返回消息 ID 或使用 XLIFF2/XMB/$localize 摘要计算它。

Compute the message id using the XLIFF2/XMB/$localize digest.

使用 XLIFF2/XMB/$localize 摘要计算消息 ID。

Serialize the i18n ast to something xml-like in order to generate an UID.

将 i18n ast 序列化为类似于 xml 的内容以生成 UID。

The visitor is also used in the i18n parser tests

访问器还用于 i18n 解析器测试

Ignore the ICU expressions so that message IDs stays identical if only the expression changes.

忽略 ICU 表达式，以便在仅表达式更改时消息 ID 保持相同。

Compute the SHA1 of the given string

计算给定字符串的 SHA1

see https://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf

看到 https://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf

WARNING: this function has not been designed not tested with security in mind.
         DO NOT USE IT IN A SECURITY SENSITIVE CONTEXT.

警告：此功能的设计没有考虑到安全性。不要在安全敏感的上下文中使用它。

The value to format as a string.

要格式化为字符串的值。

A hexadecimal string representing the value.

表示值的十六进制字符串。

Convert and format a number as a string representing a 32-bit unsigned hexadecimal number.

将数字转换并格式化为表示 32 位无符号十六进制数的字符串。

Compute the fingerprint of the given string

计算给定字符串的指纹

The output is 64 bit number encoded as a decimal string

输出是编码为十进制字符串的 64 位数字

based on:
https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/GoogleJsMessageIdGenerator.java

基于：
https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/GoogleJsMessageIdGenerator.java

Create a shared exponentiation pool for base-256 computations. This shared pool provides memoized
power-of-256 results with memoized power-of-two computations for efficient multiplication.

为 base-256 计算创建一个共享幂池。此共享池提供了记忆化的 256
次幂结果和记忆化的二次幂计算，以实现高效的乘法。

For our purposes, this can be safely stored as a global without memory concerns. The reason is
that we encode two words, so only need the 0th \(for the low word\) and 4th \(for the high word\)
exponent.

就我们的目的而言，这可以安全地存储为全局而不存在内存问题。原因是我们对两个词进行了编码，因此只需要第
0 位（用于低位字）和第 4 位（用于高位字）的指数。

Represents two 32-bit words as a single decimal number. This requires a big integer storage
model as JS numbers are not accurate enough to represent the 64-bit number.

将两个 32 位字表示为单个十进制数。这需要一个大整数存储模型，因为 JS 数字不足以表示 64 位数字。

Based on https://www.danvk.org/hex2dec.html

基于 https://www.danvk.org/hex2dec.html