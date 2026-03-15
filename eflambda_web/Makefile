TARGET_DIR := ./target
LAMBDA_DIR := ../lambda
TARGET := $(TARGET_DIR)/module.wasm

CC := zig cc

$(TARGET): main.c $(LAMBDA_DIR)/lambda.h | $(TARGET_DIR)
	$(CC) $< -o $@ -target wasm32-wasi -I$(LAMBDA_DIR) -lc

$(TARGET_DIR):
	mkdir -p $@

clean:
	rm -r $(TARGET_DIR)

.PHONY: run clean
