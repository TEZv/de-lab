# Portfolio Project Template (Bonus 1)

A separate **public** repo (not necessarily this lab). Goal: show a hiring manager you can ship end-to-end.

## Minimum Scope

| Component | What to build |
|-----------|---------------|
| Data | Olist Brazilian E-commerce (Kaggle) or synthetic data |
| Ingest | Python script → parquet/CSV |
| Transform | dbt: 3 staging + 2 mart models |
| Tests | unique, not_null, relationships |
| Docs | README with diagram (mermaid) |
| CI | GitHub Action: `dbt test` |

## README Skeleton

```markdown
# [Project name] — Analytics Engineering Demo

## Business questions
1. ...
2. ...

## Architecture
[mermaid diagram]

## How to run
dbt run && dbt test

## What I learned
- ...
```

## Avoid

- 50 tables with no purpose
- Generic "AI-generated" README with no specifics
- Secrets in the repo

## Link to de-lab

Follow `CHALLENGES.md` Bonus 1 after completing Level 3.
