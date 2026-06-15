# BigQuery — Cost & Production Notes

## Cost Checklist (Challenge 4.1)

Before every BQ query:

1. **Dry run** — how many bytes? (Console or `bq query --dry_run`)
2. **Partition filter** — `WHERE event_date = ...` on the partition column?
3. **SELECT *** — can you select only the columns you need?
4. **JOIN** — are you exploding the fact table unnecessarily?
5. **Materialization** — table vs view for this use case?

## Rules of Thumb

- Staging: cheap scans, partition by day
- Marts: pre-aggregate for BI tools
- Ad-hoc: set limits + be slot-aware

## DDL Template

See `ddl_fct_events.sql`.

## Backfill

See `backfill-runbook.md`.
