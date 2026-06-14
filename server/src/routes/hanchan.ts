import { Hono } from "hono";
import sql from "../db.js";

const hanchan = new Hono();

hanchan.post("/sessions/:id/hanchan", async (c) => {
  const session_id = Number(c.req.param("id"));
  const body = await c.req.json();
  const { position, score, chip_delta, table_fee } = body;
  const [row] = await sql`
    INSERT INTO hanchan (session_id, position, score, chip_delta, table_fee)
    VALUES (${session_id}, ${position}, ${score}, ${chip_delta ?? 0}, ${table_fee ?? 0})
    RETURNING *
  `;
  return c.json(row, 201);
});

hanchan.put("/hanchan/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const { position, score, chip_delta, table_fee } = body;
  const [row] = await sql`
    UPDATE hanchan
    SET position = ${position}, score = ${score},
        chip_delta = ${chip_delta ?? 0}, table_fee = ${table_fee ?? 0}
    WHERE id = ${id}
    RETURNING *
  `;
  if (!row) return c.json({ error: "not found" }, 404);
  return c.json(row);
});

hanchan.delete("/hanchan/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await sql`DELETE FROM hanchan WHERE id = ${id}`;
  return c.json({ ok: true });
});

export default hanchan;
