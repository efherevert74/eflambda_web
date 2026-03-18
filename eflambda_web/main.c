#include "lambda.h"
#include "lambda_std.h"

VarLib *lib = NULL;

char* term_display_wrapper(Term *term) {
    int buf_len = term_display(NULL, 0, term);
    char *str = malloc(buf_len);
    term_display(str, buf_len, term);
    return str;
}

Term* term_parse_wrapper(char* str) {
    return term_parse(&str, &lib);
}

bool term_reduce_wrapper(Term *term, bool lazy) {
    return term_reduce(term, &lib, lazy);
}

int main() {
    fill_std_lib(&lib);
    return 0;
}
