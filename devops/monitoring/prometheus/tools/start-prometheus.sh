#!/bin/sh
exec /bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.retention.time=30d \
  --storage.tsdb.retention.size=10GB \
  --storage.tsdb.path=/prometheus \
  --storage.tsdb.wal-compression        # Compress WAL to save disk