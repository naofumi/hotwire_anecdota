---
title: サーバから見たTurbo FramesとTurbo Streamsの違い
layout: article
order: 20
published: true
---

## Turbo Frames, Turbo Streamsについて ---notes-about-turbo-frames-and-turbo-streams

画面の一部分だけを書き換える方法としてTurbo FramesとTurbo Streamsがあります。

よく知られた違いはTurbo Framesが画面の一箇所のみを変更するのに対して、Turbo Streamsが複数箇所を変更できる点です。

しかし、他にも大きな違いがあります。以下はサーバの視点からの違いに着目します

### Turbo Framesはブラウザで指定、Turbo Streamsはサーバで指定

* Turbo Frames
  * Turbo Framesのリクエストを飛ばすには、リクエストの中で指定する必要があります。以下の方法があります
      * `<turbo-frame>`タグに囲まれた箇所に存在する`<a>`タグ、もしくは`<form>`タグからリクエストを送信する
      * `<a>`タグ、もしくは`<form>`タグに`data-turbo-frame`属性をつけて、対象の`<turbo-frame>`を指定する
      * JavaScriptで`Turbo.visit([url], {frame: [turbo-frame名]})`を呼び出す
  * Turbo Frameはリクエスト送信時に、ヘッダーに`turbo-frame: [turbo-frame名]`がつきます
      * これでTurbo Frameのリクエストだったかどうか、あるいはどの`<turbo-frame>`をターゲットしたリクエストかどうかがサーバ側で分かります（あまり使うことがないのですが）
* Turbo Stream
    * POSTの時(`<form>`からGET以外で送信した時)はリクエストの`Accept`ヘッダーに`Accept: text/vnd.turbo-stream.html`が追加されます。これにより、サーバ側は`format.turbo_stream`で応答できるようになります（Railsの場合）
        * 上記の動作はTurboがインストールされ、`data-turbo-drive="false"`にしていない限り、すべての非GETの`<form>`送信で共通です。つまり、POST系の`<form>`については**ブラウザ側からTurbo Stream以外を指定する方法は存在しません**。
    * GETの時は、通常は`Accept: text/vnd.turbo-stream.html`は付与されません。これをつけるためには`<a>`タグや`<form>`タグに`data-turbo-stream`HTML属性をつける必要があります
    * Turbo Streamを使ってレスポンスする時、サーバは`Content-Type`ヘッダーに`Content-Type: text/vnd.turbo-stream.html;`をつけて、「Turbo Streamとしてデータを返しましたよ」とブラウザに伝えます。これをつけなければ「Turbo Stream以外である」とブラウザに伝わります。つまり**Turbo Streamを返すかどうかはサーバが決めます**。

上記を踏まえた上で、いつTurbo Framesになるのか、いつTurbo Streamsになるのかを整理します。

* **Turbo Framesはブラウザ側で指定します:**
* **Turbo Streamsはサーバ側で指定します:** ブラウザ側でTurbo Framesとしてリクエストされても、サーバからのレスポンスに`Accept: text/vnd.turbo-stream.html`があれば、こっちが優先され、Turbo Streamsとして処理されます

## 使い分けのヒント --- how-to-differentiate

上記のことから次のことが言えます

* サーバサイドバリデーションなど、異常系で複雑な処理をしたい場合はTurbo Streamsを使います
   * 例えば正常系はTurbo Framesのリクエスト・レスポンス処理をする一方で、異常系の時だけTurbo Streamsで応答するやり方ができます
   * あるいは正常系ではTurbo Drive redirectをレスポンスとして返し、異常系の時だけTurbo Streamsで応答することもやります
* サーバからのレスポンスの処理方法がシンプルな場合はTurbo Framesでずっとやることもできます
  * 気をつけなければならないのはredirectです。Turbo Framesのリクエストに対してredirectをする際、Turbo Frame内のredirectをするのか、それともTurbo Frameを抜けてredirectするのかを指定するのかはサーバで指定できません。事前にブラウザ側で`data-turbo-frame`属性や`target`属性を使って指定します

## まとめ --- summary

Turbo Drive, Turbo Frames, Turbo Streamsなど、Turboの使い方に複数タイプ存在する理由は、簡単なケースでは労力を最小化しつつ、複雑な場合の処理も可能にするためです。

簡単な処理はなるべくTurbo Driveで対応し、徐々にTurbo Streamsにアップグレードしていきます。そのとき、上記の仕組みを頭に入れていると良いのではないかと思います。
