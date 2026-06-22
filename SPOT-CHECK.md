# 🔍 Spot Check — "Something's Off"

> **Made in Ukraine** 🇺🇦 | Companion to [CHALLENGES.md](CHALLENGES.md)

These are **not** build exercises. A tutorial, a colleague, or a dashboard *looks* correct — but fails a correctness check.

**How to play**

1. Read the snippet. **Do not** open the answer yet.
2. Write (or say out loud): what's wrong, who gets hurt (wrong counts? missing rows?), and the fix.
3. Open **Check your answer** only after you've committed to an answer.
4. Optional: run the query in DuckDB if you want proof (`python sql/init_db.py` first).

**Career levels** match [CAREER-LEVELS.md](CAREER-LEVELS.md). Time = thinking time, not typing.

**Quest order:** start with **#1–#2** when DataCamp text filters bite — same rules as every Spot Check: guess first, then peek.

---

## Spot Check 1 — The Quote Quest ⏱️ ~5 min · 🟦 Intern

**Source**: Three analysts, one filter — three ways to write "France".

```sql
-- Analyst 1
SELECT title FROM films WHERE country = France;

-- Analyst 2 ("added quotes")
SELECT title FROM films WHERE country = "France";

-- Analyst 3
SELECT title FROM films WHERE country = 'France';
```

Bonus row: filter for author **O'Reilly** in `books.author`.

**Your task**

1. Which analyst is right for filtering **text**? What happens with the other two?
2. In one sentence: what does SQL think `"France"` means vs `'France'`?
3. How do you write the string `O'Reilly` inside single quotes?
4. What is `''` (two single quotes with nothing between)?

<details>
<summary>✅ Check your answer</summary>

1. **Analyst 3 only.** Analyst 1: `France` is a **column name** — error or wrong column compare. Analyst 2: `"France"` is a **quoted identifier** (table/column name), not a text value.
2. `'France'` = string literal. `"France"` = "thing named France" in the schema — not the country string.
3. `WHERE author = 'O''Reilly'` — double the inner `'` → `''`.
4. **Empty string** (zero characters). Not NULL.

**Remember by doing:** text in filters → **single quotes** `'...'`. You'll reuse this in **#11 (IN)**.

</details>

---

## Spot Check 2 — Same Letter, Different Character ⏱️ ~5 min · 🟩 Junior

**Source**: Pipeline Quest loaded EU user CSVs into `users`. PM runs:

```sql
SELECT COUNT(*) FROM users WHERE country = 'Mexico';
-- 0 rows

SELECT COUNT(*) FROM users WHERE country = 'México';
-- 847 rows
```

Same week, HR filter:

```sql
SELECT first_name FROM people
WHERE first_name NOT LIKE '%A.%';
```

Dataset includes `A.J.`, `Á.J.`, `Maria`. Result still has **`Á.J.`** (but not `A.J.`).

**Your task**

1. Why is the PM's `Mexico` count zero?
2. `Á.J.` looks like an "A initial" to a human — why does SQL **keep** it?
3. Will `NOT ILIKE '%a.%'` drop `Á.J.`? Why or why not?
4. **DE move:** one staging-layer fix so dashboards don't split `Mexico` / `México`.

<details>
<summary>✅ Check your answer</summary>

1. **`é` ≠ `e`** — different Unicode code points. `=` is not "same word to a human"; it's exact byte/character match (unless collation says otherwise).
2. Pattern uses ASCII **`A`**, not **`Á`**. `NOT LIKE '%A.%'` only excludes rows matching that exact pattern — `Á.J.` doesn't match.
3. **No.** `ILIKE` ignores **case** (`a`/`A`), not **accents** (`A`/`Á`).
4. Staging: Unicode **NFC** normalize; optional accent fold / lookup table (`México` → `Mexico`) with **documented** product rules — never assume analysts will guess the encoding in the CSV.

**Unicode bonus:** `é` can be one character or `e` + combining accent — looks identical, `=` may still fail. Normalize **once** on ingest.

</details>

---

## Spot Check 3 — Wildcard Trap ⏱️ ~5 min · 🟩 Junior

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

**See also**: **#14** — `%` can match **zero** characters (`%apple` vs `%apple%`).

</details>

---

## Spot Check 4 — AND Eats OR ⏱️ ~5 min · 🟩 Junior

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

## Spot Check 5 — COUNT the NULLs ⏱️ ~5 min · 🟩 Junior

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

## Spot Check 6 — JOIN Then Lose ⏱️ ~7 min · 🟩 Junior

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

## Spot Check 7 — DISTINCT Band-Aid ⏱️ ~7 min · 🟨 Middle

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

## Spot Check 8 — HAVING Too Early ⏱️ ~7 min · 🟨 Middle

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

## Spot Check 9 — Window Without Frame ⏱️ ~10 min · 🟨 Middle

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

## Spot Check 10 — "Free" Full Table Scan ⏱️ ~10 min · 🟨 Middle

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

## Spot Check 11 — IN or Nothing ⏱️ ~5 min · 🟩 Junior

**Source**: DataCamp-style filter — films from Germany or France (1920, 1930, or 1940).

```sql
-- Version A: years
WHERE release_year IN 1920, 1930, 1940

-- Version B: countries
WHERE country IN Germany, France
```

**Your task**

