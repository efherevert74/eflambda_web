/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let c_var_lib_get_len,
    c_var_lib_get_term,
    c_var_lib_get,
    c_var_lib_fill_std,
    c_var_lib_clear;
let c_term_parse_commit,
    c_term_parse_preview,
    c_term_reduce,
    c_term_free,
    c_term_display,
    c_term_is_inv;
Module.onRuntimeInitialized = () => {
    c_term_free = Module.cwrap("term_free", "void", ["number"]);
    c_term_parse_commit = Module.cwrap("term_parse_commit_wrapper", "number", [
        "string",
    ]);
    c_term_parse_preview = Module.cwrap(
        "term_parse_preview_wrapper",
        "number",
        ["string"],
    );
    c_term_reduce = Module.cwrap("term_reduce_wrapper", "bool", [
        "number",
        "bool",
    ]);
    c_term_is_inv = Module.cwrap("term_is_inv", "bool", ["number"]);
    c_term_display = (term) => {
        // another layer of wrapping for automatic conversion between c string
        // and js string
        if (c_term_display.f == undefined) {
            c_term_display.f = Module.cwrap("term_display_wrapper", "number", [
                "number",
            ]);
        }

        if (c_term_is_inv(term)) {
            return "Invalid lambda term.";
        }

        let str_ptr = c_term_display.f(term);
        let str = Module.UTF8ToString(str_ptr);
        str = str.replaceAll("\\", "λ");
        Module._free(str_ptr);
        return str;
    };

    c_var_lib_get = () => {
        if (
            c_var_lib_get.get_lib === undefined ||
            c_var_lib_get.get_len === undefined
        ) {
            c_var_lib_get.get_lib = Module.cwrap("var_lib_get", "number", []);
            c_var_lib_get.get_len = Module.cwrap(
                "var_lib_get_len",
                "number",
                [],
            );
        }
        let lib = c_var_lib_get.get_lib();
        let len = c_var_lib_get.get_len();
        const sizeof_varlib = 16; // char* and Term*
        const offsetof_term = 4; // sizeof(char*)

        let res = {};
        for (
            let lib_i = lib;
            lib_i < lib + len * sizeof_varlib;
            lib_i += sizeof_varlib
        ) {
            let key_ptr = Module.HEAP32[lib_i >> 2];
            let term_ptr = lib_i + offsetof_term;

            let key = Module.UTF8ToString(key_ptr);
            let term_str = c_term_display(term_ptr);

            res[key] = term_str;
        }
        return res;
    };
    c_var_lib_fill_std = Module.cwrap("var_lib_fill_std", "void", []);
    c_var_lib_clear = Module.cwrap("var_lib_clear", "void", []);

    document.dispatchEvent(new CustomEvent("WASMReady"));
};
