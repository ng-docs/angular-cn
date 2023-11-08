An operation usable on the update side of the IR.



A logical operation to perform string interpolation on a text node.



Interpolation inputs are stored as static `string`s and dynamic `o.Expression`s, in separate
arrays. Thus, the interpolation `A{{b}}C{{d}}E` is stored as 3 static strings `['A', 'C', 'E']`
and 2 dynamic expressions `[b, d]`.



Reference to the text node to which the interpolation is bound.



All of the literal strings in the text interpolation, in order.



Conceptually interwoven around the `expressions`.



All of the dynamic expressions in the text interpolation, in order.



Conceptually interwoven in between the `strings`.



Create an `InterpolationTextOp`.



A logical operation representing binding to a property in the update IR.



Reference to the element on which the property is bound.



Name of the bound property.



Expression which is bound to the property.



Create a `PropertyOp`.



A logical operation representing binding an interpolation to a property in the update IR.



All of the literal strings in the property interpolation, in order.



All of the dynamic expressions in the property interpolation, in order.



Create a `InterpolateProperty`.



Logical operation to advance the runtime's internal slot pointer in the update IR.



Delta by which to advance the pointer.



Create an `AdvanceOp`.