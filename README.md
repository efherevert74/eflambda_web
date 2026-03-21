# Eflambda Web

Give it a try at [efherevert74.github.io][site]!

## About

Web interface for lambda calculus interpreter.
Written in plain JS and CSS.
Uses [eflambda.h][eflambda] C library (through WebAssembly) for working with
lambda expressions.

## Library

Interpreter by default defines a lot of classical lambda calculus symbols:
numbers (in Church encoding), booleans, logic, arithmetic, combinators, etc.
You can check them all in the `eflambda/eflambda_std.h` file.

## Requirements

1. make (GNU make or MinGW make).
1. [emcc][emcc] compiler (Emscripten SDK) for compiling to WASM.

## Running

1.  Clone the repository:

    ```bash
    git clone https://github.com/efherevert74/eflambda_web
    cd eflambda_web
    ```

1.  Clone [eflambda][eflambda] into the current directory:

    ```bash
    git clone https://github.com/efherevert74/eflambda
    ```

1.  Download [`stb_ds.h`][stb_ds] and put it in the `eflambda` directory.

1.  Set up Emscripten SDK environment:

    ```bash
    ./emsdk_env
    ```

1.  Rename `Makefile.example` to `Makefile` and build with make:
    You can also modify the Makefile to use another compiler, cflags, or libpaths.

    ```bash
    mv Makefile.example Makefile
    make
    ```

1.  This will create `./target/` directory and compile required C code into
    a WASM module.

    ```bash
    ./target/lambda
    ```

1.  Set up a http server. E.g. python http server:

    ```bash
    python -m http.server 8000
    ```

    Or you can use `make run` to do that automatically.

1.  Open http://localhost:8000/ in your browser.

[site]: https://efherevert74.github.io/eflambda_web/
[eflambda]: https://github.com/efherevert74/eflambda
[stb_ds]: https://github.com/nothings/stb/
[emcc]: https://emscripten.org/
