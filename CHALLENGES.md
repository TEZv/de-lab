# 📊 Data Engineering Lab — Challenges

> **Made in Ukraine** 🇺🇦 | Created by [TEZv](https://github.com/TEZv)

## 📖 The Quest

You've just been hired as the **first data hire** at **Pipeline Quest Inc.** — a product startup with one BigQuery project and a pile of CSVs in Google Drive. No dbt, no tests, no documentation. Just raw logs, duplicates, and the CEO asking: *"How much did we make yesterday?"*

Your mission: build a **reliable data pipeline** step by step — from SQL to dbt, from Python ETL to passing a technical interview.

Each challenge unlocks the next. Complete them all and you'll have a portfolio + skills for Junior/Middle Data Engineering roles.

> **How to use**: Run locally (DuckDB + Python) or in a Codespace. Start from Level 1. Time estimates are guides — what matters is **hands-on** work, not vibe-coding without understanding.

### Career levels (every challenge)

| Badge | Level |
|-------|--------|
| 🟦 | Intern / Trainee |
| 🟩 | Junior |
| 🟨 | Middle |
| 🟥 | Senior |

Full guide: **[CAREER-LEVELS.md](CAREER-LEVELS.md)** · Role track: **[interview-sprint/AE-vs-DE.md](interview-sprint/AE-vs-DE.md)**

**North star:** Data Engineering with **product analytics sense** — pipelines that serve real decisions, not checkbox SQL.

---

## 🟢 Level 1: SQL — "Clean Up the Chaos"

*The CEO says: "Just count revenue." You open the table — duplicates, NULLs, and three date formats.*

### Challenge 1.1 — First Query ⏱️ ~20 min · 🟦 Intern

**Quest**: Connect to the seed database and count unique users.

1. Install DuckDB: `pip install duckdb` (or use `python/requirements.txt`)
2. Run `sql/setup.sql` — creates `events` and `users`
3. Write a query: how many **unique** `user_id` values are in `events`?

<details>
<summary>🔧 Stuck? Click here for step-by-step instructions</summary>

```bash
cd sql
python -c "import duckdb; duckdb.sql(open('setup.sql').read())"
duckdb de_lab.duckdb -c "SELECT COUNT(DISTINCT user_id) FROM events;"
```

Or in Python:

```python
import duckdb
con = duckdb.connect("de_lab.duckdb")
con.execute(open("setup.sql").read())
print(con.execute("SELECT COUNT(DISTINCT user_id) FROM events").fetchone())
```

</details>

**Questions to think about**:
- How does `COUNT(*)` differ from `COUNT(DISTINCT user_id)`?
- What happens if `user_id` can be NULL?

---

### Challenge 1.2 — JOINs and Filters ⏱️ ~25 min · 🟩 Junior

**Quest**: Find the **top 5 countries** by total `revenue` in the last 30 days (`status = 'completed'` only).

1. JOIN `events` + `users` on `user_id`
2. Filter by date and status
3. `GROUP BY country`, `ORDER BY` sum DESC, `LIMIT 5`

**Questions to think about**: INNER vs LEFT JOIN — when do you lose users with no events?

---

### Challenge 1.3 — Window Functions ⏱️ ~35 min · 🟩 Junior

**Quest**: For each user, calculate **cumulative revenue** by day (running total).

Use: `SUM(revenue) OVER (PARTITION BY user_id ORDER BY event_date)`

Bonus: `ROW_NUMBER()` — first purchase date per user.

**Questions to think about**: How does `ROW_NUMBER()` differ from `RANK()` and `DENSE_RANK()`?

---

### Challenge 1.4 — CTEs and Dedupe ⏱️ ~30 min · 🟩 Junior

**Quest**: `events` has duplicates on `(user_id, event_date, product_id)`. Keep **one** row per combination (latest by `created_at`).

Hint: `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY created_at DESC) = 1`

**Questions to think about**: Why is dedupe better in SQL than eyeballing in Sheets?

---

## 🟡 Level 2: Python — "Automate the Extract"

*You can't pull CSVs from Drive by hand anymore. Time for a script.*

### Challenge 2.1 — Load and Validate ⏱️ ~30 min · 🟩 Junior

**Quest**: Implement `python/challenge_2_1_load.py`:
- read events (export from DuckDB or CSV)
- validate: `revenue >= 0`, `user_id` not null
- log how many rows were rejected

Run: `pytest python/tests/test_challenge_2_1.py -v`

---

### Challenge 2.2 — Transform (pandas) ⏱️ ~40 min · 🟩 Junior

**Quest**: Aggregate daily revenue by `country` → DataFrame → save to `python/output/daily_revenue.parquet`.

Requirements: type hints, function `aggregate_daily(df) -> pd.DataFrame`.

---

### Challenge 2.3 — Idempotent Load ⏱️ ~45 min · 🟨 Middle

**Quest**: Script that **overwrites** one date partition (`event_date=YYYY-MM-DD`) instead of duplicating the whole file on re-run.

**Questions to think about**: What is idempotency and why do DE interviews ask about it?

---

### Challenge 2.4 — pytest ⏱️ ~30 min · 🟩 Junior

**Quest**: Add 3 tests: empty input, negative revenue filtered, correct groupby sum.

Template in `python/tests/`.

---

## 🟠 Level 3: Data Modeling + dbt — "Build a Layer People Trust"

*Analysts ask the same questions from different tables. Time for a semantic layer.*

### Challenge 3.1 — Star Schema on Paper ⏱️ ~30 min · 🟨 Middle

> **📊 Product lens:** Before drawing tables, write: *Who uses this mart? What decision do they make?* Wrong grain = wrong product call.

**Quest**: Draw (or describe in `dbt/notes/star-schema.md`):
- `fct_orders` (facts)
- `dim_users`, `dim_products`, `dim_date`

State the grain of `fct_orders` and 3 business questions it answers.

---

### Challenge 3.2 — First dbt Models ⏱️ ~45 min · 🟨 Middle

**Quest**: Initialize dbt (duckdb or bigquery adapter):
- `stg_events` — staging, rename columns, cast types
- `fct_daily_revenue` — aggregate

`dbt run` + `dbt test` (not_null, unique on keys).

---

### Challenge 3.3 — SCD Type 2 (Concept) ⏱️ ~25 min · 🟨 Middle

**Quest**: A user changed `country`. Describe how to keep history in `dim_users` (`valid_from`, `valid_to`, `is_current`).

No code required — 10 lines + example of 2 versions of one user is enough.

---

### Challenge 3.4 — Data Quality Tests ⏱️ ~30 min · 🟨 Middle

**Quest**: Add in dbt:
- `relationships` (events.user_id → users.user_id)
- `accepted_values` on status
- custom test: revenue is not negative

---

## 🔴 Level 4: BigQuery + Orchestration — "Production Thinking"

*Traffic grew. You need partitions, cost control, and a DAG.*

### Challenge 4.1 — Cost Checklist ⏱️ ~20 min · 🟨 Middle

**Quest**: Read `bigquery/README.md` and for a sample query answer:
- how many bytes processed (dry run)?
- is there a `WHERE` on the partition column?
- do you need `SELECT *`?

---

### Challenge 4.2 — Partitioning Design ⏱️ ~30 min · 🟨 Middle

**Quest**: Design `fct_events` in BQ: partition by `event_date`, cluster by `user_id, country`.

Write DDL in `bigquery/ddl_fct_events.sql` (even without a BQ project — great interview practice).

---

### Challenge 4.3 — Airflow / Cron DAG (Concept) ⏱️ ~40 min · 🟨 Middle

**Quest**: Describe a DAG with 3 tasks:
1. extract CSV → GCS
2. load → BQ staging
3. dbt run

Include: retries, schedule, what to do on failure (alert, not silent fail).

File: `python/dag_sketch.md` or pseudocode in `python/dag_example.py`.

---

### Challenge 4.4 — Backfill Scenario ⏱️ ~25 min · 🟨 Middle

**Quest**: "Yesterday's pipeline failed." How do you safely re-run 3 days without duplicating data?

Answer in 5–7 sentences in a PR comment or `bigquery/backfill-runbook.md`.

---

## 🟣 Level 5: Interview Ready — "Pass the Interview"

*Pipeline Quest Inc. is growing. You're interviewing for Analytics Engineer at a product company.*

### Challenge 5.1 — SQL Live (45 min timer) ⏱️ · 🟨 Middle

**Quest**: HackerRank / DataLemur — **3 Medium SQL** problems without autocomplete. Log time and topics (windows, joins, subqueries).

Track: [`interview-sprint/01-SQL-Sprint-30.md`](interview-sprint/01-SQL-Sprint-30.md)

---

### Challenge 5.2 — Python Live ⏱️ ~45 min · 🟨 Middle

**Quest**: 2 problems: parse JSON logs → aggregate; or merge two sorted lists (no LLM).

Track: [`interview-sprint/02-Python-LiveCoding.md`](interview-sprint/02-Python-LiveCoding.md)

---

### Challenge 5.3 — Data Modeling Case ⏱️ ~60 min · 🟨 Middle

> **📊 Product lens:** Open with the business question, not the schema. Say who owns the metric definition (finance vs growth).

**Quest**: "We have app events + subscriptions. Build a model for MRR and churn."

Explain grain, facts, dims out loud. Template: [`interview-sprint/03-Data-Modeling-Case.md`](interview-sprint/03-Data-Modeling-Case.md)

---

### Challenge 5.4 — Explain Your Pipeline ⏱️ ~30 min · 🟨 Middle

**Quest**: 5-minute pitch (voice note or written):
- sources → staging → marts
- how you test data quality
- one trade-off (batch vs streaming, BQ cost)

---

## 🏆 Bonus: Portfolio Project

### Bonus 1 — End-to-End Pet Project ⏱️ ~8–12 hours · 🟨 Middle

**Quest**: Public GitHub repo (like this lab, but with **your** data):

1. Synthetic or open dataset (e.g. Olist, NYC taxi sample)
2. dbt models + tests
3. README with architecture diagram
4. CI: `dbt test` on push

Template: [`portfolio/README.md`](portfolio/README.md)

### Bonus 2 — Senior AE Vocabulary ⏱️ ~4 hours · 🟥 Senior

**Quest**: Work through [`interview-sprint/04-Senior-AE-Additions.md`](interview-sprint/04-Senior-AE-Additions.md) — for Analytics Engineer interviews (Genesis-style).

### Bonus 3 — Senior DE North Star ⏱️ ~4 hours · 🟥 Senior

**Quest**: Work through [`interview-sprint/05-Senior-DE-Additions.md`](interview-sprint/05-Senior-DE-Additions.md) — **primary track** if you're aiming for Data Engineer comp and ownership. Read [`AE-vs-DE.md`](interview-sprint/AE-vs-DE.md) first.

---

## 📋 Progress Tracker

| Challenge | Career | Time | Status |
|-----------|--------|------|--------|
| 1.1 First Query | 🟦 | ~20 min | ⬜ |
| 1.2 JOINs and Filters | 🟩 | ~25 min | ⬜ |
| 1.3 Window Functions | 🟩 | ~35 min | ⬜ |
| 1.4 CTEs and Dedupe | 🟩 | ~30 min | ⬜ |
| 2.1 Load + Validate | 🟩 | ~30 min | ⬜ |
| 2.2 pandas Aggregate | 🟩 | ~40 min | ⬜ |
| 2.3 Idempotent Load | 🟨 | ~45 min | ⬜ |
| 2.4 pytest | 🟩 | ~30 min | ⬜ |
| 3.1 Star Schema | 🟨 | ~30 min | ⬜ |
| 3.2 dbt Models | 🟨 | ~45 min | ⬜ |
| 3.3 SCD Type 2 | 🟨 | ~25 min | ⬜ |
| 3.4 dbt Tests | 🟨 | ~30 min | ⬜ |
| 4.1 Cost Checklist | 🟨 | ~20 min | ⬜ |
| 4.2 BQ Partitioning | 🟨 | ~30 min | ⬜ |
| 4.3 DAG Sketch | 🟨 | ~40 min | ⬜ |
| 4.4 Backfill Runbook | 🟨 | ~25 min | ⬜ |
| 5.1 SQL Live | 🟨 | ~45 min | ⬜ |
| 5.2 Python Live | 🟨 | ~45 min | ⬜ |
| 5.3 Modeling Case | 🟨 | ~60 min | ⬜ |
| 5.4 Pipeline Pitch | 🟨 | ~30 min | ⬜ |
| Bonus 1 Portfolio | 🟨 | ~8–12 hrs | ⬜ |
| Bonus 2 Senior AE | 🟥 | ~4 hrs | ⬜ |
| Bonus 3 Senior DE | 🟥 | ~4 hrs | ⬜ |

**Total estimated time: ~12–15 hours** (core quest) + bonus separately.

Mark completed challenges with ✅ in your fork.

---

## 🎯 The Big Picture

Complete all challenges and your quest evolves:

| Stage | Unlocked By |
|-------|-------------|
| 🧹 Clean SQL | 1.1–1.4 |
| 🐍 Scripted ETL | 2.1–2.4 |
| 📐 Trusted Models | 3.1–3.4 |
| ☁️ Production Mindset | 4.1–4.4 |
| 🎤 Interview Ready | 5.1–5.4 |
| 🏆 Portfolio DE | Bonus 1 |

**You started with CSVs and a CEO question. You ended with a pipeline, tests, and an interview.** 🎉

---

## Difficulty Map (quick reference)

| Level | Typical starting point | When to move on |
|-------|------------------------|-----------------|
| 🟢 L1 SQL | analytics background | start now |
| 🟡 L2 Python | basic Python | after 1.3 |
| 🟠 L3 dbt | heard of dbt | after 2.2 |
| 🔴 L4 BQ/Ops | some warehouse exposure | after 3.2 |
| 🟣 L5 Interview | before applying | when L1–L3 ≥ 70% |

**At 10–15 hrs/week:** ~6–8 weeks for the core quest + interview sprint in parallel.
