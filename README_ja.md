## 🌟 Bluesky 全肯定 Bot（英語優先フォーク版）

英語優先に再構成した高速ポジティブ返信Bot。フォロー→フォローバック→投稿を検知→キャッシュ/テンプレ/AI で肯定的な短い返信を返します。追加トリガーで「占い / 分析 / 会話 / 日記 / DJ / 応援 (リポスト)」などを利用できます。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) [![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

**English README → [README.md](./README.md)** / **貢献ガイド → [CONTRIBUTING.md](./CONTRIBUTING.md)**

---

## 1. 目的（超要約）
フォローしてくれたユーザーの投稿に対し、感情/簡易プロファイルを見て肯定・励まし系リアクションを超低遅延で返します。必要に応じて AI（OpenRouter / Gemini）で生成。

---

## 2. 主な機能
| 項目 | 内容 |
|------|------|
| 速度 | 多段キャッシュ (<5ms 完全一致 / <20ms テンプレ / <50ms AI) |
| AI | OpenRouter (Claude / GPT-4 等) + Gemini フォールバック |
| 個別化 | 軽量プロファイル（簡易感情・嗜好） |
| モード | fortune / analyze / conversation / diary / DJ / cheer |
| デプロイ | 既定 Bluesky PDS かカスタム PDS |
| プライバシ | SQLite ローカル保存 / アンフォロー or ブロックで停止 |

---

## 3. クイックセットアップ（約90秒）
```bash
git clone https://github.com/j4ckxyz/frost-bot
cd frost-bot
cp .env.example .env   # なければ手動作成
npm install
nano .env              # 必須キー入力
npm run build
npm start              # もしくは ./start.sh
```
Bluesky アプリパスワード作成: https://bsky.app/settings/app-passwords

ログ監視: `tail -f logs/bot.log`（存在する場合） → 別アカでフォロー & 投稿テスト。

---

## 4. 最低限必要な環境変数
```
BSKY_IDENTIFIER=your-handle.bsky.social
BSKY_APP_PASSWORD=アプリパスワード
BSKY_DID=did:plc:xxxxxxxxxxxxxxxxxxxx   # 任意（無指定でも動作するケースあり）

GEMINI_API_KEY=xxxxx
OPENROUTER_API_KEY=xxxxx        # 推奨
AI_SERVICE_PREFERENCE=openrouter # openrouter | gemini | mixed

OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
CUSTOM_PDS_URL=https://your-pds.example.com  # 任意
NODE_ENV=production
```
無料で最小構成の場合: `GEMINI_API_KEY` + `AI_SERVICE_PREFERENCE=gemini` のみ。

---

## 5. 利用できるトリガー例
| 入力（投稿 / リプライ内） | 動作 |
|--------------------------|------|
| fortune                  | 簡易占い / バイオリズム風返信 |
| analyze me / 分析して      | 性格/傾向スナップショット |
| conversation             | 会話モード開始 |
| DJ / DJお願い             | 気分ベース選曲 |
| 日記つけて / 日記やめて    | 日次サマリ ON/OFF |
| freqN (freq0..freq100)   | リプライ頻度変更 |
| #全肯定応援団            | 応援リポスト |

通常投稿: 感情と関係スコアに応じ肯定 or 支援メッセージ。

---

## 6. よく使うコマンド
| 目的 | コマンド |
|------|----------|
| 依存インストール | `npm install` |
| ビルド | `npm run build` |
| 本番起動 | `npm start` または `./start.sh` |
| 開発ウォッチ | `./dev.sh` |
| サービス動作検証 | `./test-services.sh` |
| ログ監視 | `tail -f logs/bot.log` |

---

## 7. トラブルシュート（最短表）
| 症状 | 対処 |
|------|------|
| 返信が来ない | フォローバック済? ENV 再確認 / ログ確認 |
| 遅い (>1s) | OpenRouter 利用 / キャッシュ削除頻度を減らす |
| 429 / レート超過 | 呼び出し間隔を空ける / mixed で負荷分散 |
| DB エラー | `data/bot.db` 削除（履歴消去）後再起動 |
| 起動クラッシュ | Node>=18 / ENV 名綴り / `npm install` 再実行 |

---

## 8. データ & プライバシ（要約）
最小限のインタラクション & 簡易プロファイルのみをローカル SQLite に格納。AI API 呼び出し以外で外部送信なし。アンフォロー/ブロックで停止。DB を消せば履歴削除。

---

## 9. 貢献
PR 歓迎。詳細は `CONTRIBUTING.md` を参照。

---

## 10. ライセンス & クレジット
MIT ライセンス（`LICENSE`）。
原著: [suibari](https://github.com/suibari) / オリジナル日本語版 Bot。
本フォーク: 英語優先の簡素化 + マルチモデル AI + キャッシュ改善。

---

## 11. 追加オプション環境変数（必要な場合のみ）
```
OPENROUTER_FAST_MODEL=anthropic/claude-3-haiku
OPENROUTER_CREATIVE_MODEL=openai/gpt-4o
OPENROUTER_FALLBACK_TO_GEMINI=true
USE_OPENROUTER_FOR_CONVERSATION=true
USE_OPENROUTER_FOR_GENERATION=true
CUSTOM_PDS_URL=...
NEGAPOSI_URL=...        # 外部感情辞書サービス
SQLITE_DB_FILE=./data/bot.db
YOUTUBE_API_KEY=...
SPREADSHEET_ID=...
URL_JETSTREAM=wss://...
NODE_PORT=3000
NGROK_FOWARDING_URL=...
```
通常利用は「セクション4」の最小セットで十分。

---

良い開発を！
