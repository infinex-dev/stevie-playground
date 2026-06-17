# coder-e2e Artifacts Report

These artifacts are an end-to-end smoke fixture for exercising the coder sandbox
on a large-file edge case. They are additive only and do not affect the library
source or tests.

## large-input.txt summary

- **Total line count:** 30000
- **Total byte size:** 1668894 bytes (~1.59 MiB, well over 700 KB)
- **First line:** `line 1: the quick brown fox jumps over the lazy dog`
- **Last line:** `line 30000: the quick brown fox jumps over the lazy dog`

Each line `n` (1-based) is exactly:

```
line <n>: the quick brown fox jumps over the lazy dog
```
