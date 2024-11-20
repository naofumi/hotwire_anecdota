---
title: Turbo FramesとTurbo Streamsの違い
layout: article
order: 005
published: true
---

## Turbo Frames, Turbo Streamsもメモ ---notes-about-turbo-frames-and-turbo-streams

画面の一部分だけを書き換える方法としてTurbo FramesとTurbo Streamsがあります。そして大きな違いは、Turbo Framesは画面の一箇所を書き換えるものであるのに対して、Turbo Streamsは複数箇所を書き換えられる点があります。

ただしここではTurbo FramesとTurbo Streamsの違いではなく、何が同じかを説明したいと思います。

### いつTurbo Framesになるのか？いつTurbo Streamsになるのか？

* Turbo Framesのリクエストを飛ばすには、リクエストの中で指定する必要があります。以下の方法があります
    * `<turbo-frame>`タグに囲まれた箇所に存在する`<a>`タグ、もしくは`<form>`タグからリクエストを送信する
    * `<a>`タグ、もしくは`<form>`タグに`data-turbo-frame`属性をつけて、対象の`<turbo-frame>`を指定する
    * JavaScriptで`Turbo.visit([url], {frame: [turbo-frame名]})`を呼び出す
* Turbo Frameリクエストのヘッダーには`turbo-frame: [turbo-frame名]`がつきます
    * これでTurbo Frameのリクエストだったかどうか、あるいはどの`<turbo-frame>`をターゲットしたリクエストかがわかります（我々が使うことはほとんどありませんが）
* 一方でTurbo Streamについては下記のようになります
    * POSTの時(`<form>`からGET以外で送信した時)はリクエストの`Accept`ヘッダーに`Accept: text/vnd.turbo-stream.html`が追加されます。これにより、サーバ側は`format.turbo_stream`で応答できるようになります（Railsの場合）
        * 上記の動作はTurboがインストールされ、`data-turbo-drive="false"`にしていない限り、すべての非GETの`<form>`送信で共通です。つまり、**ブラウザ側からTurbo Streamを指定する方法は存在しません**。
    * GETの時は、通常は`Accept: text/vnd.turbo-stream.html`は付与されません。これをつけるためには`data-turbo-stream`HTML属性を`<a>`タグや`<form>`タグにつける必要があります
    * Turbo Streamを使ってレスポンスする時、サーバは`Content-Type`ヘッダーに`Content-Type: text/vnd.turbo-stream.html;`をつけて、「Turbo Streamとしてデータを返しましたよ」とブラウザに伝えます。

上記を踏まえた上で、いつTurbo Framesになるのか、いつTurbo Streamsになるのかを整理します。

* **Turbo Framesはブラウザ側で指定します:**
* **Turbo Streamsはサーバ側で指定します:** ブラウザ側でTurbo Framesとしてリクエストされても、サーバからのレスポンスに`Accept: text/vnd.turbo-stream.html`があれば、こっちが優先され、Turbo Streamsとして処理されます

## 使い分けのヒント

上記のことから次のことが言えます

* サーバサイドバリデーションなど、異常系で複雑な処理をしたい場合はTurbo Streamsを使います
   * 例えば正常系はTurbo Framesのリクエスト・レスポンス処理をする一方で、異常系の時だけTurbo Streamsで応答するやり方もできます
* サーバからのレスポンスの処理方法がシンプルな場合はTurbo Framesでずっとやることもできます
   * 実際に問題になりやすいのはredirectです。Turbo Framesのリクエストに対してredirectをする際、Turbo Frame内のredirectをするのか、それともTurbo Frameを抜けてredirectするのかを指定するのが困難になります
