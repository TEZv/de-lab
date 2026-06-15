# 🔍 Spot Check — "Something's Off"

> **Made in Ukraine** 🇺🇦 | Companion to [CHALLENGES.md](CHALLENGES.md)

These are **not** build exercises. A tutorial, a colleague, or a dashboard *looks* correct — but fails a correctness check.

**How to play**

1. Read the snippet. **Do not** open the answer yet.
2. Write (or say out loud): what's wrong, who gets hurt (wrong counts? missing rows?), and the fix.
3. Open **Check your answer** only after you've committed to an answer.
4. Optional: run the query in DuckDB if you want proof (`python sql/init_db.py` first).

**Career levels** match [CAREER-LEVELS.md](CAREER-LEVELS.md). Time = thinking time, not typing.

<details>
<summary>📎 Syntax &amp; text traps — quotes, case, accents (cheat sheet, not a separate challenge)</summary>

### Quotes: `'` vs `"`

| You write | Engine reads it as |
|-----------|-------------------|
| `'France'` | **string** (text value) ✅ |
| `"France"` | **identifier** (column/table name called `France`) ❌ for filters |
| `Germany` (no quotes) | column name — not the word Germany |
| `'O''Reilly'` | one string: `O'Reilly` (double `''` = escaped quote) |
| `''` | empty string (zero characters) |

**Rule:** filter values → **single quotes** `'...'`. Woven into **Spot Check 9**.

### Letters & languages: `A` ≠ `Á`

Same letter to a human, **different character** to the database (unless collation says otherwise).

| You filter | In the data | Match? (typical default) |
|------------|-------------|--------------------------|
| `country = 'Mexico'` | `México` | ❌ often no |
| `name LIKE 'A%'` | `Álvaro` | ❌ often no |
| `NOT LIKE '%A.%'` | `A.J.` | excluded ✅ |
| `NOT LIKE '%A.%'` | `Á.J.` (A + acute) | **kept** — pattern is ASCII `A`, not `Á` |
| `NOT ILIKE '%a.%'` | `Á.J.` | **still kept** — `ILIKE` fixes **case**, not **accents** |

**DE angle:** CSVs from EU/LATAM, user names, city names — clean **once in staging** (normalize Unicode, fold accents if product agrees), don't assume `=` catches "the same word."

**Fixes (production):**

- ETL: `normalize()` to NFC; optional `unaccent()` / accent-stripping with documented rules
- Explicit lookup table (`México` → `Mexico`) when business needs one canonical label
- `COLLATE` / locale-aware comparison — only when you know your warehouse defaults

**Unicode gotcha:** `é` can be **one codepoint** (`U+00E9`) or **`e` + combining accent** (`U+0065 U+0301`) — strings look identical on screen, `=` may still fail. Normalize before load.

Woven into **Spot Check 10** (optional extra question).

</details>

---

## Spot Check 1 — Wildcard Trap ⏱️ ~5 min · 🟩 Junior

**Source**: A SQL course slide says `LIKE 'Adel%'` matches **Adel**, **Adelaide**, and **Aden**.

```sql
SELECT name
FROM people
WHERE name LIKE 'Adel%';
```

**Your task**

1. Which name in that list should **not** match? Why?
2. Write a `LIKE` pattern for: *exactly three characters, starting with `E`* (e.g. Eve, Eva — not `Eva Mendes`).

<details>
<summary>✅ Check your answer</summary>

1. **Aden** must not match. `%` means "zero or more characters **after** the prefix `Adel`". `Aden` is `Ade` + `n`, not `Adel` + anything.
2. `WHERE name LIKE 'E__'` — each `_` is exactly one character; three positions total.

**Bonus trap**: `'Eve'` without `LIKE` is a literal string, not a pattern. Wildcards only work with `LIKE` / `NOT LIKE`.

</details>

---

## Spot Check 2 — AND Eats OR ⏱️ ~5 min · 🟩 Junior

**Source**: Analyst wants big-budget Spanish **or** French films from 1990–2000.

```sql
SELECT title, release_year
FROM films
WHERE release_year BETWEEN 1990 AND 2000
  AND budget > 100000000
  AND language = 'Spanish'
  OR language = 'French';
```

