Raw translation string for post processing

用于后处理的原始翻译字符串

Set of replacements that should be applied

应该应用的替换集

Transformed string that can be consumed by i18nStart instruction

i18nStart 指令可以用的转换字符串

Handles message string post-processing for internationalization.

处理消息字符串的后处理以进行国际化。

Handles message string post-processing by transforming it from intermediate
format \(that might contain some markers that we need to replace\) to the final
form, consumable by i18nStart instruction. Post processing steps include:

通过将消息字符串从中间格式（可能包含我们需要替换的一些标记）转换为可由 i18nStart
指令使用的最终形式来处理消息字符串的后处理。后处理步骤包括：

Resolve all multi-value cases \(like `[�*1:1��#2:1�|�#4:1�|�5�]`\)

解析所有多值情况（例如 `[�*1:1��#2:1�|�#4:1�|�5�]`）

Replace all ICU vars \(like "VAR_PLURAL"\)

替换所有 ICU var（例如 “VAR_PLURAL”）

Replace all placeholders used inside ICUs in a form of {PLACEHOLDER}

以 {PLACEHOLDER} 的形式替换 ICU 中使用的所有占位符

Replace all ICU references with corresponding values \(like �ICU_EXP_ICU_1�\)
in case multiple ICUs have the same placeholder name

如果多个 ICU 具有相同的占位符名称，则将所有 ICU 引用替换为相应的值（例如 “ICU_EXP_ICU_1”）

Step 1: resolve all multi-value placeholders like [�#5�|�*1:1��#2:1�|�#4:1�]

步骤 1：解析所有多值占位符，例如 [�#5�|�\*1:1��#2:1�|。#4:1。][�#5�|�*1:1��#2:1�|�#4:1�]

Note: due to the way we process nested templates \(BFS\), multi-value placeholders are typically
grouped by templates, for example: [�#5�|�#6�|�#1:1�|�#3:2�] where �#5� and �#6� belong to root
template, �#1:1� belong to nested template with index 1 and �#1:2� - nested template with index 3. However in real templates the order might be different: i.e. �#1:1� and/or �#3:2� may go in
front of �#6�. The post processing step restores the right order by keeping track of the
template id stack and looks for placeholders that belong to the currently active template.

注意：由于我们处理嵌套模板（BFS）的方式，多值占位符通常按模板分组，例如：
[“#5�|。#6。|�#1:1。|。#3:2。][�#5�|�#6�|�#1:1�|�#3:2�]其中 “#5” 和 “#6” 属于根模板，“#1:1”
属于索引为 1 的嵌套模板，而“#1:2” - 索引为 3
的嵌套模板。但是在真实模板中，顺序可能是不同：即“#1:1”和/或“#3:2”可能会在“#6”前面。后处理步骤通过跟踪模板
ID 堆栈来恢复正确的顺序，并寻找属于当前活动模板的占位符。

Step 2: replace all ICU vars \(like "VAR_PLURAL"\)

步骤 2：替换所有 ICU var（例如“VAR_PLURAL”）

Step 3: replace all placeholders used inside ICUs in a form of {PLACEHOLDER}

第 3 步：以 {PLACEHOLDER} 的形式替换 ICU 中使用的所有占位符

Step 4: replace all ICU references with corresponding values \(like ICU_EXP_ICU_1\) in case
multiple ICUs have the same placeholder name

步骤 4：用相应的值（例如 “ICU_EXP_ICU_1”）替换所有 ICU 引用，以防多个 ICU 具有相同的占位符名称