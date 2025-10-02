# 強化版 Bluesky 全肯定Bot

超高速で文脈に応じた肯定的な応答を提供する、深いユーザー理解機能を持つインテリジェントなBlueskyボットです。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

**[English README](./README.md)** | **[貢献ガイド](./CONTRIBUTING.md)**

---

## 目次

- [このプロジェクトについて](#このプロジェクトについて)
- [主要機能](#主要機能)
- [インストール](#インストール)
- [設定](#設定)
- [使用方法](#使用方法)
- [アーキテクチャ](#アーキテクチャ)
- [トラブルシューティング](#トラブルシューティング)
- [貢献](#貢献)
- [ライセンス](#ライセンス)

---

## このプロジェクトについて

本プロジェクトは、[suibariのbsky-affirmative-bot](https://github.com/suibari/bsky-affirmative-bot)の強化フォーク版です。主な改善点：

- 日本語サポートを維持した**英語優先設計**
- キャッシュされた返信の**超高速応答時間**（50ミリ秒未満）
- 性格分析を含む**深いユーザープロファイリング**
- Claude、GPT-4、その他200以上のAIモデルへアクセスする**OpenRouter統合**
- 分散型ホスティング用の**カスタムAT Protocol PDS対応**
- **インテリジェントキャッシング**と継続的学習システム

このボットは、Blueskyでユーザーをフォローバックし、対話を通じてユーザーの性格や好みを学習し、ユーザーの気分や状況に合わせてパーソナライズされた励ましのメッセージで応答します。

---

## 主要機能

### パフォーマンスと速度
- 3層キャッシングシステムによる**50ミリ秒未満の応答時間**
- 即座の応答のための**完全一致キャッシュ**（5ミリ秒未満）
- 一般的なパターン用の**テンプレート応答**（20ミリ秒未満）
- パーソナライズされた**AI生成の文脈応答**（50ミリ秒未満）
- より高速な処理のためのAIオーバーヘッドなしの**スマート感情分析**

### ユーザー理解
- ビッグファイブ性格特性に基づく**自動性格プロファイリング**
- 趣味、目標、人間関係を含む**個人的な文脈の保存**
- 感情的傾向を理解するための経時的な**気分パターン追跡**
- 見知らぬ人（0）から親しい友人（3）へと進化する**関係レベル**
- ユーザーごとにカスタマイズされた**対話スタイルの適応**

### AI統合
- Claude 3.5 Sonnet、GPT-4、その他200以上のモデルへアクセスできる**OpenRouterサポート**
- エンベディングとフォールバック生成用の**Google Gemini統合**
- タスクの複雑さに基づいて適切なモデルを選択する**インテリジェントサービスルーティング**
- 自動モデル選択による**コスト最適化**
- 継続的な動作を保証する**グレースフルフォールバックチェーン**

### ネットワークの柔軟性
- 任意のAT Protocolサーバー用の**カスタムAT Protocol PDS**接続
- ユーザーハンドルからの**自動PDS検出**
- 分散ネットワークサポート用の**マルチPDS互換性**
- 接続問題を処理する**堅牢なフォールバックシステム**

### 対話モード
- 日次リーディングとバイオリズム分析を含む**占いモード**
- メモリ付きの拡張チャットセッション用の**会話モード**
- 性格と気分分析を提供する**分析モード**
- 好みに基づいた音楽推薦を提供する**DJモード**
- 自動日次サマリーを生成する**日記モード**
- リポストを通じてユーザーコンテンツを増幅する**応援モード**

---

## インストール

### 前提条件

インストール前に、以下を確認してください：

- **Node.js 18以上** - JavaScriptランタイム環境（[ダウンロード](https://nodejs.org/)）
- **npm** - パッケージマネージャー（Node.jsに含まれています）
- **Blueskyアカウント** - ボット操作用のソーシャルメディアアカウント
- **アプリパスワード** - ボットアクセス用の専用パスワード（[作成](https://bsky.app/settings/app-passwords)）
- **Google Gemini APIキー** - AI生成とエンベディング用（[取得](https://makersuite.google.com/app/apikey)）
- **OpenRouter APIキー**（オプション） - 強化されたAIモデルアクセス用（[サインアップ](https://openrouter.ai/)）

### 自動インストール

自動セットアップスクリプトは、依存関係のインストール、設定ファイルの作成、環境セットアップを処理します：

```bash
# リポジトリをローカルマシンにクローン
git clone https://github.com/YOUR_USERNAME/bsky-affirmative-bot.git

# プロジェクトディレクトリに移動
cd bsky-affirmative-bot

# セットアップスクリプトを実行可能にする（Unix/Linux/macOS）
chmod +x setup.sh

# 自動セットアップスクリプトを実行
./setup.sh
```

**セットアップスクリプトが行うこと：**
1. Node.jsとnpmのインストールを確認
2. 必要なすべてのnpm依存関係をインストール
3. テンプレートから設定ファイル（.env）を作成
4. 必要なスキーマでSQLiteデータベースを初期化
5. TypeScriptソースコードをJavaScriptにビルド
6. 便利なスクリプト（start.sh、dev.sh、test.sh）を作成
7. 設定を検証し、問題を報告

### 手動インストール

インストールプロセスを手動で制御する場合：

```bash
# package.jsonからすべてのプロジェクト依存関係をインストール
npm install

# テンプレートから環境設定ファイルを作成
cp .env.example .env

# 認証情報を使用して設定ファイルを編集
nano .env  # または好みのテキストエディタを使用

# データベーススキーマとテーブルを初期化
node -e "require('./src/db').default"

# TypeScriptソースコードをJavaScriptにコンパイル
npm run build

# 本番モードでボットを起動
npm start
```

**手動インストール手順の説明：**
- `npm install` - package.jsonにリストされているすべての依存関係をダウンロードしてインストール
- `cp .env.example .env` - テンプレートから設定ファイルを作成
- `nano .env` - テキストエディタを開いてAPIキーと認証情報を追加
- `node -e "require('./src/db').default"` - データベース初期化スクリプトを実行
- `npm run build` - TypeScript（.ts）ファイルをdist/フォルダ内のJavaScript（.js）にコンパイル
- `npm start` - コンパイルされたJavaScriptファイルを使用してボットを起動

---

## 設定

### 必須設定

`.env`ファイルに以下の必須設定値を編集します：

```bash
# Blueskyアカウント認証情報
BSKY_IDENTIFIER="your-handle.bsky.social"
# Blueskyのユーザーネームまたはハンドル
# 例：mybot.bsky.social

BSKY_PASSWORD="your-app-password"
# Bluesky設定からのアプリパスワード（メインパスワードではありません）
# 生成先：https://bsky.app/settings/app-passwords

# Google Gemini API設定
GEMINI_API_KEY="your-gemini-api-key"
# Google Gemini AIサービスのAPIキー
# テキスト生成とエンベディングに使用
# 無料層：1分あたり60リクエスト
```

### オプション設定

以下のオプション設定値で機能を強化します：

```bash
# OpenRouter統合（推奨）
OPENROUTER_API_KEY="your-openrouter-key"
# OpenRouterサービスのAPIキー
# Claude、GPT-4、その他200以上のモデルへのアクセスを提供
# 取得先：https://openrouter.ai/keys

OPENROUTER_MODEL="anthropic/claude-3.5-sonnet"
# 一般的な応答用のデフォルトAIモデル
# オプション：anthropic/claude-3.5-sonnet、openai/gpt-4-turboなど

AI_SERVICE_PREFERENCE="openrouter"
# プライマリAIサービスの選択
# オプション："openrouter"または"gemini"
# 最初に試行されるサービスを決定

# カスタムAT Protocol PDS
CUSTOM_PDS_URL="https://your-pds.example.com"
# カスタムパーソナルデータサーバーのURL
# デフォルトのBluesky PDSを使用する場合は空のままにする
# 代替AT Protocolサーバーでのホスティングを有効化

# ボット動作設定
BOT_DID="did:plc:your-bot-did"
# ボットの分散識別子
# 確認先：https://plc.directory/your-handle.bsky.social

DEVELOPMENT_MODE="false"
# 開発機能と詳細ログを有効化
# テストの場合は"true"、本番の場合は"false"に設定

# パフォーマンスチューニング
CACHE_TTL="3600"
# キャッシュの生存時間（秒）
# 再生成前に応答がキャッシュされる期間を制御

MAX_RESPONSE_LENGTH="280"
# ボット返信の最大文字長
# Blueskyの制限内に応答を保持
```

### APIキーの取得

#### Blueskyアプリパスワード
1. [Blueskyアプリパスワード設定](https://bsky.app/settings/app-passwords)に移動
2. 「アプリパスワードを追加」ボタンをクリック
3. 説明的な名前を入力（例：「全肯定Bot」）
4. 生成されたパスワードをすぐにコピー（再度表示できません）
5. `.env`ファイルに`BSKY_PASSWORD`として貼り付け

#### Google Gemini APIキー
1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
2. 「APIキーを作成」ボタンをクリック
3. 「新しいプロジェクトでAPIキーを作成」を選択するか、既存のプロジェクトを選択
4. 生成されたAPIキーをコピー
5. `.env`ファイルに`GEMINI_API_KEY`として貼り付け
6. 注：無料層は1分あたり60リクエストを許可

#### OpenRouter APIキー（オプション）
1. [OpenRouter](https://openrouter.ai/)でアカウントを作成
2. [APIキーページ](https://openrouter.ai/keys)に移動
3. 「キーを作成」ボタンをクリック
4. 生成されたAPIキーをコピー
5. 初期クレジットを追加（テスト用に最低5ドル推奨）
6. `.env`ファイルに`OPENROUTER_API_KEY`として貼り付け

---

## 使用方法

### ボットの起動

```bash
# 最適化されたパフォーマンスの本番モード
./start.sh

# ファイル変更時に自動再起動する開発モード
./dev.sh

# すべてのサービスをテストし、設定を検証
./test-services.sh
```

**コマンドの説明：**
- `./start.sh` - コンパイルされたJavaScriptを使用して本番モードでボットを起動
- `./dev.sh` - ソースファイルが変更されたときに自動的に再起動してボットを開始（開発に便利）
- `./test-services.sh` - ボットを起動せずにAPI接続と設定を検証

### ボット機能のテスト

1. テストアカウントからBlueskyで**ボットをフォロー**
2. **フォローバックを待つ**（通常1〜2分以内に発生）
3. テストアカウントから**メッセージを投稿**
4. ボットからの**応答を観察**

**さまざまなモードをテスト：**
- `fortune`と投稿して毎日の運勢を受け取る
- `analyze me`と投稿して性格分析を受ける
- `conversation`と投稿して拡張チャットセッションを開始
- `DJ`と投稿してパーソナライズされた音楽推薦を受ける

### ボット操作の監視

```bash
# リアルタイムログ出力を表示
tail -f logs/bot.log

# フォロワーの総数を確認
sqlite3 data/bot.db "SELECT COUNT(*) FROM followers;"

# 応答パフォーマンスを監視
grep "Response time" logs/bot.log

# 最近のエラーを表示
grep "ERROR" logs/bot.log | tail -20
```

**監視の説明：**
- `tail -f logs/bot.log` - 書き込まれた最新のログエントリをリアルタイムで表示
- `sqlite3`コマンド - 統計とユーザーデータについてSQLiteデータベースをクエリ
- `grep`コマンド - 特定のパターンやエラーメッセージについてログファイルをフィルタ

### ボットの停止

```bash
# 実行中のボットプロセスを見つける
ps aux | grep "node.*index"

# プロセスIDを使用して正常に停止
kill <PID>

# 正常なシャットダウンが失敗した場合は強制停止
pkill -f "node.*index"
```

**シャットダウンの説明：**
- `ps aux | grep` - すべてのプロセスをリストし、ボットプロセスをフィルタ
- `kill <PID>` - 正常なシャットダウンを許可する終了信号を送信
- `pkill -f` - 正常なシャットダウンが失敗した場合、プロセスを強制終了

---

## アーキテクチャ

### プロジェクト構造

```
bsky-affirmative-bot/
├── src/                      # ソースコードディレクトリ
│   ├── index.ts              # メインアプリケーションエントリポイント
│   ├── config/               # 設定管理
│   │   └── index.ts          # ボット設定とシステムプロンプト
│   ├── bsky/                 # Bluesky/AT Protocol統合
│   │   ├── agent.ts          # カスタムPDSサポート付きAT Protocolエージェント
│   │   ├── jetstream.ts      # リアルタイムイベントストリームリスニング
│   │   └── post.ts           # 投稿作成と返信機能
│   ├── ai/                   # AIサービス管理層
│   │   └── serviceManager.ts # OpenRouterとGemini間のリクエストルーティング
│   ├── openrouter/           # OpenRouter APIクライアント
│   │   └── client.ts         # 200以上のAIモデル用ラッパー
│   ├── gemini/               # Google Gemini統合
│   │   └── index.ts          # テキスト生成とエンベディング
│   ├── util/                 # コアユーティリティモジュール
│   │   ├── userProfiling.ts  # ユーザー性格分析と保存
│   │   └── responseOptimizer.ts # 多層応答キャッシングシステム
│   ├── db/                   # データベース管理
│   │   └── index.ts          # SQLiteスキーマと操作
│   ├── modes/                # ボット対話モード
│   │   ├── fortune.ts        # 占い機能
│   │   ├── conversation.ts   # 拡張会話処理
│   │   └── analyze.ts        # 性格分析
│   └── json/                 # 応答テンプレートコレクション
│       ├── affirmativeword_enhanced_positive_en.json
│       ├── affirmativeword_enhanced_normal_en.json
│       └── affirmativeword_enhanced_supportive_en.json
├── setup.sh                  # 自動インストールスクリプト
├── start.sh                  # 本番起動スクリプト
├── dev.sh                    # 開発起動スクリプト
└── test-services.sh          # サービス検証スクリプト
```

### システムワークフロー

1. **イベント監視** - Jetstreamがフォロワーからの新しい投稿についてBlueskyファイアホースを購読
2. **ユーザー分析** - 各対話がデータベース内のユーザー性格プロファイルを更新
3. **感情検出** - 高速なローカル感情分析が適切な応答タイプを決定
4. **応答生成** - 3層システムが応答方法を選択：
   - 完全一致のためにキャッシュを確認（5ミリ秒未満）
   - テンプレートマッチングを試行（20ミリ秒未満）
   - パーソナライゼーション付きAI応答を生成（50ミリ秒未満）
5. **継続的学習** - バックグラウンドプロセスがユーザープロファイルとキャッシング戦略を更新

### AIサービスルーティング

```
ユーザー投稿 → 感情分析 → 応答選択
                                ↓
                ┌───────────────┴────────────────┐
                ↓                                ↓
    OpenRouter（プライマリ）           Gemini（フォールバック）
                ↓                                ↓
        Claude 3.5 Sonnet              Gemini 1.5 Pro
        GPT-4 Turbo                    テキスト生成
        200以上の他のモデル              エンベディング
                ↓                                ↓
                └───────────────┬────────────────┘
                                ↓
                    パーソナライズされた応答
                                ↓
                          Blueskyに投稿
```

---

## トラブルシューティング

### ボットが起動しない

**問題：** `./start.sh`の実行時にエラーが発生

**解決策：**

```bash
# Node.jsバージョンが要件を満たしていることを確認（18以上）
node --version

# 破損を解決するために依存関係を削除して再インストール
rm -rf node_modules package-lock.json
npm install

# 環境ファイルに必要な変数が含まれていることを確認
cat .env

# サービス検証を実行して設定の問題を特定
./test-services.sh
```

### ボットが投稿に応答しない

**問題：** ボットはフォローバックするがユーザー投稿に返信しない

**診断手順：**

1. エラーについて**ログファイルを確認**：`tail -f logs/bot.log`
2. API認証情報が有効であることを**確認**：`./test-services.sh`
3. ユーザーの返信頻度が0%に設定されていないことを**確認**
4. 相互フォロー関係が存在することを**確認**（ボットはフォロワーにのみ返信）
5. AIサービスの**レート制限が超過**していないことを確認

### 応答が遅い

**問題：** ボットの返信に1秒以上かかる

**解決策：**

```bash
# より高速なモデルアクセスのためにOpenRouterを有効化
echo 'AI_SERVICE_PREFERENCE="openrouter"' >> .env

# 応答キャッシュをクリアして再ビルド
rm -rf data/cache/*
npm run build

# APIレート制限のステータスを確認
# Gemini無料層：1分あたり60リクエスト
# OpenRouter：モデルとクレジットによって異なる
```

**パフォーマンス最適化手順：**
- OpenRouterは通常、Geminiよりも高速な応答を提供
- キャッシュヒットは50ミリ秒未満の応答を提供
- APIエンドポイントへのネットワーク接続を確認
- それぞれのダッシュボードでAPIクォータ使用状況を監視

### データベースエラー

**問題：** SQLiteエラーまたは破損したデータベース

**解決策：**

```bash
# 変更前に現在のデータベースのバックアップを作成
cp data/bot.db data/bot.db.backup

# データベースを再初期化（警告：すべてのデータを削除）
rm data/bot.db
node -e "require('./src/db').default"

# 再初期化が問題を引き起こした場合、バックアップから復元
cp data/bot.db.backup data/bot.db
```

**データベーストラブルシューティングのメモ：**
- データベースの破損はまれですが、不適切なシャットダウンから発生する可能性があります
- 本番デプロイメントには定期的なバックアップが推奨されます
- データベースの再初期化では、ユーザーデータやフォロワー関係は保持されません
- データベース操作前にディスク空き容量を確認してください

### APIレート制限エラー

**問題：** 「レート制限超過」または「429 Too Many Requests」エラー

**サービス固有の解決策：**

**Google Gemini：**
- 無料層の制限：1分あたり60リクエスト
- 解決策：追加容量のためにOpenRouterを有効化
- 代替案：制限内に収まるようにリクエストキューイングを実装

**OpenRouter：**
- 制限はアカウントクレジットと選択したモデルに依存
- 解決策：[openrouter.ai/credits](https://openrouter.ai/credits)でさらにクレジットを追加
- 代替案：より高速で安価なモデルに切り替え

### カスタムPDS接続の問題

**問題：** カスタムAT Protocol PDSに接続できない

**診断と解決策：**

```bash
# PDSヘルスエンドポイントの可用性をテスト
curl https://your-pds.example.com/xrpc/_health

# PDS URLフォーマットにプロトコルが含まれていることを確認
echo $CUSTOM_PDS_URL  # https://で始まる必要があります

# 代わりに自動PDS検出を試みる
# CUSTOM_PDS_URLを.envから削除して自動検出を有効化
```

**PDS接続のメモ：**
- カスタムPDSはAT Protocol仕様をサポートする必要があります
- CUSTOM_PDS_URLが設定されていない場合、ボットは自動検出を試みます
- 接続失敗時にデフォルトのBluesky PDSへのフォールバックが発生
- ファイアウォールルールがアウトバウンドHTTPS接続を許可していることを確認

---

## 貢献

貢献を歓迎します！以下については[CONTRIBUTING.md](./CONTRIBUTING.md)をご覧ください：

- コード構造と組織化のガイドライン
- 新機能を追加するための指示
- テスト手順と要件
- プルリクエスト送信プロセス

**クイック貢献チェックリスト：**
- GitHubでリポジトリをフォーク
- mainからフィーチャーブランチを作成
- 明確で説明的なコミットメッセージを書く
- 送信前に変更を徹底的にテスト
- 関連するドキュメントを更新
- 詳細な説明付きでプルリクエストを送信

---

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。完全な条項については[LICENSE](LICENSE)ファイルをご覧ください。

---

## クレジット

### 元のプロジェクト
[suibari/bsky-affirmative-bot](https://github.com/suibari/bsky-affirmative-bot)の強化フォーク
- 元の作者：[suibari](https://github.com/suibari)
- 元のBot：[@suibari-bot.bsky.social](https://bsky.app/profile/suibari-bot.bsky.social)

### 強化への貢献
- 英語優先の言語変換
- ユーザープロファイリングと性格分析システム
- マルチモデルAIアクセスのためのOpenRouter統合
- カスタムAT Protocol PDSサポート
- パフォーマンス最適化とキャッシング層
- 包括的な英語ドキュメント

### 技術スタック
- [AT Protocol](https://atproto.com/) - 分散型ソーシャルネットワーキングプロトコル
- [Bluesky](https://bsky.app/) - ソーシャルメディアプラットフォーム
- [OpenRouter](https://openrouter.ai/) - 統合AIAPIゲートウェイ
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI生成とエンベディング
- [Node.js](https://nodejs.org/) - JavaScript実行環境
- [TypeScript](https://www.typescriptlang.org/) - 型安全なJavaScript

---

## サポート

- 問題とバグレポート：[GitHub Issues](https://github.com/YOUR_USERNAME/bsky-affirmative-bot/issues)
- 機能ディスカッション：[GitHub Discussions](https://github.com/YOUR_USERNAME/bsky-affirmative-bot/discussions)
- Blueskyの元のBot：[@suibari-bot.bsky.social](https://bsky.app/profile/suibari-bot.bsky.social)

[全肯定botたん](https://bsky.app/profile/suibari-bot.bsky.social) は、フォロワーを全肯定するリプライを送るBluesky botです。
感情分析および生成AIを活用し、フォロワーを励ますことを目的とします。

Please refer [English README](./README_en.md) for not Japanese speakers.

---

## 概要

このリポジトリには、全肯定botたんのコードと設定ファイルが含まれています。
本botは以下の機能を持ちます。

1. **AI生成リプライ**: 生成AI (Google Gemini) を使用し、フォロワーの投稿内容（文章、画像）に応じてリプライします
2. **定型文リプライ**: 日本語極性辞書を使用し、フォロワーの投稿内容（文章）に感情分析を行い、結果に従って定型文リストからリプライします
3. **占い機能**: ユーザの応答で、占いを行います
4. **リプ頻度調整**: ユーザの応答で、botがリプライする頻度の調整が0~100%で行えます
5. **会話機能**: ユーザの応答で、botと連続した会話を行えます
6. **分析機能**: ユーザの応答で、ユーザの性格分析を行えます
7. **応援機能**: ユーザの応答で、宣伝を行えます
8. **DJ機能**: ユーザの応答で、botがあなたのために選曲
9. **日記機能**: ユーザの応答で、botが日記をつけてくれます

また、本botは運営維持費をまかなうために有志によるサブスク制を導入しています。

以下に通常フォロワー、サブスクフォロワーの使用できる機能をまとめます。サブスクの詳細は[Pixiv Fanbox](https://suibari.fanbox.cc/posts/10174305)をご覧ください。

| サブスク可否       | 定型文リプライ | AI生成リプライ | 占い | リプ頻度調整 | 会話機能 | 分析機能 | 応援機能 | DJ機能 | 日記機能 | 
| ------------------ | -------------- | -------------- | ---- | ------------ | -------- | -------- | -------- | ------ | -------- | 
| 通常フォロワー     | ✓             |                | ✓   | ✓           |          | ✓       |          |        |          | 
| サブスクフォロワー |                | ✓             | ✓   | ✓           | ✓       | ✓       | ✓       | ✓     | ✓       | 

---

## 使用方法
1. Blueskyで本botをフォローしてください
2. 一定時間後、本botがフォローバックし、以降、あなたのポストに反応するようになります

本botのフォロー解除、またはユーザブロックにより、以降、本botはリプライしなくなります。

botフォロー後に、botがあなたのポストにどう反応するかの処理フローは以下です。

![bot処理フロー](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:uixgxpiqf4i63p6rgpu7ytmx/bafkreihxgiteyk25cpv3e7lkdsggntpb3jj6ybha4btq5ykf2fzdyq7j6u@jpeg)

### 占い機能
以下の手順を実施することで、本botが占い結果をリプライします。
占いは1度行うと数時間行えません。

1. 本botに対しメンションまたはリプライで **"占い"** とポストする
2. 本botがあなたに占い結果をリプライします

### リプライ頻度調整
以下の手順を実施することで、そのフォロワーに対してのリプライ頻度を変更します。

1. "使用方法"に従い、本botからフォローされた状態となる
2. 本botに対しメンションまたはリプライで **"freqN"(Nは0~100の整数)** とポストする
3. 本botがあなたに設定完了をリプライします

### 会話機能
以下の手順を実施することで、そのフォロワーに対して会話を開始します。

1. "使用方法"に従い、本botからフォローされた状態となる
2. 自分がスレッド主であるスレッドで、botにリプライする
3. 本botがあなたにいいねします
4. 本botがあなたにリプライします
5. 4のリプライに対してあなたがリプライした場合、会話が継続します。3に戻ります

会話機能を説明した画像を以下に掲載します。

![会話機能説明画像](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:qcwhrvzx6wmi5hz775uyi6fh/bafkreib5x75mtoy7md2eegafwgl6ug4vr23bwy7wyorqrmlwxbyhppzim4@jpeg)

### 分析機能
以下の手順を実施することで、本botが性格分析結果をリプライします。
分析機能は1度行うと数日間行えません。

1. 本botに対しメンションまたはリプライで **"分析して"** とポストする
2. 本botがあなたに分析結果を画像付きリプライします

### 応援機能
以下の手順を実施することで、本botがあなたのポストをリポストして応援します。
応援機能は1度行うと数時間行えません。

1. "使用方法"に従い、本botからフォローされた状態となる
2. **"#全肯定応援団"** とハッシュタグをつけて、応援してほしい内容・画像をポストする（botへのリプライ不要）
3. 本botが2をリポストし、フォロワー全体向けに宣伝ポストします

### DJ機能
以下の手順を実施することで、本botがあなたの気分にあった曲を選曲します。
DJ機能は1度行うと数分行えません。

1. 本botに対しメンションまたはリプライで **"DJお願い"** とポストする
2. 本botがあなたに曲を紹介します

### 日記機能
以下の手順を実施することで、本botがあなたの1日のポストから日記をつけます。
設定後、毎晩1度リプライしてくれます。

1. "使用方法"に従い、本botからフォローされた状態となる
2. 本botに対しメンションまたはリプライで **"日記つけて"** とポストする
3. 本botが毎晩あなたに日記を送ります
4. 本bot対しメンションまたはリプライで **"日記やめて"** とポストすることで、日記機能を解除できます

---

## プライバシーポリシー

### 情報の収集

本botは、次の情報を収集し処理します：

- **フォロワーの投稿内容**: 投稿内容はリプライを生成する目的でのみ利用され、保存や二次利用はいっさい行いません
- **ユーザーメタデータ**: ユーザー名やプロフィール情報など、応答を個別化するための最低限のデータにアクセスしますが、これらのデータはいっさい保存されません

### 情報の利用目的

本botが収集した情報は、リプライ生成以外の目的では、第三者と共有されません。**ただしAI生成リプライ時には、Google Gemini API利用のため、Google LLCとのデータ通信を行います。**

### 年齢制限
本botのAIを用いた機能はGoogle Gemini APIの利用規約に準拠しており、18歳以上のユーザのみを対象としています。

**18歳未満の方は、AIを用いた機能の利用をお控えください。**

定型文リプライはAIを使わない機能なので、ご利用いただけます。

### 地域制限
本botのAIを用いた機能はGoogle Gemini APIの利用規約に準拠しており、次の地域ではご利用いただけません：

- イギリス（UK）
- スイス（Switzerland）
- 欧州連合加盟国（EU Member States）

**これらの地域にお住まいの方は、AIを用いた機能の利用をお控えください。**

定型文リプライはAIを使わない機能なので、ご利用いただけます。

### プライバシーポリシーの変更
プライバシーポリシーは適宜更新されることがあります。重大な変更があった場合は、本リポジトリにて通知します。

### 問い合わせ
本ボットまたはプライバシーポリシーに関するお問い合わせは、次の連絡先までお願いします：
[すいばり (suibari.com)](https://bsky.app/profile/suibari-com)

---

## ライセンス
このプロジェクトはOSSであり、MITライセンスの下で提供されています。詳細は [LICENSE](./LICENSE) ファイルをご覧ください。

### 引用文献
本botは日本語感情分析に東北大学 乾・岡崎研究室の [日本語評価極性辞書](https://www.cl.ecei.tohoku.ac.jp/Open_Resources-Japanese_Sentiment_Polarity_Dictionary.html) を使用しています。
本botは英語感情分析に東京工業大学 奥村・高村研究室の [単語感情極性対応表](http://www.lr.pi.titech.ac.jp/~takamura/pndic_en.html) を使用しています。

---

## 免責事項
本botは、すいばり自身の技術スキルアップおよびAT-Protocolの理解のために、個人で開発・運用・管理されています。
そのため、企業が実施しているような手厚いサポートやアップデートは実施が難しいです。

本botは正常な稼働に向けて可能な限りの改善・改修の努力をしますが、前提として自己責任でのご利用をお願いいたします。
また本botを利用したことによる過失や損害につきまして、開発者は一切の責任を負いません。ご了承ください。

---
