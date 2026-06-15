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
pip install duckdb
cd sql
python init_db.py
duckdb de_lab.duckdb -c "SELECT COUNT(DISTINCT user_id) FROM events;"
```

Or in Python:

```python
import duckdb
con = duckdb.connect("sql/de_lab.duckdb")
print(con.execute("SELECT COUNT(DISTINCT user_id) FROM events").fetchone())
```

**Troubleshooting:**

| Problem | Fix |
|---------|-----|
| `No such file: setup.sql` | Run commands from the `sql/` directory, or use `python sql/init_db.py` from repo root |
| `Catalog Error: Table events does not exist` | Run `python init_db.py` first |
| `duckdb: command not found` | Use the Python snippet above, or `pip install duckdb` |

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

<details>
<summary>🔧 Stuck? Click here for step-by-step instructions</summary>

```sql
SELECT
    u.country,
    SUM(e.revenue) AS total_revenue
FROM events e
INNER JOIN users u ON e.user_id = u.user_id
WHERE e.status = 'completed'
  AND e.event_date >= CURRENT_DATE - INTERVAL 30 DAY
GROUP BY u.country
ORDER BY total_revenue DESC
LIMIT 5;
```

Run from `sql/`:

```bash
duckdb de_lab.duckdb -c "SELECT u.country, SUM(e.revenue) ..."
```

**Check your logic:**
- Are refunded rows excluded? (`status = 'completed'`)
- Did INNER JOIN drop users with no events? (that's OK for this question)

</details>

**Questions to think about**: INNER vs LEFT JOIN — when do you lose users with no events?

---

### Challenge 1.3 — Window Functions ⏱️ ~35 min · 🟩 Junior

**Quest**: For each user, calculate **cumulative revenue** by day (running total).

Use: `SUM(revenue) OVER (PARTITION BY user_id ORDER BY event_date)`

Bonus: `ROW_NUMBER()` — first purchase date per user.

<details>
<summary>🔧 Stuck? Click here for step-by-step instructions</summary>

**Running total:**

```sql
SELECT
    user_id,
    event_date,
    revenue,
    SUM(revenue) OVER (
        PARTITION BY user_id
        ORDER BY event_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_revenue
FROM events
WHERE status = 'completed'
ORDER BY user_id, event_date;
```

**First purchase per user (bonus):**

```sql
SELECT user_id, event_date AS first_purchase_date
FROM (
    SELECT
        user_id,
        event_date,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_date) AS rn
    FROM events
    WHERE status = 'completed'
) t
WHERE rn = 1;
```

</details>

**Questions to think about**: How does `ROW_NUMBER()` differ from `RANK()` and `DENSE_RANK()`?

---

### Challenge 1.4 — CTEs and Dedupe ⏱️ ~30 min · 🟩 Junior

**Quest**: `events` has duplicates on `(user_id, event_date, product_id)`. Keep **one** row per combination (latest by `created_at`).

Hint: `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY created_at DESC) = 1`

<details>
<summary>🔧 Stuck? Click here for step-by-step instructions</summary>

```sql
WITH ranked AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY user_id, event_date, product_id
            ORDER BY created_at DESC
        ) AS rn
    FROM events
)
SELECT * EXCLUDE (rn)
FROM ranked
WHERE rn = 1;
```

Verify dedupe worked:

```sql
-- Should return 0 rows if no duplicates remain on the key
SELECT user_id, event_date, product_id, COUNT(*) AS cnt
FROM ( /* your deduped query */ ) d
GROUP BY 1, 2, 3
HAVING COUNT(*) > 1;
```

</details>

**Questions to think about**: Why is dedupe better in SQL than eyeballing in Sheets?

---

## 🟡 Level 2: Python — "Automate the Extract"

*You can't pull CSVs from Drive by hand anymore. Time for a script.*

### Challenge 2.1 — Load and Validate ⏱️ ~30 min · 🟩 Junior

**Quest**: Implement `python/challenge_2_1_load.py`:
- read events from DuckDB (or export to DataFrame)
- validate: `revenue >= 0`, `user_id` not null
- log how many rows were rejected

Run: `pytest python/tests/test_challenge_2_1.py -v`

<details>
<summary>🔧 Stuck? Click here for step-by-step instructions</summary>

```bash
pip install -r python/requirements.txt
cd sql && python init_db.py && cd ..
```

Skeleton for `validate_events`:

```python
def validate_events(df: pd.DataFrame) -> tuple[pd.DataFrame, int]:
    valid_mask = df["user_id"].notna() & (df["revenue"] >= 0)
    rejected = int((~valid_mask).sum())
    return df.loc[valid_mask].copy(), rejected
