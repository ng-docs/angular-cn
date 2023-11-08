The Trusted Types policy, or null if Trusted Types are not
enabled/supported, or undefined if the policy has not been created yet.

受信任的类型策略，如果不启用/支持受信任的类型，则为 null，如果尚未创建策略，则为 undefined。

Returns the Trusted Types policy, or null if Trusted Types are not
enabled/supported. The first call to this function will create the policy.

返回受信任的类型策略，如果不启用/支持受信任的类型，则返回 null。对此函数的第一次调用将创建策略。

Unsafely promote a string to a TrustedHTML, falling back to strings when
Trusted Types are not available.

将字符串不安全地提升为 TrustedHTML，在受信任的类型不可用时回退为字符串。

Unsafely promote a string to a TrustedScript, falling back to strings when
Trusted Types are not available.

将字符串不安全地提升为 TrustedScript，在受信任的类型不可用时回退为字符串。

Unsafely promote a string to a TrustedScriptURL, falling back to strings
when Trusted Types are not available.

将字符串不安全地提升为 TrustedScriptURL，在受信任的类型不可用时回退为字符串。