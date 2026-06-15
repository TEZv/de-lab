# Backfill Runbook (Challenge 4.4)

## Symptom

Pipeline did not run for dates D1, D2, D3.

## Steps

1. **Do not** full-refresh production marts without a reason
2. Identify missing `event_date` partitions
3. Re-run extract/load **only** for those dates (idempotent)
4. `dbt run --select stg_* --vars '{"start_date": "...", "end_date": "..."}'`
5. `dbt test` on affected models
6. Verify row counts vs expectations
7. Document the incident (even 3 lines in your notes)

## Preventing Duplicates

- Merge on unique key, or
- Delete partition + insert, or
- dbt incremental with `unique_key`
