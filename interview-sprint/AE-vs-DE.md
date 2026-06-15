# Analytics Engineer vs Data Engineer

> **Your goal:** transition into **Data Engineering** for higher comp and ownership — not stay in "cheap analytics" forever. This lab supports that — but you still need **product analytics thinking** so you're a DE who **understands the business**, not a script runner.

## Quick comparison

| | **Analytics Engineer (AE)** | **Data Engineer (DE)** |
|---|---------------------------|------------------------|
| **Core output** | Trusted metrics, semantic layer, dashboards | Reliable pipelines, storage, ingestion |
| **Typical tools** | dbt, Looker/Metabase, SQL, light Python | Python/Spark, Airflow/Dagster, cloud, streaming |
| **Stakeholders** | Analysts, PM, finance — "what does this number mean?" | Platform, security, cost — "will this break at 3 AM?" |
| **Interview focus** | Modeling, metric definitions, dbt tests | Idempotency, backfills, partitioning, failure modes |
| **Comp (rough, remote UA)** | Often strong, but ceiling varies by company | **Higher ceiling** at product / international DE |
| **This lab** | Levels 3–5 + file `04` | Levels 2–5 + file `05` — **primary track** |

## Why people say "analytics is cheaper"

Often they mean **reporting / BI analyst** — not AE, and not DE.

- **Reporting analyst:** pull numbers in Sheets, ad-hoc SQL → lower band
- **AE:** owns metrics layer, close to product → mid band, great at product companies (Genesis, AMO)
- **DE:** owns data **platform** and movement → **target band for $5k+ remote**

You already have analytics instincts — that's an **advantage** for DE at a product company, not a detour.

## What "product analytics DNA" means in de-lab

Before every model or pipeline, ask:

1. **Who decides this number is correct?** (finance vs product vs growth)
2. **What action** does someone take from this metric?
3. **Grain:** one row = one what? (wrong grain = wrong business decision)
4. **Freshness:** is yesterday enough, or do we need hourly?

Challenges with a **📊 Product lens** block train this explicitly.

## Which interview sprint files?

| File | Role |
|------|------|
| `01`–`03` | Everyone — SQL, Python, modeling |
| `04-Senior-AE-Additions.md` | AE vocabulary (Genesis-style companies) |
| `05-Senior-DE-Additions.md` | **Your main senior north star** |

Do **not** skip `04` if you apply to Analytics Engineer roles — but prioritize `05` for DE transition.

## Suggested path (analytics background → DE)

```
Months 1–3:  L1 SQL + L2 Python + sprint 01–02     (🟩 Junior)
Months 4–6:  L3 dbt + product lens + sprint 03     (🟩→🟨)
Months 7–9:  L4 BQ/ops + portfolio Bonus 1         (🟨 Middle)
Months 10+:  L5 interviews + 05 Senior DE          (🟨→🟥)
```

10–15 hrs/week — adjust if employed full-time.
