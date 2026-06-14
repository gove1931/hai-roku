import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import type { Hanchan, SessionDetail as SessionDetailType } from "../types";

function fmt(n: number) {
  return (n >= 0 ? "+" : "") + n.toLocaleString() + "円";
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function posLabel(p: number) {
  return ["", "1着", "2着", "3着", "4着"][p] ?? `${p}着`;
}

function posColor(p: number) {
  return p === 1
    ? "text-yellow-600 bg-yellow-50"
    : p === 2
    ? "text-blue-600 bg-blue-50"
    : p === 3
    ? "text-gray-600 bg-gray-100"
    : "text-red-500 bg-red-50";
}

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const sessionId = Number(id);
  const navigate = useNavigate();

  const [data, setData] = useState<SessionDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setLoading(true);
    api.getSession(sessionId).then((d) => {
      setData(d);
      setLoading(false);
    });
  }

  useEffect(() => {
    load();
  }, [sessionId]);

  async function deleteHanchan(h: Hanchan) {
    if (!confirm(`${posLabel(h.position)}の半荘を削除しますか？`)) return;
    await api.deleteHanchan(h.id);
    load();
  }

  async function deleteSession() {
    if (!confirm("この対局を削除しますか？\n（半荘データもすべて削除されます）")) return;
    setDeleting(true);
    await api.deleteSession(sessionId);
    navigate("/");
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        読み込み中...
      </div>
    );
  }

  const hanchan = data.hanchan;
  const totalScore = hanchan.reduce((s, h) => s + h.score, 0);
  const totalChip = hanchan.reduce((s, h) => s + h.chip_delta * data.chip_price, 0);
  const totalFee = hanchan.reduce((s, h) => s + h.table_fee, 0);
  const totalIncome = totalScore + totalChip - totalFee;

  const posDist = [1, 2, 3, 4].map((p) => ({
    pos: p,
    count: hanchan.filter((h) => h.position === p).length,
  }));

  const avgPos =
    hanchan.length > 0
      ? (hanchan.reduce((s, h) => s + h.position, 0) / hanchan.length).toFixed(2)
      : "—";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 text-xl leading-none"
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">{data.store_name}</h1>
            <p className="text-xs text-gray-400">
              {fmtDate(data.played_at)} · {data.rate} · チップ{data.chip_price}円
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 space-y-4">
        {/* サマリーカード */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500">総収支</p>
              <p className={`text-3xl font-bold ${totalIncome >= 0 ? "text-green-600" : "text-red-500"}`}>
                {fmt(totalIncome)}
              </p>
            </div>
            <div className="text-right text-sm text-gray-500 space-y-0.5">
              <p>収支 {fmt(totalScore)}</p>
              <p>チップ {fmt(totalChip)}</p>
              {totalFee > 0 && <p>場代 −{totalFee.toLocaleString()}円</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-500">半荘数</p>
              <p className="text-xl font-bold text-gray-900">{hanchan.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">平均着順</p>
              <p className="text-xl font-bold text-gray-900">{avgPos}</p>
            </div>
          </div>

          {hanchan.length > 0 && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              {posDist.map(({ pos, count }) => (
                <div key={pos} className="flex-1 text-center">
                  <p className={`text-xs font-medium rounded px-1 py-0.5 ${posColor(pos)}`}>
                    {posLabel(pos)}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{count}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 半荘一覧 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-600">半荘一覧</h2>
            <button
              onClick={() => navigate(`/sessions/${sessionId}/hanchan/new`)}
              className="text-sm text-blue-600 font-medium"
            >
              ＋ 追加
            </button>
          </div>

          {hanchan.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 px-4 py-8 text-center text-gray-400 text-sm">
              半荘データがありません
            </div>
          ) : (
            <div className="space-y-2">
              {hanchan.map((h, i) => {
                const chipVal = h.chip_delta * data.chip_price;
                const income = h.score + chipVal - h.table_fee;
                return (
                  <div
                    key={h.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">#{i + 1}</span>
                        <span className={`text-sm font-bold px-2 py-0.5 rounded ${posColor(h.position)}`}>
                          {posLabel(h.position)}
                        </span>
                        <div className="text-sm text-gray-600">
                          <span>収支 {fmt(h.score)}</span>
                          {h.chip_delta !== 0 && (
                            <span className="ml-2">チップ {fmt(chipVal)}</span>
                          )}
                          {h.table_fee > 0 && (
                            <span className="ml-2 text-gray-400">
                              場代 −{h.table_fee.toLocaleString()}円
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-base font-bold ${income >= 0 ? "text-green-600" : "text-red-500"}`}>
                          {fmt(income)}
                        </span>
                        <button
                          onClick={() => deleteHanchan(h)}
                          className="text-gray-300 hover:text-red-400 text-lg leading-none"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 削除ボタン */}
        <div className="pt-4 pb-8">
          <button
            onClick={deleteSession}
            disabled={deleting}
            className="w-full text-red-400 text-sm py-2 border border-red-200 rounded-xl hover:bg-red-50 disabled:opacity-40"
          >
            この対局を削除
          </button>
        </div>
      </main>
    </div>
  );
}
