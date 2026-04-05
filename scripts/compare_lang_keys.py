# -*- coding: utf-8 -*-
"""Compare translation object keys across ar.js, en.js, fr.js."""
import re
from collections import Counter

KEY_LINE = re.compile(
    r'^(?:(?P<q>"(?:[^"\\]|\\.)*")|(?P<id>[a-zA-Z_$][a-zA-Z0-9_$]*))\s*:'
)


def strip_line_comment(line: str) -> str:
    in_s = False
    esc = False
    i = 0
    while i < len(line):
        c = line[i]
        if esc:
            esc = False
            i += 1
            continue
        if c == "\\" and in_s:
            esc = True
            i += 1
            continue
        if c == '"' and not in_s:
            in_s = True
            i += 1
            continue
        if c == '"' and in_s:
            in_s = False
            i += 1
            continue
        if not in_s and c == "/" and i + 1 < len(line) and line[i + 1] == "/":
            return line[:i].rstrip()
        i += 1
    return line


def extract_keys(path: str) -> list:
    with open(path, encoding="utf-8") as f:
        raw = f.read()
    raw = re.sub(r"/\*[\s\S]*?\*/", "", raw)
    keys_ordered = []
    for line in raw.splitlines():
        line = strip_line_comment(line)
        s = line.strip()
        if not s or s.startswith("//"):
            continue
        m = KEY_LINE.match(s)
        if m:
            if m.group("q"):
                k = m.group("q")[1:-1].replace('\\"', '"').replace("\\\\", "\\")
            else:
                k = m.group("id")
            keys_ordered.append(k)
    return keys_ordered


def analyze(path: str):
    keys = extract_keys(path)
    c = Counter(keys)
    unique = len(c)
    dup_keys = [(k, v) for k, v in c.items() if v > 1]
    dup_keys.sort(key=lambda x: (-x[1], x[0]))
    return unique, len(keys), c, dup_keys


def main():
    base = r"c:\xampp\htdocs\react1\src\language"
    files = {
        "ar": f"{base}\\ar.js",
        "en": f"{base}\\en.js",
        "fr": f"{base}\\fr.js",
    }
    results = {}
    for name, p in files.items():
        results[name] = analyze(p)

    ar_keys = set(results["ar"][2].keys())
    en_keys = set(results["en"][2].keys())
    fr_keys = set(results["fr"][2].keys())

    missing_en_vs_ar = sorted(ar_keys - en_keys)
    missing_fr_vs_ar = sorted(ar_keys - fr_keys)

    print("=== UNIQUE COUNTS (distinct keys per file) ===")
    for name in ["ar", "en", "fr"]:
        print(f"  {name}.js: {results[name][0]}")
    print()
    print("=== TOTAL KEY OCCURRENCES (incl. duplicate definitions) ===")
    for name in ["ar", "en", "fr"]:
        print(f"  {name}.js: {results[name][1]}")
    print()
    print(f"=== MISSING IN en vs ar (in ar, not in en): {len(missing_en_vs_ar)} ===")
    for k in missing_en_vs_ar:
        print(k)
    print()
    print(f"=== MISSING IN fr vs ar (in ar, not in fr): {len(missing_fr_vs_ar)} ===")
    for k in missing_fr_vs_ar:
        print(k)
    print()
    print("=== DUPLICATES PER FILE ===")
    for name in ["ar", "en", "fr"]:
        dup_keys = results[name][3]
        extra = sum(v - 1 for _, v in dup_keys)
        print(f"{name}.js: {len(dup_keys)} keys with duplicates, {extra} extra occurrences")
        print("  Top duplicate keys (by count):")
        for k, v in dup_keys[:30]:
            print(f"    {v}x  {repr(k)[:120]}")


if __name__ == "__main__":
    main()
