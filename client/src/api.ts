import type { SessionWithSummary, SessionDetail, Session, Hanchan } from "./types";

const BASE = import.meta.env.BASE_URL + "api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  getSessions: () => request<SessionWithSummary[]>("/sessions"),
  getSession: (id: number) => request<SessionDetail>(`/sessions/${id}`),
  createSession: (body: Omit<Session, "id" | "created_at">) =>
    request<Session>("/sessions", { method: "POST", body: JSON.stringify(body) }),
  updateSession: (id: number, body: Omit<Session, "id" | "created_at">) =>
    request<Session>(`/sessions/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteSession: (id: number) =>
    request<{ ok: boolean }>(`/sessions/${id}`, { method: "DELETE" }),

  createHanchan: (sessionId: number, body: Omit<Hanchan, "id" | "session_id" | "created_at">) =>
    request<Hanchan>(`/sessions/${sessionId}/hanchan`, { method: "POST", body: JSON.stringify(body) }),
  updateHanchan: (id: number, body: Omit<Hanchan, "id" | "session_id" | "created_at">) =>
    request<Hanchan>(`/hanchan/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteHanchan: (id: number) =>
    request<{ ok: boolean }>(`/hanchan/${id}`, { method: "DELETE" }),
};
