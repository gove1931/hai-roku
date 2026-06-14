# 牌録（はいろく）

フリー麻雀の収支管理PWAアプリ。

## 機能

- 対局情報の登録（店舗・日時・レート）
- 半荘ごとの着順・収支・チップ収支の記録
- 対局まとめ（半荘数・総収支・着順分布・平均着順）
- 履歴一覧・累計収支

## 技術スタック

- **フロント**: React + TypeScript + Vite + TailwindCSS + PWA
- **バックエンド**: Hono + TypeScript
- **DB**: PostgreSQL

## ローカル開発

```bash
# フロントエンド
cd client
npm install
npm run dev
# → http://localhost:5173

# バックエンド
cd server
npm install
npm run dev
# → http://localhost:3010
```