```

Load from DuckDB:

```python
import duckdb
df = duckdb.connect("sql/de_lab.duckdb").execute("SELECT * FROM events").df()
```

Run tests:

```bash
cd python
pytest tests/test_challenge_2_1.py -v
```

</details>

---

### Challenge 2.2 — Transform (pandas) ⏱️ ~40 min · 🟩 Junior

**Quest**: Aggregate daily revenue by `country` → DataFrame → save to `python/output/daily_revenue.parquet`.

Requirements: type hints, function `aggregate_daily(df) -> pd.DataFrame`.

<details>
<summary>🔧 Stuck? Click here for step-by-step instructions</summary>

```python
import pandas as pd

def aggregate_daily(df: pd.DataFrame) -> pd.DataFrame:
    out = (
        df[df["status"] == "completed"]
        .groupby(["event_date", "country"], as_index=False)["revenue"]
        .sum()
    )
    return out.rename(columns={"revenue": "daily_revenue"})
```

Save:

```python
from pathlib import Path
out = aggregate_daily(df)
Path("python/output").mkdir(parents=True, exist_ok=True)
out.to_parquet("python/output/daily_revenue.parquet", index=False)
```

</details>

---

### Challenge 2.3 — Idempotent Load ⏱️ ~45 min · 🟨 Middle

**Quest**: Script that **overwrites** one date partition (`event_date=YYYY-MM-DD`) instead of duplicating the whole file on re-run.

<details>
<summary>🔧 Stuck? Click here for step-by-step instructions</summary>

Pattern with parquet partitions:

```python
def write_partition(df: pd.DataFrame, target_date: str, base_dir: str = "python/output/partitions") -> None:
    path = Path(base_dir) / f"event_date={target_date}"
    # remove old partition if exists (idempotent)
    if path.exists():
        for f in path.glob("*.parquet"):
            f.unlink()
    path.mkdir(parents=True, exist_ok=True)
    day_df = df[df["event_date"].astype(str) == target_date]
    day_df.to_parquet(path / "data.parquet", index=False)
```

Run twice for the same date — row count should stay the same, not double.

</details>

**Questions to think about**: What is idempotency and why do DE interviews ask about it?

---

### Challenge 2.4 — pytest ⏱️ ~30 min · 🟩 Junior

**Quest**: Ensure all tests in `python/tests/test_challenge_2_1.py` pass; add one more test for `aggregate_daily` if you completed 2.2.

<details>
<summary>🔧 Stuck? Click here for step-by-step instructions</summary>

```bash
cd python
pytest tests/ -v
```

Example extra test:

```python
def test_aggregate_daily_sums():
    df = pd.DataFrame({
        "event_date": ["2024-01-01", "2024-01-01"],
        "country": ["UA", "UA"],
        "status": ["completed", "completed"],
        "revenue": [10.0, 5.0],
    })
    result = aggregate_daily(df)
    assert result.loc[0, "daily_revenue"] == 15.0
```

</details>

---

## 🟠 Level 3: Data Modeling + dbt — "Build a Layer People Trust"

*Analysts ask the same questions from different tables. Time for a semantic layer.*

### Challenge 3.1 — Star Schema on Paper ⏱️ ~30 min · 🟨 Middle

> **📊 Product lens:** Before drawing tables, write: *Who uses this mart? What decision do they make?* Wrong grain = wrong product call.

**Quest**: Draw (or describe in `dbt/notes/star-schema.md`):
- `fct_orders` (facts)
- `dim_users`, `dim_products`, `dim_date`

State the grain of `fct_orders` and 3 business questions it answers.

<details>
<summary>🔧 Stuck? Click here for step-by-step instructions</summary>

Create `dbt/notes/star-schema.md` with:

```markdown
## Grain
fct_order_items: one row = one line item in an order

## Facts
- fct_order_items (order_item_id, user_id, product_id, order_date_key, quantity, revenue)

## Dimensions
- dim_users (user_id, country, signup_date, ...)
- dim_products (product_id, name, category, ...)
- dim_date (date_key, date, week, month, ...)