**Your task**

1. Without adding parentheses, how does SQL **actually** group this? (`AND` vs `OR` precedence.)
2. Which films incorrectly slip through?
3. Write the corrected `WHERE` clause.

<details>
<summary>✅ Check your answer</summary>

SQL parses as:

```text
(year AND budget AND Spanish) OR (French)
```

So **every French film** passes — even if year is 1985 or budget is tiny.

Fix:

```sql
WHERE release_year BETWEEN 1990 AND 2000
  AND budget > 100000000
  AND (language = 'Spanish' OR language = 'French');
```

**Rule**: `AND` binds tighter than `OR`. When you mean "all of these AND (one of these)", use parentheses.

</details>

---

## Spot Check 3 — COUNT the NULLs ⏱️ ~5 min · 🟩 Junior

**Source**: PM asks: "How many users had at least one event?"

```sql
SELECT COUNT(user_id) AS users_with_events
FROM events;
```

Table `events` has 10,000 rows; 200 rows have `user_id IS NULL` (broken tracking).

**Your task**

1. Does this query answer the PM's question?
2. What number do you get vs what you should report?
3. Write a better query.

<details>
<summary>✅ Check your answer</summary>

`COUNT(user_id)` **ignores NULLs** — you get 9,800, not "users" but "non-null user_id values".

For **distinct users** who had events:

```sql
SELECT COUNT(DISTINCT user_id) AS users_with_events
FROM events
WHERE user_id IS NOT NULL;
```

`COUNT(*)` counts rows; `COUNT(column)` counts non-null values in that column. Different questions.

</details>

---

## Spot Check 4 — JOIN Then Lose ⏱️ ~7 min · 🟩 Junior

**Source**: "List **all** users and their total revenue (0 if none)."

```sql
SELECT u.user_id, u.country, SUM(e.revenue) AS total_revenue
FROM users u
INNER JOIN events e ON u.user_id = e.user_id
GROUP BY u.user_id, u.country;
```

**Your task**

1. Who is missing from the result?
2. Which join type fixes it?
3. What happens to `SUM(e.revenue)` for users with no events?

<details>
<summary>✅ Check your answer</summary>

**INNER JOIN** drops users with zero events — they never appear.

Fix:

```sql
SELECT u.user_id, u.country, COALESCE(SUM(e.revenue), 0) AS total_revenue
FROM users u
LEFT JOIN events e ON u.user_id = e.user_id
GROUP BY u.user_id, u.country;
```

Users with no events: one row, `SUM` is NULL → `COALESCE` → 0.

</details>

---

## Spot Check 5 — DISTINCT Band-Aid ⏱️ ~7 min · 🟨 Middle

**Source**: Revenue per country looks **2× too high**. Teammate's fix:

```sql
SELECT DISTINCT u.country, e.revenue
FROM events e
INNER JOIN users u ON e.user_id = u.user_id;
```

**Your task**

1. Why is revenue doubled upstream? (Think: grain of `events`.)
2. Why doesn't `SELECT DISTINCT` on `(country, revenue)` fix **total revenue by country**?
3. What's the right aggregation pattern?

<details>
<summary>✅ Check your answer</summary>

If `events` has multiple rows per purchase (duplicates, partial refunds, retries), joining without deduping **multiplies** amounts.

`DISTINCT country, revenue` only removes identical *(country, revenue)* pairs — not duplicate event rows with the same revenue value.

Right approach: fix grain first (CTE dedupe on `event_id`), **then**:

```sql
SELECT u.country, SUM(e.revenue) AS total_revenue
FROM deduped_events e
JOIN users u ON e.user_id = u.user_id
GROUP BY u.country;
```

See Challenge 1.4 — dedupe before aggregate.

</details>

---

## Spot Check 6 — HAVING Too Early ⏱️ ~7 min · 🟨 Middle

**Source**: "Countries with more than $1M completed revenue."

```sql
SELECT u.country, SUM(e.revenue) AS total
FROM events e
JOIN users u ON e.user_id = u.user_id
HAVING SUM(e.revenue) > 1000000
  AND e.status = 'completed';
```

**Your task**

