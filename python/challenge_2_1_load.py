"""Challenge 2.1 — load and validate events. Implement aggregate_daily in 2.2."""
from __future__ import annotations

from pathlib import Path

import pandas as pd

DATA_DIR = Path(__file__).resolve().parent.parent / "sql"


def load_events_csv(path: Path | None = None) -> pd.DataFrame:
    """Load events; export from DuckDB if CSV missing."""
    # TODO: implement — read CSV or query DuckDB
    raise NotImplementedError("Complete Challenge 2.1")


def validate_events(df: pd.DataFrame) -> tuple[pd.DataFrame, int]:
    """Return (valid_rows, rejected_count). Reject null user_id or revenue < 0."""
    # TODO: implement
    raise NotImplementedError("Complete Challenge 2.1")
