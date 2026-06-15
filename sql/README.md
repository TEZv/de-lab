# SQL module

Seed data for Level 1 ([CHALLENGES.md](../CHALLENGES.md)).

## Quick Start

```bash
pip install duckdb
cd sql
python init_db.py
duckdb de_lab.duckdb -c "SELECT COUNT(*) FROM events;"
```

Or from repo root: `python sql/init_db.py`

## Files

| File | Purpose |
|------|---------|
| `setup.sql` | Creates `users`, `events` with duplicates for dedupe practice |

## Without DuckDB CLI

```python
import duckdb
con = duckdb.connect("de_lab.duckdb")
con.execute(open("setup.sql").read())
```

Then complete challenges 1.1–1.4 in the root `CHALLENGES.md`.
