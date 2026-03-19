LAMBDA_DIR := ../lambda
TARGET_DIR := ./target
TARGET := $(TARGET_DIR)/lambda.js

CC := emcc
CFLAGS := -I$(LAMBDA_DIR) \
		  -sEXPORTED_FUNCTIONS='\
		  _main,_term_display_wrapper,_term_reduce_wrapper,_term_parse_wrapper,\
		  _term_free,\
		  _malloc,_free\
		  '\
		  -sEXPORTED_RUNTIME_METHODS=ccall,cwrap,UTF8ToString,stringToUTF8 \
		  --post-js init_c_wrappers.js

$(TARGET): main.c $(LAMBDA_DIR)/lambda.h init_c_wrappers.js | $(TARGET_DIR)
	$(CC) $< -o $@ $(CFLAGS)

$(TARGET_DIR):
	mkdir -p $(TARGET_DIR)

clean:
	rm -r $(TARGET_DIR)

run: $(TARGET)
	python -m http.server 8000

.PHONY: run clean
