---
title: POST/Redirect/GETパターンと高速化
layout: article
order: 330
published: true
---

![post-redirect-get.webp](content_images/post-redirect-get.webp "w-full")

## ウェブアプリの定石パターン：POST/Redirect/GET --- post-redirect-get-is-standard

### POST/Redirect/GET（PRGパターン）とは --- what-is-post-redirect-get

[POST/Redirect/GET](https://en.wikipedia.org/wiki/Post/Redirect/Get)はウェブで`<form>`から非GETのリクエストを送信する際の**定石パターン**です。[日本語のPRGパターンの解説としてはここが良い](https://poco-tech.com/posts/spring-boot-introduction/post-redirect-get-pattern/)と思います。

* **Turbo Drive, Turbo FramesはPOST/Redirect/GETのパターンを強制します**。具体的には`<form>`の非GETリクエストのレスポンスがStatus 200系だった場合はレスポンスを無視します。
  * **[POST/Redirect/GETパターンはブラウザのリロードによる多重送信を防いでくれます](https://poco-tech.com/posts/spring-boot-introduction/post-redirect-get-pattern/)**ので、古くから定石的な扱いでした。[^next-js-prg]
  * 非同期のform送信を行うHotwire Turbo Driveでは多重送信の心配はほとんどありませんが、[`<form>`送信後のURLが不整合になる可能性があります](https://turbo.hotwired.dev/handbook/drive#redirecting-after-a-form-submission)。URL(`document.location.href`)の整合性を保ためにPOST/Redirect/GETパターンを強制しています。[^double-submission] [^url-integrity]
  * なお400系ではレスポンスを普通に表示します。そのためバリデーションエラーの表示は通常通りに行えます。  
     * Hotwire以前はまでは、バリデーションエラーに対してstatus 200を返しても問題ありませんでした。しかしHotwire以降ではstatus 400系(通常は422)を返さないとエラーページが表示してくれなくなりました。
* ただしTurbo StreamsはPOST/Redirect/GETパターンに従う必要はありません。Turbo StreamsはURL (`document.location.href`)に影響しないためです。 

[^next-js-prg]: Next.jsのserver actionも、内部処理には多少の違いはあるものの、[POST/Redirect/GETのパターンを使います](https://nextjs.org/docs/app/getting-started/mutating-data#redirect-after-a-mutation)。
[^double-submission]: **非同期のform送信では多重送信が起きません**。多重送信はPOST後の画面でリロードするとPOSTが再送信されてしまうのが原因でした。しかし非同期でPOSTをした場合はリロードしてもPOSTは再実行されませんので多重送信の心配はありません。
[^url-integrity]: Turboで`<form>`から非GETのリクエストを送信する場合、URLを変更しません。そのためレスポンスの内容をそのまま画面に表示してしまうと、表示コンテンツの内容とURLの中身が噛み合わなくなってしまいます(例えばURLは`posts/new`なのに、新しく作成された`posts/1`の内容が表示されてしまいます)。一方で仮にリクエストを送信後にURLを`<form>`の`action`属性に合わせてしまうと(ブラウザのnativeの挙動)、URLはPOST用のものになります。この時点でブラウザリロードをするとGET methodでPOST用のURLにリクエストを投げてしまうので、これも不整合になります。どっちの実装も大きい課題があるため、Turboではredirectを強要する設計にしています。

### POST/Redirect/GETの欠点 --- demerits-of-post-redirect-get

* POST/Redirect/GETは**サーバ通信が２往復必要になるため、反応が遅くなります**
* HotwireでPOST`<form>`送信後の通信２往復を避ける必要があり、かつURLの変更をさせない場合はTurbo Streamを使います

## 私のオススメ --- my-recommendation

* 開発の初期ではTurbo DriveやTurbo Framesを使い、高速にCRUD画面を作っていきます。この際はPOST/Redirect/GETのパターンを使うことになります
* 開発が落ち着いて、UI/UXの改善の取り掛かる余裕が生まれたらTurbo Streamsなどを使って、パフォーマンスの最適化をします
   * その中でPOST/Redirect/GETパターンの見直します
   * その他、パフォーマンス要件に応じて待ちUIや楽観的UIも検討します

