LAMBDA_DIR := ../lambda
TARGET_DIR := ./target
TARGET := $(TARGET_DIR)/lambda.js

CC := emcc
CFLAGS := -I$(LAMBDA_DIR)

$(TARGET): main.c $(LAMBDA_DIR)/lambda.h | $(TARGET_DIR)
	$(CC) $< -o $@ $(CFLAGS)

$(TARGET_DIR):
	mkdir -p $(TARGET_DIR)

clean:
	rm -r $(TARGET_DIR)

.PHONY: run clean
