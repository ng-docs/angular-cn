A WebDriverExtension implements extended commands of the webdriver protocol
for a given browser, independent of the WebDriverAdapter.
Needs one implementation for every supported Browser.

WebDriverExtension 为给定的浏览器实现 Webdriver 协议的扩展命令，独立于 WebDriverAdapter
。每个受支持的浏览器都需要一个实现。

Format:

格式：

cat: category of the event

cat：事件的类别

name: event name: 'script', 'gc', 'render', ...

名称：事件名称：'script', 'gc', 'render', ...

ph: phase: 'B' \(begin\), 'E' \(end\), 'X' \(Complete event\), 'I' \(Instant event\)

ph：phase：“B”（开始），“E”（结束），“X”（完成事件），“I”（即时事件）

ts: timestamp in ms, e.g. 12345

ts：以 ms 为单位的时间戳，例如 12345

pid: process id

pid：进程 ID

args: arguments, e.g. {heapSize: 1234}

args：参数，例如 {heapSize: 1234}

Based on [Chrome Trace Event
Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit)

基于[Chrome
跟踪事件格式](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit)