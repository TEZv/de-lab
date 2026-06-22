# 📊 Data Engineering Lab — Hands-On Practice

> **Made in Ukraine** 🇺🇦 | Created by [TEZv](https://github.com/TEZv)

A hands-on repository for learning Data Engineering: from SQL to dbt, from Python ETL to BigQuery and interview prep.

Inspired by [devops-lab](https://github.com/TEZv/devops-lab): quest format, career levels, progress tracker, interview sprint.

**North star:** Data Engineering with product analytics sense — see [CAREER-LEVELS.md](CAREER-LEVELS.md) and [AE-vs-DE.md](interview-sprint/AE-vs-DE.md).

## What's Included

- **SQL** — window functions, CTEs, optimization
- **Python** — pandas, pytest, ETL scripts
- **dbt** — models, tests, incremental loads
- **BigQuery** — partitioning, cost control
- **Interview Sprint** — 30-day technical interview track

## Getting Started

### Option A — Local (recommended)

```bash
git clone https://github.com/TEZv/de-lab.git
cd de-lab
python -m venv .venv
# Windows: .venv\Scripts\activate
source .venv/bin/activate
pip install -r python/requirements.txt
```

Open **[CHALLENGES.md](CHALLENGES.md)** — Level 1, Challenge 1.1.

### Option B — GitHub Codespaces

1. Open this repository on GitHub
2. Click **Code** → **Codespaces** → **Create codespace**
3. Wait ~2 minutes for the environment to build
4. Ready — Python + DuckDB are available in the terminal

## Structure

```
de-lab/
├── .devcontainer/       # Codespace configuration
├── sql/                 # Schema + seed data for DuckDB
├── python/              # ETL exercises, pytest
├── dbt/                 # dbt project (after Level 3)
├── bigquery/            # BQ notes + cost checklist
├── interview-sprint/    # 30-day interview prep (+ AE vs DE guide)
├── portfolio/           # Pet project template
├── CAREER-LEVELS.md     # Intern → Senior badges
├── SPOT-CHECK.md        # 🔍 "Something's off" — correctness traps (no peeking)
└── CHALLENGES.md        # 🎮 Main quest
```

## Challenges

👉 **[CHALLENGES.md](CHALLENGES.md)** — 18+ hands-on challenges from beginner to interview-ready, with questions to think about and a progress tracker.

🔍 **[SPOT-CHECK.md](SPOT-CHECK.md)** — 14 spot-the-bug challenges (`'` vs `"`, accents, `%apple` vs `%apple%`, JOINs…). Guess before you peek.

Fork this repo and start practicing!

## Related Labs

| Repo | Focus |
|------|-------|
| **[de-lab](https://github.com/TEZv/de-lab)** (you are here) | SQL, Python, dbt, BigQuery, interview sprint |
| **[devops-lab](https://github.com/TEZv/devops-lab)** | Docker, Terraform, K8s, CI/CD |

## Interview Sprint

Parallel track for technical interviews — **DE primary**, AE secondary:

- [`interview-sprint/00-README.md`](interview-sprint/00-README.md)
- [`interview-sprint/AE-vs-DE.md`](interview-sprint/AE-vs-DE.md) — **start here**
- [`01-SQL-Sprint-30.md`](interview-sprint/01-SQL-Sprint-30.md)
- [`02-Python-LiveCoding.md`](interview-sprint/02-Python-LiveCoding.md)
- [`03-Data-Modeling-Case.md`](interview-sprint/03-Data-Modeling-Case.md)
- [`04-Senior-AE-Additions.md`](interview-sprint/04-Senior-AE-Additions.md)
- [`05-Senior-DE-Additions.md`](interview-sprint/05-Senior-DE-Additions.md)

## License

MIT — use freely, credit the author ❤️
