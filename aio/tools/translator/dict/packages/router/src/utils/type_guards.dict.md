Simple function check, but generic so type inference will flow. Example:

简单的函数检查，但是通用的，因此类型推断会流动。示例：

function product\(a: number, b: number\) {
  return a \* b;
}

函数 product\(a: number, b: number\) { return a \* b; }

if \(isFunction<product>\(fn\)\) {
  return fn\(1, 2\);
} else {
  throw "Must provide the `product` function";
}

if \(isFunction<product>\(fn\)\) { return fn\(1, 2\); } else { throw “必须提供 `product` 函数”; }