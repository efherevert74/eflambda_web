#include "lambda.h"

int main() {
    VarLib *lib = NULL;
    char *src = "Id = \\x.x";
    Term* term = term_parse(&src, &lib);
    return 0;
}

