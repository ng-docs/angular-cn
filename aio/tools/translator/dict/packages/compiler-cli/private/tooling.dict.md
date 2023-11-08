Known values for global variables in `@angular/core` that Terser should set using
https://github.com/terser-js/terser#conditional-compilation

Terser
应该使用 https://github.com/terser-js/terser#conditional-compilation 设置的
`@angular/core` 中全局变量的已知值

Transform for downleveling Angular decorators and Angular-decorated class constructor
parameters for dependency injection. This transform can be used by the CLI for JIT-mode
compilation where constructor parameters and associated Angular decorators should be
downleveled so that apps are not exposed to the ES2015 temporal dead zone limitation
in TypeScript. See https://github.com/angular/angular-cli/pull/14473 for more details.

用于下级 Angular 装饰器的转换和用于依赖注入的 Angular 装饰类构造函数参数。CLI 可以用此转换进行
JIT 模式编译，其中的构造函数参数和关联的 Angular 装饰器应该被降级，以便应用程序不会受到
TypeScript 中的 ES2015
时间死区限制。有关更多详细信息，请参阅 https://github.com/angular/angular-cli/pull/14473。