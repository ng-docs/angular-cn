.ɵɵelementStart(0, "div") // SOURCE: "/extraRootDir/dir/extra.html" "<div>"
…
.ɵɵtext(1, "this is a test") // SOURCE: "/extraRootDir/dir/extra.html" "this is a test"
…
.ɵɵelementEnd() // SOURCE: "/extraRootDir/dir/extra.html" "</div>\n"
…
.ɵɵelementStart(2, "div") // SOURCE: "/extraRootDir/dir/extra.html" "<div>"
…
.ɵɵtext(3) // SOURCE: "/extraRootDir/dir/extra.html" "{{ 1 + 2 }}"
…
.ɵɵelementEnd() // SOURCE: "/extraRootDir/dir/extra.html" "</div>"
…
.ɵɵtextInterpolate(1 + 2) // SOURCE: "/extraRootDir/dir/extra.html" "{{ 1 + 2 }}"
