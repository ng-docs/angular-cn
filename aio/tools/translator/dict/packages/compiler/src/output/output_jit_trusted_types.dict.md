While Angular only uses Trusted Types internally for the time being,
references to Trusted Types could leak into our core.d.ts, which would force
anyone compiling against &commat;angular/core to provide the &commat;types/trusted-types
package in their compilation unit.

虽然 Angular 暂时仅在内部使用受信任类型，但对受信任类型的引用可能会泄漏到我们的 core.d.ts
中，这将迫使任何针对 &commat;angular/core 编译的人在他们的编译单元中提供 &commat;types/trusted-types 包.

Until https://github.com/microsoft/TypeScript/issues/30024 is resolved, we
will keep Angular's public API surface free of references to Trusted Types.
For internal and semi-private APIs that need to reference Trusted Types, the
minimal type definitions for the Trusted Types API provided by this module
should be used instead. They are marked as "declare" to prevent them from
being renamed by compiler optimization.

在解决 https://github.com/microsoft/TypeScript/issues/30024 之前，我们将保持 Angular 的公共 API
图面不存在对受信任类型的引用。对于需要引用受信任类型的内部和半私有
API，应改为使用此模块提供的受信任类型 API
的最小类型定义。它们被标记为“declare”，以防止它们被编译器优化重命名。

Adapted from
https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/trusted-types/index.d.ts
but restricted to the API surface used within Angular.

改编自 https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/trusted-types/index.d.ts
，但仅限于 Angular 中使用的 API 图面。

The Trusted Types policy, or null if Trusted Types are not
enabled/supported, or undefined if the policy has not been created yet.

受信任的类型策略，如果未启用/支持受信任的类型，则为 null，如果尚未创建策略，则为 undefined。

Returns the Trusted Types policy, or null if Trusted Types are not
enabled/supported. The first call to this function will create the policy.

返回受信任的类型策略，如果不启用/支持受信任的类型，则返回 null。对此函数的第一次调用将创建策略。

Unsafely promote a string to a TrustedScript, falling back to strings when
Trusted Types are not available.

将字符串不安全地提升为 TrustedScript，在受信任的类型不可用时回退为字符串。

Unsafely call the Function constructor with the given string arguments.

使用给定的字符串参数不安全地调用 Function 构造函数。