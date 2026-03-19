/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let c_term_parse, c_term_reduce, c_term_print, c_term_display;
Module.onRuntimeInitialized = () => {
    c_term_parse = Module.cwrap("term_parse_wrapper", "number", ["string"]);
    c_term_reduce = Module.cwrap("term_reduce_wrapper", "bool", [
        "number",
        "bool",
    ]);
    c_term_display = (term) => {
        // another layer of wrapping for automatic conversion between c string
        // and js string
        if (c_term_display.f == undefined) {
            c_term_display.f = Module.cwrap("term_display_wrapper", "number", [
                "number",
            ]);
        }
        let str_ptr = c_term_display.f(term);
        let str = Module.UTF8ToString(str_ptr);
        Module._free(str_ptr);
        return str;
    };
};
