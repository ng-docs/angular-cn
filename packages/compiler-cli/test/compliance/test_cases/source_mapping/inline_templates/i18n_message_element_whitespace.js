` pre-p ${ // SOURCE: "/i18n_message_element_whitespace.ts" pre-p\\n  
…
"\uFFFD#2\uFFFD" // SOURCE: "/i18n_message_element_whitespace.ts" <p>\\n    
…
}:START_PARAGRAPH: in-p ${ // SOURCE: "/i18n_message_element_whitespace.ts" in-p\\n  
…
"\uFFFD/#2\uFFFD" // SOURCE: "/i18n_message_element_whitespace.ts" </p>
…
}:CLOSE_PARAGRAPH: post-p\n` // SOURCE: "/i18n_message_element_whitespace.ts" post-p\\n
…

i0.ɵɵelementStart(0, "div") // SOURCE: "/i18n_message_element_whitespace.ts" <div i18n>
…
i0.ɵɵi18nStart(1, 0) // SOURCE: "/i18n_message_element_whitespace.ts" <div i18n>
…
i0.ɵɵelement(2, "p") // SOURCE: "/i18n_message_element_whitespace.ts" <p>\\n    
…
i0.ɵɵi18nEnd() // SOURCE: "/i18n_message_element_whitespace.ts" </div>
…
i0.ɵɵelementEnd() // SOURCE: "/i18n_message_element_whitespace.ts" </div>
