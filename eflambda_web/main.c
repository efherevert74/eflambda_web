#include "lambda.h"

#include <stdio.h>

int main() {
    VarLib *lib = NULL;
    char *str = "Id = \\x.x";
    Term *term = term_parse(&str, &lib);

    char buf[1024];
    term_display(buf, sizeof(buf), term);
    printf("%s\n", buf);

    return 0;
}
