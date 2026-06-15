"""Initialize de_lab.duckdb from setup.sql. Run: python init_db.py"""
from pathlib import Path

import duckdb

DB = Path(__file__).resolve().parent / "de_lab.duckdb"
SQL = Path(__file__).resolve().parent / "setup.sql"


def main() -> None:
    con = duckdb.connect(str(DB))
    con.execute(SQL.read_text(encoding="utf-8"))
    con.close()
    print(f"Ready: {DB}")


if __name__ == "__main__":
    main()
