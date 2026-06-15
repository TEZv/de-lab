# Senior Data Engineer — Additions (your north star)

> **Primary track** for de-lab if your goal is **DE comp and ownership** — not only Analytics Engineer. Pair with [`AE-vs-DE.md`](AE-vs-DE.md) and [`04-Senior-AE-Additions.md`](04-Senior-AE-Additions.md).

Horizon: **12–24 months** from analytics background with consistent practice.

## AE vs DE — what Senior DE adds

| Topic | Senior AE | Senior DE |
|-------|-----------|-----------|
| Main worry | "Is the metric definition agreed?" | "Will the pipeline survive Black Friday?" |
| dbt | Deep — semantic layer owner | Uses dbt or replaces with Spark jobs |
| Infra | Light | **Owns** storage, orchestration, IAM, cost |
| Incidents | Fix model logic | Fix **data loss**, lag, duplicate loads |
| Pay ceiling | High at product cos | **Often higher** for platform-critical DE |

## Terms (explain in one sentence each)

| Term | Career |
|------|--------|
| Exactly-once vs at-least-once delivery | 🟨 |
| Dead letter queue / quarantine table | 🟨 |
| Schema evolution (Avro/Protobuf) | 🟨 |
| Data lake vs warehouse vs lakehouse | 🟨 |
| Spark partitioning & skew | 🟥 |
| Stream processing (Flink/Kafka) — concepts | 🟥 |
| Lineage (OpenLineage, DataHub) | 🟨 |
| SLA: freshness vs completeness | 🟨 |
| FinOps: BQ slot vs on-demand, S3 tiers | 🟨 |
| Disaster recovery: RPO / RTO for data | 🟥 |

## Product-aware DE (don't skip this)

Senior DE at a **product** company is not "warehouse plumber only":

1. **Metric ownership:** push back when grain is wrong — even if PM wants the number
2. **Cost vs value:** explain why hourly refresh costs 10× and isn't worth it
3. **Privacy:** PII in logs — design before legal knocks
4. **Experimentation data:** assignments, exposure, metric lag

Mini case: *"CEO wants real-time revenue; you have batch every 6h."* Answer with trade-offs, not "I'll install Kafka tomorrow."

## Mini cases (when ready)

1. **Outage:** staging loaded twice — how detect, fix, prevent?
2. **Scale:** events 10× overnight — what breaks first (BQ, Airflow, cost)?
3. **Migration:** Postgres → BQ CDC vs nightly dump — choose and defend
4. **Stakeholder:** "Finance and product revenue don't match" — debugging order

## Not required yet (avoid rabbit holes)

- Building Kafka from scratch on day one
- Custom Spark cluster admin unless job asks
- Every cloud cert — depth on **one** provider first

## Link to lab

After **CHALLENGES Level 4** + **Bonus 1 portfolio**, revisit this file monthly. Mark terms you can whiteboard without notes.

## Interview resources

- DataEngBytes (podcast)
- "Fundamentals of Data Engineering" (book)
- Company engineering blogs (Netflix, Airbnb data infra — architecture posts)
