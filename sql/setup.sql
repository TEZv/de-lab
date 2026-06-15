-- Pipeline Quest Inc. — seed schema for Level 1 challenges
-- Run: duckdb de_lab.duckdb < setup.sql

CREATE TABLE IF NOT EXISTS users (
    user_id     INTEGER PRIMARY KEY,
    country     VARCHAR,
    signup_date DATE
);

CREATE TABLE IF NOT EXISTS events (
    event_id    INTEGER,
    user_id     INTEGER,
    product_id  INTEGER,
    event_date  DATE,
    revenue     DECIMAL(10, 2),
    status      VARCHAR,  -- completed | refunded | pending
    created_at  TIMESTAMP
);

DELETE FROM users;
DELETE FROM events;

INSERT INTO users VALUES
    (1, 'UA', '2024-01-15'),
    (2, 'PL', '2024-02-01'),
    (3, 'US', '2024-03-10'),
    (4, 'DE', '2024-04-05'),
    (5, 'UA', '2024-05-20'),
    (6, 'GB', '2024-06-01'),
    (7, 'US', '2024-07-12'),
    (8, 'PL', '2024-08-03');

INSERT INTO events VALUES
    (101, 1, 10, CURRENT_DATE - INTERVAL 5 DAY,  29.99, 'completed', CURRENT_TIMESTAMP - INTERVAL 5 DAY),
    (102, 1, 11, CURRENT_DATE - INTERVAL 3 DAY,  49.99, 'completed', CURRENT_TIMESTAMP - INTERVAL 3 DAY),
    (103, 2, 10, CURRENT_DATE - INTERVAL 10 DAY, 29.99, 'completed', CURRENT_TIMESTAMP - INTERVAL 10 DAY),
    (104, 3, 12, CURRENT_DATE - INTERVAL 2 DAY,  99.99, 'completed', CURRENT_TIMESTAMP - INTERVAL 2 DAY),
    (105, 4, 10, CURRENT_DATE - INTERVAL 1 DAY,  29.99, 'refunded',  CURRENT_TIMESTAMP - INTERVAL 1 DAY),
    (106, 5, 11, CURRENT_DATE - INTERVAL 7 DAY,  49.99, 'completed', CURRENT_TIMESTAMP - INTERVAL 7 DAY),
    (107, 6, 12, CURRENT_DATE - INTERVAL 4 DAY,  99.99, 'completed', CURRENT_TIMESTAMP - INTERVAL 4 DAY),
    (108, 7, 10, CURRENT_DATE - INTERVAL 6 DAY,  29.99, 'completed', CURRENT_TIMESTAMP - INTERVAL 6 DAY),
    (109, 8, 11, CURRENT_DATE - INTERVAL 8 DAY,  49.99, 'pending',   CURRENT_TIMESTAMP - INTERVAL 8 DAY),
    -- duplicate row (for dedupe challenge)
    (110, 1, 10, CURRENT_DATE - INTERVAL 5 DAY,  29.99, 'completed', CURRENT_TIMESTAMP - INTERVAL 4 DAY),
    (111, 2, 10, CURRENT_DATE - INTERVAL 10 DAY, 29.99, 'completed', CURRENT_TIMESTAMP - INTERVAL 9 DAY);
