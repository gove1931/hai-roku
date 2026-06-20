# 牌録（はいろく）

麻雀の収支を管理する PWA アプリ。半荘ごとの着順・収支・チップ収支を記録し、セッション別に集計できる。

## 機能

- セッション管理（日時・場所・メンバー）
- 半荘ごとの着順・収支・チップ収支入力
- セッション合計・累計収支の表示
- PWA 対応（ホーム画面に追加可能）
- オフライン対応（Service Worker）

## 本番環境

- **URL**: https://hai-roku.goveapp.com
- **サーバー**: ConoHa VPS (163.44.125.213)
- **PM2**: `hai-roku`

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | React 19 + Vite + Tailwind CSS v4 |
| バックエンド | Node.js + Express |
| PWA | vite-plugin-pwa + Workbox |
| インフラ | ConoHa VPS + Nginx + PM2 + Cloudflare Tunnel |

## ディレクトリ構成

```
hai-roku/
├── client/       # React + Vite フロントエンド
│   └── src/
│       ├── App.tsx
│       ├── api.ts        # バックエンド API クライアント
│       └── types.ts
└── server/       # Express バックエンド（port 3010）
```

## ローカル開発

```bash
# バックエンド
cd server
npm install
npm run dev   # localhost:3010 で起動

# フロントエンド（別ターミナル）
cd client
npm install
npm run dev   # localhost:5173 で起動（/api は localhost:3010 にプロキシ）
```

## ビルド

```bash
cd client
npm run build   # dist/ に出力
```

## デプロイ（VPS）

```powershell
git push vps main
```

push 後、`post-receive` フックがビルド & PM2 再起動を自動実行する。

**git remote**: `ssh://root@163.44.125.213:2222/var/repo/hai-roku.git`
