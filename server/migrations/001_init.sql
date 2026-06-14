CREATE TABLE IF NOT EXISTS sessions (
  id          SERIAL PRIMARY KEY,
  store_name  TEXT        NOT NULL,
  played_at   TIMESTAMPTZ NOT NULL,
  rate        TEXT        NOT NULL,
  chip_price  INTEGER     NOT NULL DEFAULT 100,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hanchan (
  id          SERIAL PRIMARY KEY,
  session_id  INTEGER     NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  position    INTEGER     NOT NULL CHECK (position BETWEEN 1 AND 4),
  score       INTEGER     NOT NULL DEFAULT 0,
  chip_delta  INTEGER     NOT NULL DEFAULT 0,
  table_fee   INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
