import { Hono } from "hono";
import sql from "../db.js";

const sessions = new Hono();

sessions.get("/", async (c) => {
  const rows = await sql`
    SELECT
      s.*,
      COUNT(h.id)::int            AS hanchan_count,
      COALESCE(SUM(h.score), 0)::int  AS total_score,
      COALESCE(SUM(h.chip_delta * s.chip_price), 0)::int AS total_chip,
      COALESCE(SUM(h.score + h.chip_delta * s.chip_price - h.table_fee), 0)::int AS total_income
    FROM sessions s
    LEFT JOIN hanchan h ON h.session_id = s.id
    GROUP BY s.id
    ORDER BY s.played_at DESC
  `;
  return c.json(rows);
});

sessions.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const [session] = await sql`SELECT * FROM sessions WHERE id = ${id}`;
  if (!session) return c.json({ error: "not found" }, 404);

  const hanchan = await sql`
    SELECT * FROM hanchan WHERE session_id = ${id} ORDER BY created_at ASC
  `;
  return c.json({ ...session, hanchan });
});

sessions.post("/", async (c) => {
  const body = await c.req.json();
  const { store_name, played_at, rate, chip_price } = body;
  const [row] = await sql`
    INSERT INTO sessions (store_name, played_at, rate, chip_price)
    VALUES (${store_name}, ${played_at}, ${rate}, ${chip_price})
    RETURNING *
  `;
  return c.json(row, 201);
});

sessions.put("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const { store_name, played_at, rate, chip_price } = body;
  const [row] = await sql`
    UPDATE sessions
    SET store_name = ${store_name}, played_at = ${played_at},
        rate = ${rate}, chip_price = ${chip_price}
    WHERE id = ${id}
    RETURNING *
  `;
  if (!row) return c.json({ error: "not found" }, 404);
  return c.json(row);
});

sessions.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await sql`DELETE FROM sessions WHERE id = ${id}`;
  return c.json({ ok: true });
});

export default sessions;