## Business questions
1. Daily revenue by country
2. AOV by product category
3. New vs returning customers (join dim_users + order history)
```

</details>

---

### Challenge 3.2 — First dbt Models ⏱️ ~45 min · 🟨 Middle

**Quest**: Initialize dbt (duckdb adapter):
- `stg_events` — staging, rename columns, cast types
- `fct_daily_revenue` — aggregate

`dbt run` + `dbt test` (not_null, unique on keys).

<details>
<summary>🔧 Stuck? Click here for step-by-step instructions</summary>

```bash
pip install dbt-duckdb
cd dbt
dbt init pipeline_quest   # pick duckdb
```

In `~/.dbt/profiles.yml` (or project `profiles.yml`):

```yaml
pipeline_quest:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: ../sql/de_lab.duckdb
      threads: 4
```

`models/staging/stg_events.sql`:

```sql
select
    cast(event_id as integer) as event_id,
    cast(user_id as integer) as user_id,
    cast(event_date as date) as event_date,
    cast(revenue as decimal(10, 2)) as revenue,
    lower(status) as status
from {{ source('raw', 'events') }}
```

Add `models/sources.yml` pointing at `events` / `users`, then:

```bash
dbt run
dbt test
```

</details>

---

### Challenge 3.3 — SCD Type 2 (Concept) ⏱️ ~25 min · 🟨 Middle

**Quest**: A user changed `country`. Describe how to keep history in `dim_users` (`valid_from`, `valid_to`, `is_current`).

No code required — 10 lines + example of 2 versions of one user is enough.

<details>
<summary>🔧 Stuck? Click here for a hint</summary>

Example rows for `user_id = 42`:

| user_id | country | valid_from | valid_to | is_current |
|---------|---------|------------|----------|------------|
| 42 | UA | 2024-01-01 | 2024-06-30 | false |
| 42 | PL | 2024-07-01 | 9999-12-31 | true |

When country changes: close old row (`valid_to = yesterday`, `is_current = false`), insert new row.

In dbt: **snapshots** or custom incremental model — revisit in `05-Senior-DE-Additions.md`.

</details>

---

### Challenge 3.4 — Data Quality Tests ⏱️ ~30 min · 🟨 Middle

**Quest**: Add in dbt:
- `relationships` (events.user_id → users.user_id)
- `accepted_values` on status
- custom test: revenue is not negative

<details>
<summary>🔧 Stuck? Click here for step-by-step instructions</summary>

`models/schema.yml`:

```yaml
models:
  - name: stg_events
    columns:
      - name: user_id
        tests:
          - not_null
          - relationships:
              to: ref('stg_users')
              field: user_id
      - name: status
        tests:
          - accepted_values:
              values: ['completed', 'refunded', 'pending']
      - name: revenue
        tests:
          - dbt_utils.expression_is_true:
              expression: ">= 0"
```

Install `dbt-utils` if needed: `packages.yml` → `dbt deps` → `dbt test`.

</details>

---

## 🔴 Level 4: BigQuery + Orchestration — "Production Thinking"

*Traffic grew. You need partitions, cost control, and a DAG.*

### Challenge 4.1 — Cost Checklist ⏱️ ~20 min · 🟨 Middle

**Quest**: Read `bigquery/README.md` and for a sample query answer:
- how many bytes processed (dry run)?
- is there a `WHERE` on the partition column?
- do you need `SELECT *`?

<details>
<summary>🔧 Stuck? Click here for step-by-step instructions</summary>

With `bq` CLI (if configured):

```bash
bq query --use_legacy_sql=false --dry_run '
SELECT user_id, revenue
FROM `project.dataset.fct_events`
WHERE event_date = "2024-01-15"
'
```

In Console: open query editor → **Validator** shows bytes processed.

Checklist: partition filter present? Only columns you need? Avoid `SELECT *` on wide tables.

</details>

---

### Challenge 4.2 — Partitioning Design ⏱️ ~30 min · 🟨 Middle

**Quest**: Design `fct_events` in BQ: partition by `event_date`, cluster by `user_id, country`.

Write DDL in `bigquery/ddl_fct_events.sql` (even without a BQ project — great interview practice).

<details>
<summary>🔧 Stuck? Click here for step-by-step instructions</summary>

See [`bigquery/ddl_fct_events.sql`](bigquery/ddl_fct_events.sql) — customize `project.dataset`.

Explain in a comment:
- why partition by `event_date` (query pruning)
- why cluster by `user_id, country` (common filters)
- why `require_partition_filter = true` (cost guardrail)

</details>

---

### Challenge 4.3 — Airflow / Cron DAG (Concept) ⏱️ ~40 min · 🟨 Middle

**Quest**: Describe a DAG with 3 tasks:
1. extract CSV → GCS
2. load → BQ staging
3. dbt run

Include: retries, schedule, what to do on failure (alert, not silent fail).

File: `python/dag_sketch.md` or pseudocode in `python/dag_example.py`.

<details>
<summary>🔧 Stuck? Click here for step-by-step instructions</summary>

`python/dag_sketch.md` outline:

```markdown
## Schedule
Daily 02:00 UTC (after source export completes)