1. What's wrong with filtering `status` in `HAVING`?
2. Rewrite with `WHERE` and `HAVING` in the right places.

<details>
<summary>✅ Check your answer</summary>

`HAVING` filters **after** aggregation. Putting `e.status = 'completed'` in `HAVING` still aggregates **refunded / pending** rows into the sum first (unless you also filter in `WHERE`).

Correct:

```sql
SELECT u.country, SUM(e.revenue) AS total
FROM events e
JOIN users u ON e.user_id = u.user_id
WHERE e.status = 'completed'
GROUP BY u.country
HAVING SUM(e.revenue) > 1000000;
```

**Order**: `WHERE` row filter → `GROUP BY` → `HAVING` group filter.

</details>

---

## Spot Check 7 — Window Without Frame ⏱️ ~10 min · 🟨 Middle

**Source**: "Running total revenue per user by day."

```sql
SELECT
  user_id,
  event_date,
  SUM(revenue) OVER (PARTITION BY user_id ORDER BY event_date) AS running_total
FROM events;
```

Same user, same day, three events. The running total **jumps three times** on that day instead of once.

**Your task**

1. Why does the window sum behave oddly within a single day?
2. Name the window frame clause that sums **per day first**, then running across days. (Conceptual answer OK.)

<details>
<summary>✅ Check your answer</summary>

Default window frame with `ORDER BY` is often `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` — multiple rows **on the same** `event_date` each add separately.

Fix paths:

- Aggregate to daily grain first (CTE: `GROUP BY user_id, event_date`), then window over days.
- Or use an explicit frame / `ROWS` semantics after you understand tie-breaking.

**Lesson**: window functions see **row grain** unless you change grain first. Challenge 1.3 territory.

</details>

---

## Spot Check 8 — "Free" Full Table Scan ⏱️ ~10 min · 🟨 Middle

**Source**: Dashboard query on a partitioned `events` table (millions of rows):

```sql
SELECT DATE_TRUNC('month', event_date) AS month, SUM(revenue)
FROM events
WHERE event_date >= '2024-01-01'
GROUP BY 1;
```

Column `event_date` is `VARCHAR` in staging (Challenge 2.x vibes). Analyst says: "We filter by date, so BigQuery only scans January onward."

**Your task**

1. What breaks if `event_date` is a string like `'01/15/2024'` mixed with `'2024-01-15'`?
2. Why might the warehouse still scan more data than expected even with a `WHERE`?
3. One-line principle for production date filters.

<details>
<summary>✅ Check your answer</summary>

1. String comparison ≠ chronological order unless format is ISO and consistent. `'9/1/2024'` vs `'2024-01-15'` — lexicographic surprises.
2. Casting in `WHERE` (`CAST(event_date AS DATE)`) can **disable** partition pruning. Dirty types → full scans + wrong buckets.
3. **Cast once in staging**, filter on native `DATE`/`TIMESTAMP`, align filter literals with partition key.

Links: Challenges 4.1–4.2 (cost + partitioning).

</details>

---

## Spot Check 9 — IN or Nothing ⏱️ ~5 min · 🟩 Junior

**Source**: DataCamp-style filter — films from Germany or France (1920, 1930, or 1940).

```sql
-- Version A: years
WHERE release_year IN 1920, 1930, 1940

-- Version B: countries
WHERE country IN Germany, France

-- Version C: "fixed" with double quotes (still wrong in SQL)
WHERE country IN ("Germany", "France")
```

**Your task**

1. What's syntactically wrong with Version A and B?
2. Rewrite Version B correctly.
3. When is `IN (...)` better than chaining `OR`?
4. **Syntax check (30 sec):** Why is Version C still wrong even though it has `"quotes"`?

<details>
<summary>✅ Check your answer</summary>

`IN` requires **parentheses** around the value list:

```sql
WHERE release_year IN (1920, 1930, 1940)
WHERE country IN ('Germany', 'France')
```

Text values need **single quotes** — `Germany` without quotes is a column name, not a string.

**Version C:** double quotes `"Germany"` are **identifiers** (like a column alias), not string literals. Engine looks for a column named `Germany` → error or wrong plan. DataCamp / standard SQL text = `'...'`.

