-- Challenge 4.2 — partitioning design (template)
CREATE TABLE IF NOT EXISTS `project.dataset.fct_events` (
  event_id      INT64,
  user_id       INT64,
  product_id    INT64,
  country       STRING,
  revenue       NUMERIC,
  status        STRING,
  event_ts      TIMESTAMP
)
PARTITION BY DATE(event_ts)
CLUSTER BY user_id, country
OPTIONS (
  description = 'Fact table: one row per completed event',
  require_partition_filter = true
);
