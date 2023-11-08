The strategy that the default change detector uses to detect changes.
When set, takes effect the next time change detection is triggered.

默认变更检测器用来检测更改的策略。设置后，将在下次触发变更检测时生效。

Use the `CheckOnce` strategy, meaning that automatic change detection is deactivated
until reactivated by setting the strategy to `Default` \(`CheckAlways`\).
Change detection can still be explicitly invoked.
This strategy applies to all child directives and cannot be overridden.

使用 `CheckOnce` 策略，这意味着把此策略设置为 `Default`（`CheckAlways`
）将禁用自动变更检测，直到重新激活。变更检测仍然可以显式调用。此策略适用于所有子指令，并且不能被覆盖。

Use the default `CheckAlways` strategy, in which change detection is automatic until
explicitly deactivated.

使用默认的 `CheckAlways` 策略，在该策略中，变更检测将自动执行，直到显式停用为止。