## Tasks
1. extract_to_gcs — PythonOperator, retries=3, retry_delay=5min
2. load_bq_staging — GCSToBigQueryOperator, depends on (1)
3. dbt_run — BashOperator `dbt run && dbt test`, depends on (2)

## On failure
- Slack/PagerDuty alert with task id + log link
- Do NOT silently skip downstream
- Leave bad partition quarantined; document in runbook
```

</details>

---

### Challenge 4.4 — Backfill Scenario ⏱️ ~25 min · 🟨 Middle

**Quest**: "Yesterday's pipeline failed." How do you safely re-run 3 days without duplicating data?

Answer in 5–7 sentences in a PR comment or `bigquery/backfill-runbook.md`.

<details>
<summary>🔧 Stuck? Click here for a hint</summary>

Use [`bigquery/backfill-runbook.md`](bigquery/backfill-runbook.md) as template:

1. Identify missing dates
2. Re-run extract/load **only** for those dates (idempotent merge or delete+insert)
3. `dbt run` on affected models
4. `dbt test` before announcing "fixed"
5. Document incident

</details>

---

## 🟣 Level 5: Interview Ready — "Pass the Interview"

*Pipeline Quest Inc. is growing. You're interviewing for **Data Engineer** (primary) and Analytics Engineer (secondary) roles.*

### Challenge 5.1 — SQL Live (45 min timer) ⏱️ · 🟨 Middle

**Quest**: HackerRank / DataLemur — **3 Medium SQL** problems without autocomplete. Log time and topics (windows, joins, subqueries).

Track: [`interview-sprint/01-SQL-Sprint-30.md`](interview-sprint/01-SQL-Sprint-30.md)

<details>
<summary>🔧 Stuck? Click here for a hint</summary>

Use **Day 14** or **Day 21** mock from the sprint. Set a real timer. After each problem, write:
- topic (window / join / subquery)
- time spent
- one mistake to avoid next time

No LLM during the block.

</details>

---

### Challenge 5.2 — Python Live ⏱️ ~45 min · 🟨 Middle

**Quest**: 2 problems: parse JSON logs → aggregate; or merge two sorted lists (no LLM).

Track: [`interview-sprint/02-Python-LiveCoding.md`](interview-sprint/02-Python-LiveCoding.md)

<details>
<summary>🔧 Stuck? Click here for a hint</summary>

Do **B1 + B2** or **C5 mock** from the sprint file. Say edge cases out loud before coding.

</details>

---

### Challenge 5.3 — Data Modeling Case ⏱️ ~60 min · 🟨 Middle

> **📊 Product lens:** Open with the business question, not the schema. Say who owns the metric definition (finance vs growth).

**Quest**: "We have app events + subscriptions. Build a model for MRR and churn."

Explain grain, facts, dims out loud. Template: [`interview-sprint/03-Data-Modeling-Case.md`](interview-sprint/03-Data-Modeling-Case.md)

<details>
<summary>🔧 Stuck? Click here for a hint</summary>

Start with **Case 2** (Subscriptions / MRR). Answer in order:
1. Business question
2. Grain of subscription fact
3. dims needed
4. MRR + churn formulas in plain language
5. One dbt test you'd add

Record a 3-minute voice explanation.

</details>

---

### Challenge 5.4 — Explain Your Pipeline ⏱️ ~30 min · 🟨 Middle

**Quest**: 5-minute pitch (voice note or written):
- sources → staging → marts
- how you test data quality
- one trade-off (batch vs streaming, BQ cost)

<details>
<summary>🔧 Stuck? Click here for a hint</summary>

Structure:

1. **Problem** (CEO / analyst pain)
2. **Architecture** (bronze → silver → gold or staging → marts)
3. **Quality** (dbt tests, idempotent loads)
4. **Trade-off** (e.g. daily batch vs hourly cost)
5. **What you'd do next** at Pipeline Quest Inc.

</details>

---

## 🔍 Spot Check — "Something's Off"

> **Different muscle.** These don't ask you to *build* — they ask you to spot what **doesn't pass a correctness check**: wrong counts, silent data loss, tutorial typos, precedence traps. Try **before** opening answers.
>
> **Quote traps** (`'` vs `"`): optional cheat sheet at the top of [SPOT-CHECK.md](SPOT-CHECK.md) — plus 30-sec extras in **#9** (SQL) and **#10** (case + accents `A`/`Á`). No new challenge count.

