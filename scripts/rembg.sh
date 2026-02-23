#!/usr/bin/env bash

# Bulk background removal using rembg
# Usage: ./remove-bg.sh input_folder output_folder

INPUT_DIR="$1"
OUTPUT_DIR="$2"

if [ -z "$INPUT_DIR" ] || [ -z "$OUTPUT_DIR" ]; then
  echo "Usage: $0 <input_folder> <output_folder>"
  exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "Processing images from $INPUT_DIR ..."
rembg p "$INPUT_DIR" "$OUTPUT_DIR"
echo "Done! Transparent PNGs saved to $OUTPUT_DIR"
