The Sampler owns the sample loop:

Sampler 拥有示例循环：

calls the prepare/execute callbacks,

调用 prepare/execute 回调

gets data from the metric

从度量中获取数据

asks the validator for a valid sample

向验证器请求有效样本

reports the new data to the reporter

将新数据报告给报告器

loop until there is a valid sample

循环直到有有效样本