1. What's syntactically wrong with Version A and B?
2. Rewrite Version B correctly (remember **#1 — Quote Quest**).
3. When is `IN (...)` better than chaining `OR`?

<details>
<summary>✅ Check your answer</summary>

`IN` requires **parentheses** around the value list:

```sql
WHERE release_year IN (1920, 1930, 1940)
WHERE country IN ('Germany', 'France')
```

Text values need **single quotes** `'...'` — `Germany` without quotes is a column name. Double quotes `"Germany"` are identifiers, not strings (**#1**).

`IN` shines when the list is long (5+ values) or you generate values from a subquery. For two options, `OR` is fine — but `IN` is clearer to read.

</details>

---

## Spot Check 12 — NOT LIKE: Case Trap ⏱️ ~5 min · 🟩 Junior

**Source**: "Exclude names with an **A-dot** initial pattern" (DataCamp-style).

```sql
SELECT first_name
FROM people
WHERE first_name NOT LIKE '%A.%';
```

Dataset: `A.J.`, `aj.`, `Maria`. Analyst expects only `Maria`. Result still includes **`aj.`**.

**Your task**

1. Why does `aj.` pass the filter?
2. Name two ways to make the match case-insensitive.
3. Does `NOT LIKE` return rows where `first_name IS NULL`?
4. If you also see `Á.J.` in the data — which earlier Spot Check explains it?

<details>
<summary>✅ Check your answer</summary>

1. `LIKE` / `NOT LIKE` are **case-sensitive** in PostgreSQL, DuckDB, and many engines. Pattern `'%A.%'` matches `A.J.` but not `aj.` — so `NOT LIKE '%A.%'` **keeps** lowercase `aj.`.

2. Case-insensitive options:
   - `NOT ILIKE '%A.%'` (Postgres, DuckDB)
   - `LOWER(first_name) NOT LIKE '%a.%'`

3. **NULL**: `NULL NOT LIKE '%A.%'` → UNKNOWN → row is **excluded** from results. Use `IS NULL` explicitly if NULLs matter.

4. **`Á.J.`** → **Spot Check #2** (accents). `ILIKE` won't save you there.

</details>

---

## Spot Check 13 — NOT IN and the NULL Ghost ⏱️ ~7 min · 🟨 Middle

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

## Spot Check 14 — Apple Percent: Suffix or Surround? ⏱️ ~5 min · 🟩 Junior

**Source**: DataCamp *Exploratory Data Analysis in SQL* — `fruit.fav_fruit` cleanup. A colleague insists both patterns below mean "the word apple, nothing else."

```sql
-- Pattern A
WHERE fav_fruit LIKE '%apple'

-- Pattern B
WHERE fav_fruit LIKE '%apple%'
```

Imagine these rows in `fav_fruit`:

| fav_fruit |
|-----------|
| `apple` |
| `APPLE` |
| `apples` |
| `applesauce` |
| `pineapple` |

**Your task**

1. For the **exact** value `apple` (no extra letters): do Pattern A and Pattern B both match? What does the leading `%` "consume" when there is nothing before `apple`?
2. For `apples` and `applesauce`: which pattern(s) still match — A only, B only, both, or neither?
3. For `pineapple`: which pattern(s) match? If the PM wanted "apple" as a survey answer, is that a **feature** or a **false positive**?
4. **DE move:** one pattern or filter tweak so you get `apple` / `APPLE` but not `pineapple` (hint: word boundaries are awkward in SQL — name two realistic options).

<details>
<summary>✅ Check your answer</summary>

1. **Both match** plain `apple`. `%` means **zero or more** characters — the first `%` can match **nothing** (empty), then the literal `apple` lines up. Same for `%apple%`: both `%` signs can be zero-width → exact `apple`.

2. **`apples` / `applesauce`:** only **Pattern B** (`%apple%`). Pattern A requires the string to **end** with exactly `apple`; `apples` ends with `…es`, `applesauce` ends with `…auce`.

3. **`pineapple`:** **both** patterns match (`…pine` + `apple` suffix for A; `apple` substring for B). That's a **false positive** if the business question is "picked apple" — classic *pineapple* trap from the course video.

4. Realistic fixes (pick one mindset):
   - **Exact match after normalize:** `LOWER(TRIM(fav_fruit)) = 'apple'` (drops plurals/spaces; still need a rule for `apples`).
   - **Delimiter / tokenize:** `split_part` or regex word boundary if the engine supports it; or staging table that maps raw → `standardized_fruit`.
   - **Not** "just add `%`" — more `%` usually matches **more**, not less.

**Pair with #3:** #3 is **prefix** (`Adel%` vs `Aden`); #14 is **suffix / substring** (`%apple` vs `%apple%` vs `pineapple`).

</details>

---

## Progress

| # | Topic | Level | Done |
|---|-------|-------|------|
| 1 | Quote quest `'...'` vs `"..."` | 🟦 | ⬜ |
| 2 | Accents `A` ≠ `Á`, México/Mexico | 🟩 | ⬜ |
| 3 | LIKE wildcards | 🟩 | ⬜ |
| 4 | AND / OR | 🟩 | ⬜ |
| 5 | COUNT vs NULL | 🟩 | ⬜ |
| 6 | INNER vs LEFT | 🟩 | ⬜ |
| 7 | DISTINCT band-aid | 🟨 | ⬜ |
| 8 | WHERE vs HAVING | 🟨 | ⬜ |
| 9 | Window grain | 🟨 | ⬜ |
| 10 | Partition / types | 🟨 | ⬜ |
| 11 | IN syntax / OR | 🟩 | ⬜ |
| 12 | NOT LIKE case / NULL | 🟩 | ⬜ |
| 13 | NOT IN + NULL | 🟨 | ⬜ |
| 14 | `%apple` vs `%apple%` / pineapple | 🟩 | ⬜ |

Mark ✅ in your fork when you can explain each trap **without** peeking.

**Pair with**: Level 1–2 challenges · [interview-sprint/01-SQL-Sprint-30.md](interview-sprint/01-SQL-Sprint-30.md)
