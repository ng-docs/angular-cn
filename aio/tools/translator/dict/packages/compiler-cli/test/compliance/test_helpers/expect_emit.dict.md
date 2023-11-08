Back-ticks are escaped as "\`" so we must strip the backslashes.
Also the string will likely contain interpolations and if an interpolation holds an
identifier we will need to match that later. So tokenize the interpolation too!

反引号被转译为“\`”，因此我们必须剥离反斜杠。此外，字符串可能会包含插值，如果插值包含一个标识符，我们将需要稍后匹配它。所以也要对插值进行标记！