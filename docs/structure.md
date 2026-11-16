# サーバーのファイルの分け方

`server/src/` の中身。

- `index.ts` サーバーを起動する。
- `app.ts` auth、records、options のルートを繋ぐ。
- `auth/` ログインまわり
  - `routes.ts` リクエストを受けて返す。クッキーを入れたり消したりする。
  - `validation.ts` 入力チェックの決まり。
  - `middleware.ts` 処理の関所。クッキーを見て、ログインしていなければ 401 を返す。
  - `service.ts` 中身の手順。ログインなら、ユーザーを探す -> パスワードを確かめる -> セッションを作る。
  - `demo.ts` デモアカウントの手順。古いデモアカウントを消す -> 新しいものを作る -> サンプル記録を写す -> セッションを作る。
  - `users.ts` users テーブルとやり取りする。
  - `sessions.ts` sessions テーブルとやり取りする。
- `records/` 記録
  - `routes.ts` リクエストを受けて返す。
  - `validation.ts` 入力チェックの決まり。
  - `repository.ts` 記録のテーブルとのやりとり。
- `options/` 選択肢
  - `routes.ts` リクエストを受けて返す。
  - `repository.ts` 5種類の選択肢をテーブルから取り出す。
- `lib/` どこでも使う小さい道具
  - `password.ts` パスワードを元に戻せない形に変える。合っているか確かめる。
  - `session.ts` 受付番号(ランダムな文字列)を作る。
  - `validate.ts` 入力チェックで引っかかった時に、エラーの形をそろえて返す。
- `db/` データベース
  - `schema.ts` テーブルの設計図。
  - `index.ts` データベースと繋ぐ。
  - `seed.ts` 選択肢をテーブルに入れる(初回に一度だけ実行)。
  - `seed-data.ts` 選択肢の中身。
  - `demo-data.ts` デモアカウントに写すサンプル記録7つ。

`server/test/` の中身。

- `global-setup.ts` テストの前に1回だけ動く。テスト用のデータベースにテーブルを作って、選択肢を入れる。
- `helpers.ts` テストでよく使う道具。データベースを空にする、リクエストを送る、新しいユーザーでログインする。
- `validation.test.ts` 入力チェックのテスト。
- `records.test.ts` 記録のテスト(他の人の記録が見えないかなど)。
- `auth.test.ts` ログインのテスト(パスワードを変えたら前のログインが切れるかなど)。

テストの設定は `server/` の直下にある。

- `vitest.config.ts` テストの設定。
- `.env.test` テスト用のデータベースの場所。

## ルール

- 機能ごとにフォルダを分ける(auth/、records/ など)
- フォルダの中は、役割ごとにファイルを分ける(validation → routes → service → repository → db)。入力チェック(validation)は、routes の処理の前に通す
- routes → service → repository(テーブルとのやりとり)の順にだけ呼ぶ。逆向きには呼ばない。routes からデータベースを直接さわらない
- 手順があるときだけ service を作る。ないときは、routes から repository を直接呼んでよい(例: options/ は一覧を取り出して返すだけ、records/ は受けたものをそのままテーブルに渡すだけなので、service がない)

## なぜこうしたか

- 機能ごとにフォルダを分けた。最初は役割ごとのフォルダ(routes/、services/ など)にしていたが、一つのフォルダに一つの機能というふうに分けたほうがわかりやすいと感じたから。
- フォルダの中では役割ごとにファイルを分けた。一つのファイルに全部書くと、エラーになった時にどこを直せばいいかわからなくなるから。
