import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import type { Rate } from "../types";

const RATE_OPTIONS: Rate[] = ["点3", "点5", "点10", "カスタム"];
const CHIP_PRESETS = [100, 300, 500, 1000];

function nowLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function NewSession() {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("");
  const [playedAt, setPlayedAt] = useState(nowLocal);
  const [rate, setRate] = useState<Rate>("点3");
  const [chipPreset, setChipPreset] = useState<number | null>(100);
  const [customChip, setCustomChip] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const chipPrice = customChip ? Number(customChip) : (chipPreset ?? 0);
  const canSubmit = storeName.trim() && chipPrice > 0 && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const session = await api.createSession({
        store_name: storeName.trim(),
        played_at: new Date(playedAt).toISOString(),
        rate,
        chip_price: chipPrice,
      });
      navigate(`/sessions/${session.id}/hanchan/new`);
    } finally {
      setSubmitting(false);
    }
  }

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
          <h1 className="text-lg font-bold text-gray-900">新規対局</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            店舗名
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="例：フリー雀荘 〇〇"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            日時
          </label>
          <input
            type="datetime-local"
            value={playedAt}
            onChange={(e) => setPlayedAt(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            レート
          </label>
          <div className="grid grid-cols-4 gap-2">
            {RATE_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRate(r)}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  rate === r
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            チップ単価
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {CHIP_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setChipPreset(p);
                  setCustomChip("");
                }}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  chipPreset === p && !customChip
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {p}円
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder="カスタム金額（円）"
            value={customChip}
            onChange={(e) => {
              setCustomChip(e.target.value);
              if (e.target.value) setChipPreset(null);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </main>

      <div className="px-4 py-4 bg-white border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl disabled:opacity-40 transition-opacity"
        >
          次へ（半荘を入力）
        </button>
      </div>
    </div>
  );
}
