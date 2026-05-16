---
title: サーバから見たTurbo FramesとTurbo Streamsの違い
layout: article
order: 340
published: true
---

Turbo Framesは画面の一箇所のみを変更するのに対して、Turbo Streamsは複数箇所を変更したり、更新方法を細かく指定したりできます。通常はこれで使い分けます。

これに加え、**Turbo Framesはクライアント側で制御されるのに対して、Turbo Streamsはサーバ側で制御できる点が大きな違いです**。

* Turbo Framesはリクエストを送信時に**クライアント側でレスポンスの処理方法を指定します**。
   * `<turbo-frame id="hoge">...</div>`に囲まれた箇所からリクエストを送信すれば、レスポンスにも対応する`<turbo-frame id="hoge">...</div>` (`id`が"hoge")が存在することが期待され、その中だけが取り出されて画面の更新に使用されます。
   * 他にも`<a>`タグ、もしくは`<form>`タグに`data-turbo-frame`属性をつけて、対象の`<turbo-frame>`を指定したり、JavaScriptで`Turbo.visit([url], {frame: [turbo-frame名]})`を呼び出す方法でTurbo Framesを使用する方法もありますが、いずれもクライアント側でレスポンスの処理方法を指定します。
   * レスポンスに対応するTurbo Frameが見つからない場合は[`turbo:frame-missing`イベント](https://turbo.hotwired.dev/reference/events#turbo%3Aframe-missing)が発火しますので、やはりクライアント側で対処します。
* Turbo Streamsは**サーバ側だけでレスポンスの処理方法を指定します**。
   * [Turbo Streamsレスポンスはサーバだけが決めます](https://turbo.hotwired.dev/handbook/streams#streaming-from-http-responses)。レスポンスが下記の項目を満たせば、Turbo Streamsとして処理されます。
     * レスポンスヘッダーに`Content-Type: text/vnd.turbo-stream.html;`をつけます。
     * レスポンスbodyに`<turbo-stream action="[アクション名]" target="[ターゲット名]">`を返します。サーバ側でDOMのどの箇所(target)に対してどのような変更(action)を加えるかを明示します。
   * 必須ではありませんが、クライアント側からリクエスト時に`Accept: text/vnd.turbo-stream.html;`ヘッダーをつけることもできます。これはサーバの処理を助けるものであり、Turbo Streamsそのものの動作には影響ありません。`<form>`タグからの[POST/PUT/PATCH/DELETEリクエストには自動的にこのヘッダーが付きます](https://turbo.hotwired.dev/handbook/streams#streaming-from-http-responses)が、それ以外のリクエストでこのヘッダーを自動的につけたい場合は`data-turbo-stream`属性を使います。
* Turbo FramesとTurbo Streamsの双方を使用した場合はTurbo Streamsの方が優先します。

## 具体的な使用場面 --- usage-scenarios

* 通常は画面の１箇所だけを更新するときはTurbo Framesを使います。同時に複数箇所を更新するとき、もしく更新方法を細かく指定したい場合はTurbo Streamsを使います。
  * ただし複数箇所を更新する場合でも、更新範囲を大きくとれば１箇所の更新で済むこともあります。 
  * [morphing](https://turbo.hotwired.dev/handbook/page_refreshes)を使うと画面のステートが保持されますので、更新範囲が大きくなってもUXを損なう心配がありません。（morphingはTurbo Drive, Turbo Frames, Turbo Streamsのいずれでも使用できます）
* サーバ側のレスポンスによって画面更新方法を切り替えたい場合はTurbo Streamsが使いやすいです。
   * サーバでしか実行できない複雑なバリデーションがあり、かつその結果によって画面更新方法を変えたい場合があります。このようなときは、レスポンス方法をサーバ側で指定できるTurbo Streamsが便利です。
   * なおTurbo Streamsを使わない別方法として[`turbo:submit-end`イベント](https://turbo.hotwired.dev/reference/events#turbo%3Asubmit-end)のレスポンスステータスを確認して、画面更新方法を切り替えることもできます。
