&ngsp; is a placeholder for non-removable space
&ngsp; is converted to the 0xE500 PUA \(Private Use Areas\) unicode character
and later on replaced by a space.

&ngsp; 是不可移动空间的占位符 &ngsp; 转换为 0xE500 PUA（专用区域）unicode 字符，然后由空格替换。

This visitor can walk HTML parse tree and remove / trim text nodes using the following rules:

此访问者可以用以下规则遍历 HTML 解析树并删除/修剪文本节点：

consider spaces, tabs and new lines as whitespace characters;

将空格、制表符和新行视为空格字符；

drop text nodes consisting of whitespace characters only;

删除仅由空格字符组成的文本节点；

for all other text nodes replace consecutive whitespace characters with one space;

对于所有其他文本节点，将连续的空格字符替换为一个空格；

convert &ngsp; pseudo-entity to a single space;

转换 &ngsp;单个空间的伪实体；

Removal and trimming of whitespaces have positive performance impact \(less code to generate
while compiling templates, faster view creation\). At the same time it can be "destructive"
in some cases \(whitespaces can influence layout\). Because of the potential of breaking layout
this visitor is not activated by default in Angular 5 and people need to explicitly opt-in for
whitespace removal. The default option for whitespace removal will be revisited in Angular 6
and might be changed to "on" by default.

删除和修剪空格对性能有积极影响（编译模板时要生成的代码更少，创建视图更快）。同时，在某些情况下它可能是“破坏性的”（空格会影响布局）。由于可能会破坏布局，因此默认情况下在
Angular 5 中不会激活此访问器，人们需要显式选择加入删除空格。删除空格的默认选项将在 Angular 6
中重新访问，默认情况下可能会更改为“on”。