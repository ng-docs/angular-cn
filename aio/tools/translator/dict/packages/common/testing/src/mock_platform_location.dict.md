Parser from https://tools.ietf.org/html/rfc3986#appendix-B
`^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?`
 12            3  4          5       6  7        8 9

来自[https://tools.ietf.org/html/rfc3986#appendix-B 的](https://tools.ietf.org/html/rfc3986#appendix-B)`^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?` 12 3 4 5 6 7 8 9

Example: http://www.ics.uci.edu/pub/ietf/uri/#Related

示例：http&#x3A; [//www.ics.uci.edu/pub/ietf/uri/#Related](http://www.ics.uci.edu/pub/ietf/uri/#Related)

Results in:

结果是：

$1 = http&#x3A;
$2 = http
$3 = //www.ics.uci.edu
$4 = www.ics.uci.edu
$5 = /pub/ietf/uri/
$6 = <undefined>
$7 = <undefined>
$8 = #Related
$9 = Related



$1 = http&#x3A; $2 = http $3 = //www.ics.uci.edu $4 = www.ics.uci.edu $5 = /pub/ietf/uri/ $6 =



Mock platform location config

模拟平台的 location 配置

Provider for mock platform location config

模拟平台 location 配置的提供者

Mock implementation of URL state.

URL 状态的模拟实现。