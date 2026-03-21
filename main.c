#include "eflambda.h"
#include "eflambda_std.h"
#include <stdbool.h>

VarLib *lib = NULL;

int var_lib_get_len() { return shlen(lib); }

Term *var_lib_get_term(int idx) { return term_copy(&lib[idx].value); }

VarLib *var_lib_get() { return lib; }

char *term_display_wrapper(Term *term) {
    int buf_len = term_display(NULL, 0, term);
    char *str = malloc(buf_len);
    term_display(str, buf_len, term);
    return str;
}

Term *term_parse_commit_wrapper(char *str) {
    return term_parse(&str, &lib, false);
}

Term *term_parse_preview_wrapper(char *str) {
    return term_parse(&str, &lib, true);
}

bool term_reduce_wrapper(Term *term, bool lazy) {
    return term_reduce(term, &lib, lazy);
}

bool term_is_inv(Term *term) { return term->type == TInv; }

void var_lib_clear() { lib = NULL; }

void var_lib_fill_std() { fill_std_lib(&lib); }
