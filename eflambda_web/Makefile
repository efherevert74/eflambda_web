TARGET_DIR := ./target
LAMBDA_DIR := ../lambda
TARGET := $(TARGET_DIR)/module.wasm

CC := zig cc
CFLAGS := -target wasm32-wasi -I$(LAMBDA_DIR) -lc
# no way without wasi/musl/etc because stb_ds uses string.h
# CFLAGS := -target wasm32-freestanding -I$(LAMBDA_DIR)

$(TARGET): main.c $(LAMBDA_DIR)/lambda.h | $(TARGET_DIR)
	$(CC) $< -o $@ $(CFLAGS)

$(TARGET_DIR):
	mkdir -p $@

clean:
	rm -r $(TARGET_DIR)

.PHONY: run clean
