import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", cors());

app.get("/health", (c) => c.json({ status: "ok" }));

const port = Number(process.env.PORT) || 3010;
serve({ fetch: app.fetch, port });
console.log(`Server running on port ${port}`);