`IN` shines when the list is long (5+ values) or you generate values from a subquery. For two options, `OR` is fine — but `IN` is clearer to read.

</details>

---

## Spot Check 10 — NOT LIKE: Case & Accent Trap ⏱️ ~5 min · 🟩 Junior

**Source**: "Exclude names with an **A-dot** initial pattern" (DataCamp-style).

```sql
SELECT first_name
FROM people
WHERE first_name NOT LIKE '%A.%';
```

Dataset: `A.J.`, `aj.`, `Á.J.`, `Maria`.

- Analyst expects only `Maria`.
- Result still includes **`aj.`** and **`Á.J.`**.

**Your task**

1. Why does `aj.` pass the filter?
2. Name two ways to make the match **case**-insensitive.
3. Does `NOT LIKE` return rows where `first_name IS NULL`?
4. **Text trap (30 sec):** `Á.J.` looks like an A-initial to a human — why does SQL still **keep** it?

<details>
<summary>✅ Check your answer</summary>

1. `LIKE` / `NOT LIKE` are **case-sensitive** in PostgreSQL, DuckDB, and many engines. Pattern `'%A.%'` matches `A.J.` but not `aj.` — so `NOT LIKE '%A.%'` **keeps** lowercase `aj.`.

2. Case-insensitive options:
   - `NOT ILIKE '%A.%'` (Postgres, DuckDB)
   - `LOWER(first_name) NOT LIKE '%a.%'`

3. **NULL**: `NULL NOT LIKE '%A.%'` → UNKNOWN → row is **excluded** from results (not treated as "match" or "non-match"). Use `IS NULL` explicitly if NULLs matter.

4. **`Á` ≠ `A`**: accent is a **different Unicode character**. `'%A.%'` does not match `Á.J.` → `NOT LIKE` does not exclude it. `ILIKE` alone won't help — it ignores case, not accents. For real pipelines: normalize names in staging or use locale/`unaccent` with explicit product rules.

</details>

---

## Spot Check 11 — NOT IN and the NULL Ghost ⏱️ ~7 min · 🟨 Middle

**Source**: "Users who never purchased product 42."

```sql
SELECT user_id
FROM users
WHERE user_id NOT IN (
  SELECT user_id FROM orders WHERE product_id = 42
);
```

Subquery returns 1,000 ids — plus **one row** where `user_id IS NULL` (bad ETL).

**Your task**

1. How many users come back? (Hint: not "everyone except buyers.")
2. Why does a single NULL break `NOT IN`?
3. Safer rewrite.

<details>
<summary>✅ Check your answer</summary>

**Zero rows** (or empty set) — not the expected list.

`NOT IN` with any NULL in the subquery becomes **UNKNOWN** for every comparison → no row passes the `WHERE`.

Safer:

```sql
WHERE user_id NOT IN (
  SELECT user_id FROM orders
  WHERE product_id = 42 AND user_id IS NOT NULL
);
-- or: NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = users.user_id AND o.product_id = 42)
```

`NOT EXISTS` handles NULLs correctly — interview favorite.

</details>

---

## Progress

| # | Topic | Level | Done |
|---|-------|-------|------|
| 1 | LIKE wildcards | 🟩 | ⬜ |
| 2 | AND / OR | 🟩 | ⬜ |
| 3 | COUNT vs NULL | 🟩 | ⬜ |
| 4 | INNER vs LEFT | 🟩 | ⬜ |
| 5 | DISTINCT band-aid | 🟨 | ⬜ |
| 6 | WHERE vs HAVING | 🟨 | ⬜ |
| 7 | Window grain | 🟨 | ⬜ |
| 8 | Partition / types | 🟨 | ⬜ |
| 9 | IN syntax / OR / `'...'` vs `"..."` | 🟩 | ⬜ |
| 10 | NOT LIKE — case + accents (`A` ≠ `Á`) | 🟩 | ⬜ |
| 11 | NOT IN + NULL | 🟨 | ⬜ |

Mark ✅ in your fork when you can explain each trap **without** peeking.

**Pair with**: Level 1–2 challenges · [interview-sprint/01-SQL-Sprint-30.md](interview-sprint/01-SQL-Sprint-30.md)
