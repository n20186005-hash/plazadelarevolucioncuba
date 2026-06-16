#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re

gallery_dir = r"C:\Users\Administrator\Documents\GitHub\萨尔瓦多\parque-natural-cerro-verde\public\gallery"

# Change to gallery directory
os.chdir(gallery_dir)

# Get all devils-gate files
files = [f for f in os.listdir('.') if f.startswith('devils-gate (') and f.endswith('.jpg')]

print(f"Found {len(files)} files to rename")

# Rename each file
for filename in sorted(files):
    # Extract the number
    match = re.search(r'devils-gate \(([0-9]+)\)\.jpg', filename)
    if match:
        num = match.group(1)
        new_name = f'parque-natural-cerro-verde ({num}).jpg'
        print(f"Renaming: {filename} -> {new_name}")
        os.rename(filename, new_name)

print("Done!")

# List the renamed files
print("\nRenamed files:")
for f in sorted(os.listdir('.')):
    if f.startswith('parque-natural-cerro-verde ('):
        print(f"  {f}")
