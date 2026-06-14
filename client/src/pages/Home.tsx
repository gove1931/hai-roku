import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import type { SessionWithSummary } from "../types";

function fmt(n: number) {
  return (n >= 0 ? "+" : "") + n.toLocaleString() + "円";
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function Home() {
  const [sessions, setSessions] = useState<SessionWithSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getSessions().then((data) => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  const totalIncome = sessions.reduce((s, r) => s + r.total_income, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">🀄 牌録</h1>
          <button
            onClick={() => navigate("/sessions/new")}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + 新規対局
          </button>
        </div>
        <div className="mt-3 bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-500">累計収支</p>
          <p className={`text-2xl font-bold ${totalIncome >= 0 ? "text-green-600" : "text-red-500"}`}>
            {fmt(totalIncome)}
          </p>
          <p className="text-xs text-gray-400">{sessions.length} 対局</p>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 space-y-3">
        {loading && <p className="text-center text-gray-400 py-8">読み込み中...</p>}
        {!loading && sessions.length === 0 && (
          <p className="text-center text-gray-400 py-12">対局記録がありません</p>
        )}
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate(`/sessions/${s.id}`)}
            className="w-full bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 text-left hover:bg-gray-50"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900">{s.store_name}</p>
                <p className="text-sm text-gray-400 mt-0.5">
                  {fmtDate(s.played_at)} · {s.rate} · {s.hanchan_count}半荘
                </p>
              </div>
              <span className={`text-lg font-bold ${s.total_income >= 0 ? "text-green-600" : "text-red-500"}`}>
                {fmt(s.total_income)}
              </span>
            </div>
          </button>
        ))}
      </main>
    </div>
  );
}