Full set (11 exercises, ~5–10 min each): **[SPOT-CHECK.md](SPOT-CHECK.md)**

| # | Trap | Level | Ties to |
|---|------|-------|---------|
| 1 | `LIKE 'Adel%'` — does **Aden** match? | 🟩 | Text filters |
| 2 | `AND` / `OR` without parentheses | 🟩 | Challenge 1.2 |
| 3 | `COUNT(user_id)` vs NULLs | 🟩 | Challenge 1.1 |
| 4 | `INNER JOIN` when you need all users | 🟩 | Challenge 1.2 |
| 5 | `DISTINCT` as JOIN band-aid | 🟨 | Challenge 1.4 |
| 6 | `status` in `HAVING` not `WHERE` | 🟨 | Aggregations |
| 7 | Window sum at wrong grain | 🟨 | Challenge 1.3 |
| 8 | String dates vs partition pruning | 🟨 | Challenges 4.1–4.2 |
| 9 | `IN` — parens, `'...'` not `"..."` | 🟩 | DataCamp text filters |
| 10 | `NOT LIKE` — case + accents (`A` ≠ `Á`) | 🟩 | DataCamp LIKE |
| 11 | `NOT IN` + NULL subquery | 🟨 | Interview classic |

**When to use**: after Level 1, or spread one per day during the interview sprint. Passing = you can explain the bug **without** peeking.

<details>
<summary>🔧 Example — Spot Check 2 (peek only after you try)</summary>

```sql
WHERE release_year BETWEEN 1990 AND 2000
  AND budget > 100000000
  AND language = 'Spanish'
  OR language = 'French';
```

Parsed as: `(year AND budget AND Spanish) OR French` → **all French films** pass, even outside 1990–2000.

Fix: `AND (language = 'Spanish' OR language = 'French')`.

</details>

---

## 🏆 Bonus: Portfolio Project

### Bonus 1 — End-to-End Pet Project ⏱️ ~8–12 hours · 🟨 Middle

**Quest**: Public GitHub repo (like this lab, but with **your** data):

1. Synthetic or open dataset (e.g. Olist, NYC taxi sample)
2. dbt models + tests
3. README with architecture diagram
4. CI: `dbt test` on push

Template: [`portfolio/README.md`](portfolio/README.md)

<details>
<summary>🔧 Stuck? Click here for a hint</summary>

Follow the README skeleton in `portfolio/`. Minimum viable: 3 staging models + 2 marts + 5 tests + mermaid diagram in README.

</details>

### Bonus 2 — Senior AE Vocabulary ⏱️ ~4 hours · 🟥 Senior

**Quest**: Work through [`interview-sprint/04-Senior-AE-Additions.md`](interview-sprint/04-Senior-AE-Additions.md) — for Analytics Engineer interviews (Genesis-style).

<details>
<summary>🔧 Stuck? Click here for a hint</summary>

Read [`AE-vs-DE.md`](interview-sprint/AE-vs-DE.md) first. Mark each term you can explain without notes.

</details>

### Bonus 3 — Senior DE North Star ⏱️ ~4 hours · 🟥 Senior

**Quest**: Work through [`interview-sprint/05-Senior-DE-Additions.md`](interview-sprint/05-Senior-DE-Additions.md) — **primary track** for DE comp and ownership.

<details>
<summary>🔧 Stuck? Click here for a hint</summary>

Prioritize **product-aware DE** mini cases in that file. Pair with Bonus 1 portfolio.

</details>

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
| 🔍 Spot Check (11) | 🟩–🟨 | ~1.5 hr total | ⬜ |
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
| 🔍 Sharp Eyes | Spot Check ≥ 8/11 without peeking |
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
