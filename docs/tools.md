# 道具選び

- 言語: TypeScript
- データベース: PostgreSQL
- サーバーの土台: Hono
- データベースを使う道具: Drizzle
- 画面の土台: React + Vite
- テスト: Vitest
- パスワードの変換: Argon2
- 入力チェック: Zod
- 開発の道具を揃える: Nix
- 開発用のデータベース: Docker
- TypeScript を動かす: tsx
- 公開する場所: VPS 1台(仮)

## なぜこうしたか

### データベース: PostgreSQL

- データのつながりや決まりを、データベースが守ってくれるので、PostgreSQL にした。

### サーバーの土台: Hono

- TypeScript と相性が良い Hono にした。例えば、Zod で決めた型が、受け取ったデータに自動で付く。

### データベースを使う道具: Drizzle

- 書き方が SQL に近いので、使いながら SQL を覚えられる
- 知識グラフの計算のような少し複雑な取り出し方を書きやすい
- テーブルの形も TypeScript で書ける。
