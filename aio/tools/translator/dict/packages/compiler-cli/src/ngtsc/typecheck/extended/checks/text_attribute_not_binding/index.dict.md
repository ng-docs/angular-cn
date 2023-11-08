Ensures that attributes that have the "special" angular binding prefix \(attr., style., and
class.\) are interpreted as bindings. For example, `<div attr.id="my-id"></div>` will not
interpret this as an `AttributeBinding` to `id` but rather just a `TmplAstTextAttribute`. This
is likely not the intent of the developer. Instead, the intent is likely to have the `id` be set
to 'my-id'.