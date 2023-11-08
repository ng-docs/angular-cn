The list of known control flow directives present in the `CommonModule`,
and their corresponding imports.



Note: there is no `ngSwitch` here since it's typically used as a regular
binding \(e.g. `[ngSwitch]`\), however the `ngSwitchCase` and `ngSwitchDefault`
are used as structural directives and a warning would be generated. Once the
`CommonModule` is included, the `ngSwitch` would also be covered.



Ensures that there are no known control flow directives \(such as *ngIf and *ngFor\)
used in a template of a *standalone* component without importing a `CommonModule`. Returns
diagnostics in case such a directive is detected.



Note: this check only handles the cases when structural directive syntax is used \(e.g. `*ngIf`\).
Regular binding syntax \(e.g. `[ngIf]`\) is handled separately in type checker and treated as a
hard error instead of a warning.