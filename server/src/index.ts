import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import sessions from "./routes/sessions.js";
import hanchan from "./routes/hanchan.js";

const app = new Hono();

app.use("*", cors());
app.get("/health", (c) => c.json({ status: "ok" }));
app.route("/api/sessions", sessions);
app.route("/api", hanchan);

const port = Number(process.env.PORT) || 3010;
serve({ fetch: app.fetch, port });
console.log(`Server running on port ${port}`);
