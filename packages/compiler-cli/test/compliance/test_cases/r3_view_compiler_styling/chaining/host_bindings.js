 // ...
 MyComponent.ɵcmp = /*@__PURE__*/ $r3$.ɵɵdefineComponent({
  // ...
  hostBindings: function MyComponent_HostBindings(rf, $ctx$) {
    // ...
    if (rf & 2) {
      $r3$.ɵɵstyleProp("color", $ctx$.color)("transition", $ctx$.transition)("border", $ctx$.border);
      $r3$.ɵɵclassProp("apple", $ctx$.yesToApple)("tomato", $ctx$.yesToTomato)("orange", $ctx$.yesToOrange);
    }
  },
  // ...
});
