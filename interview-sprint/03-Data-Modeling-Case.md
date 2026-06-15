# Data Modeling Case — Interview Templates

## How to Answer (5 steps)

1. **Clarify the business question** (2–3 sentences)
2. **Fact grain** — one row = what?
3. **Dimensions** — who, what, when, where
4. **Metrics** — formulas in plain language
5. **Trade-offs** — batch, cost, freshness

---

## Case 1 — E-commerce 🟢

**Prompt:** "We have orders, order_items, users. CEO wants daily revenue and AOV."

**Expected structure:**
- `fct_order_items` — grain: 1 line item
- `dim_users`, `dim_products`, `dim_date`
- Metrics: `SUM(revenue)`, `AOV = revenue / orders`

**Follow-up:** how to calculate returning vs new customers?

---

## Case 2 — Subscriptions / MRR 🟡

**Prompt:** "SaaS: subscriptions with plan, start_date, cancel_date."

**Key points:**
- MRR = sum of monthly-normalized active subscriptions
- Churn = cancelled in month / active at start of month
- SCD Type 2 on `dim_subscription` if plan changes

---

## Case 3 — Mobile App Events 🟡

**Prompt:** "Event log: app_open, purchase, level_complete."

**Key points:**
- `fct_events` vs pre-aggregated `fct_daily_user_metrics`
- Session definition (30 min gap)
- Retention D1/D7/D30

---

## Case 4 — Lakehouse / Medallion 🟡🔴

**Prompt:** "Bronze raw JSON → Silver cleaned → Gold for BI. Describe the layers."

**Key points:**
- Bronze: as-is, append
- Silver: typed, deduped, PII hashed
- Gold: business metrics, star schema
- dbt tests: unique, not_null, relationships

---

## Case 5 — Bad Design (fix it) 🔴

**Prompt:** "One table `everything` with 80 columns. What's wrong?"

Answer: no grain, repeated dims, slow BI, no history, untestable → normalize into facts/dims.

---

## Practice Session (60 min)

1. Pick Case 2 or 4
2. 15 min — schema on paper / Excalidraw
3. 15 min — 3 pseudo-SQL queries for metrics
4. 15 min — which dbt tests would you add?
5. 15 min — record pitch out loud

## Checklist

- [ ] State grain without hesitation
- [ ] Distinguish fact from dimension
- [ ] Know SCD Type 1 vs 2 (when to use which)
- [ ] Explain incremental models in dbt
