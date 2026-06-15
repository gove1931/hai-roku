import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import type { Session, Hanchan } from "../types";

type HanchanDraft = {
  position: 1 | 2 | 3 | 4;
  score: string;
  chipDelta: number;
  tableFee: string;
};

export default function EditHanchan() {
  const { id, hanchanId } = useParams<{ id: string; hanchanId: string }>();
  const sessionId = Number(id);
  const hId = Number(hanchanId);
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [draft, setDraft] = useState<HanchanDraft | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSession(sessionId).then((s) => {
      setSession(s);
      const h = (s as { hanchan: Hanchan[] }).hanchan.find((h) => h.id === hId);
      if (h) {
        setDraft({
          position: h.position,
          score: String(h.score),
          chipDelta: h.chip_delta,
          tableFee: h.table_fee > 0 ? String(h.table_fee) : "",
        });
      }
    });
  }, [sessionId, hId]);

  function setPos(p: 1 | 2 | 3 | 4) {
    setDraft((d) => d && { ...d, position: p, tableFee: p !== 1 ? "" : d.tableFee });
  }

  async function save() {
    if (!draft) return;
    const score = Number(draft.score);
    const tableFee = draft.position === 1 ? Number(draft.tableFee || 0) : 0;
    if (isNaN(score)) return;
    setSaving(true);
    try {
      await api.updateHanchan(hId, {
        position: draft.position,
        score,
        chip_delta: draft.chipDelta,
        table_fee: tableFee,
      });
      navigate(`/sessions/${sessionId}`);
    } finally {
      setSaving(false);
    }
  }

  if (!session || !draft) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        読み込み中...
      </div>
    );
  }

  const canSave = draft.score !== "" && !saving;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/sessions/${sessionId}`)}
            className="text-gray-500 text-xl leading-none"
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">半荘を修正</h1>
            <p className="text-xs text-gray-400">{session.store_name}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6">
        {/* 着順 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            着順
          </label>
          <div className="grid grid-cols-4 gap-2">
            {([1, 2, 3, 4] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPos(p)}
                className={`py-4 rounded-xl text-xl font-bold border-2 transition-colors ${
                  draft.position === p
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
              >
                {p}着
              </button>
            ))}
          </div>
        </div>

        {/* チップ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            チップ
          </label>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setDraft((d) => d && { ...d, chipDelta: d.chipDelta - 1 })}
              className="w-16 h-16 rounded-full bg-red-100 text-red-600 text-3xl font-bold flex items-center justify-center active:bg-red-200"
            >
              −
            </button>
            <div className="text-center min-w-[80px]">
              <p
                className={`text-4xl font-bold ${
                  draft.chipDelta > 0
                    ? "text-green-600"
                    : draft.chipDelta < 0
                    ? "text-red-500"
                    : "text-gray-900"
                }`}
              >
                {draft.chipDelta > 0 ? "+" : ""}
                {draft.chipDelta}
              </p>
              <p className="text-xs text-gray-400 mt-1">枚</p>
            </div>
            <button
              onClick={() => setDraft((d) => d && { ...d, chipDelta: d.chipDelta + 1 })}
              className="w-16 h-16 rounded-full bg-green-100 text-green-600 text-3xl font-bold flex items-center justify-center active:bg-green-200"
            >
              ＋
            </button>
          </div>
          {draft.chipDelta !== 0 && (
            <p className="text-center text-sm text-gray-500 mt-2">
              {draft.chipDelta > 0 ? "+" : ""}
              {(draft.chipDelta * session.chip_price).toLocaleString()}円
            </p>
          )}
        </div>

        {/* 収支 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            収支（円）
          </label>
          <input
            type="number"
            value={draft.score}
            onChange={(e) => setDraft((d) => d && { ...d, score: e.target.value })}
            placeholder="例：+3000 / -2000"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 場代（1着のみ） */}
        {draft.position === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              場代（円）
              <span className="text-xs text-gray-400 ml-1">1着時に収支から差し引かれます</span>
            </label>
            <input
              type="number"
              value={draft.tableFee}
              onChange={(e) => setDraft((d) => d && { ...d, tableFee: e.target.value })}
              placeholder="例：1000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </main>

      <div className="px-4 py-4 bg-white border-t border-gray-200">
        <button
          onClick={save}
          disabled={!canSave}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl disabled:opacity-40 transition-opacity"
        >
          保存
        </button>
      </div>
    </div>
  );
}
