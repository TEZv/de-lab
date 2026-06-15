"""Tests unlock after you implement challenge_2_1_load.py"""
import pandas as pd
import pytest

from challenge_2_1_load import validate_events


def test_empty_input():
    df = pd.DataFrame(columns=["user_id", "revenue", "country", "event_date"])
    valid, rejected = validate_events(df)
    assert len(valid) == 0
    assert rejected == 0


def test_negative_revenue_filtered():
    df = pd.DataFrame(
        {"user_id": [1, 2], "revenue": [10.0, -5.0], "country": ["UA", "US"], "event_date": ["2024-01-01", "2024-01-02"]}
    )
    valid, rejected = validate_events(df)
    assert len(valid) == 1
    assert rejected == 1


def test_null_user_id_filtered():
    df = pd.DataFrame(
        {"user_id": [1, None], "revenue": [10.0, 20.0], "country": ["UA", "US"], "event_date": ["2024-01-01", "2024-01-02"]}
    )
    valid, rejected = validate_events(df)
    assert len(valid) == 1
    assert rejected == 1
