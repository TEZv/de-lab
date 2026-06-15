# dbt module

Level 3 challenges. Start after Python Level 2.

## Setup (DuckDB — free)

```bash
pip install dbt-duckdb
cd dbt
dbt init pipeline_quest
# profiles.yml: type duckdb, path ../sql/de_lab.duckdb
```

## Target Structure

```
models/
  staging/
    stg_events.sql
    stg_users.sql
  marts/
    fct_daily_revenue.sql
    dim_users.sql
```

## Challenges

See `CHALLENGES.md` → Level 3.

## BigQuery

Switch to the `dbt-bigquery` adapter — same models, different `profiles.yml`.
