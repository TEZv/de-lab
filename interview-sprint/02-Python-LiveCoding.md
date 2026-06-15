# Python Live Coding Sprint

Levels: 🟢 basics → 🟡 data → 🔴 interview

**Rule:** 45 min blocks, no Copilot/ChatGPT. stdlib + pandas allowed.

## 🟢 Level A — Warm-up (week 1)

| # | Task | What they test |
|---|------|----------------|
| A1 | FizzBuzz + type hints | basic syntax |
| A2 | Parse `key=value` string into dict | strings |
| A3 | Merge two sorted lists | two pointers |
| A4 | Count word frequency in text | dict |
| A5 | Read CSV, print top-5 by column | pandas intro |

## 🟡 Level B — Data (week 2)

| # | Task | What they test |
|---|------|----------------|
| B1 | JSON logs → count errors per hour | datetime, json |
| B2 | Dedupe DataFrame by id, keep latest | pandas |
| B3 | Fill missing dates in time series (reindex) | pandas |
| B4 | Validate schema: required columns, dtypes | defensive code |
| B5 | Write pytest for B2 | testing |

## 🔴 Level C — Interview (weeks 3–4)

| # | Task | What they test |
|---|------|----------------|
| C1 | ETL: 2 CSV → join → aggregate → parquet | pipeline thinking |
| C2 | Rate limiter: max N calls per minute | class design |
| C3 | Retry decorator with exponential backoff | patterns |
| C4 | Parse nested JSON API response → flat table | real-world |
| C5 | **45 min mock**: B1 + B2 together | timing |

## Daily Format (5 days/week)

```
1. 10 min — redo yesterday's problem from scratch
2. 35 min — new problem (level B or C)
3. 10 min — say out loud: time complexity O(?), edge cases
```

## Common Interview Questions (answer without code first)

1. Difference between list, tuple, and set?
2. What is a generator and when does it save memory?
3. How would you process a 10 GB file on a laptop?
4. `*args` / `**kwargs` — example in an ETL function
5. How do you test a pipeline that writes to BigQuery?

## Resources

- [LeetCode Python Easy](https://leetcode.com/problemset/)
- HackerRank Python
- DataCamp "Introduction to Python" + "Writing Functions"
- Tests in `de-lab/python/tests/`

## Progress

| ID | Done | Time | No hints? |
|----|------|------|-----------|
| A1–A5 | ⬜ | | |
| B1–B5 | ⬜ | | |
| C1–C5 | ⬜ | | |
