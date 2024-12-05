---
title: POST/Redirect/GETパターンと高速化
layout: article
order: 50
published: true
---

![post-redirect-get.webp](content_images/post-redirect-get.webp "w-full")

## ウェブアプリの定石パターン：POST/Redirect/GET --- post-redirect-get-is-standard

### POST/Redirect/GET（PRGパターン）とは --- what-is-post-redirect-get

[POST/Redirect/GET](https://en.wikipedia.org/wiki/Post/Redirect/Get)はウェブで`<form>`を送信する際の**定石パターン**です。[日本語のPRGパターンの解説としてはここ](https://poco-tech.com/posts/spring-boot-introduction/post-redirect-get-pattern/)が良いと思います。

* Next.jsもRemixも、内部処理には多少の違いはあるものの、POST/Redirect/GETのパターンを使います
* HotwireはTurbo Drive, Turbo FramesではPOST/Redirect/GETのパターンを強制されます。具体的には**Turbo Drive, Turbo FramesはPOSTの後にStatus 200系のレスポンスが返ってきても無視します**。
* **POST/Redirect/GETパターンはリンク先で解説している通り、ブラウザおのリロードによる多重送信を防いでくれます**ので、古くから定石的な扱いでした。特に多重送信は電子商取引などでは多重発注につながりますので、可能な限り回避しました（とは言いつつ、ちゃんとやっていないサイトも実はそこそこあります）
* **SPAでは`<form>`を使った際に多重送信が発生してしまう問題に注意する必要が技術的には無くなっています**（SPAでリロードすると、ブラウザのステートが吹っ飛ぶだけであり、ユーザにとっては不便ですが、多重送信そのものは発生しません）
* Hotwire Turbo Drive, Next.jsやRemixの大文字`<Link>`タグのように、SPAとSSRを組み合わせた技術の場合は、SPAと同様に多重送信の問題は発生しません。したがって**技術的にはPOST/Redirect/GETパターンを使う必要はないのですが、現実には`<form>`送信後はリダイレクトやリフレッシュを行い、実質的にPOST/Redirect/GETをすることが多いです**

### POST/Redirect/GETの欠点 --- demerits-of-post-redirect-get

古くから普及し、モダンなウェブ技術でも使われ続けているPOST/Redirect/GETですが、欠点もあります

* POST/Redirect/GETは**２往復のサーバ通信が必要になるので、単純に遅延が倍になります**
    * Next.jsのServer Actionでは、開発者はPOST/Redirect/GETを書いても実際にはサーバ通信が１往復しなしない仕掛けを用意しています
* HotwireでPOST`<form>`送信の２往復を避ける場合、Turbo Streamを使います
   * Turbo Drive, Turbo Framesは使えません。[POST/Redirect/GETを前提とした動作をする](https://turbo.hotwired.dev/handbook/drive#redirecting-after-a-form-submission)ためです
      * 具体的には、フォーム送信後は必ずRedirectを期待し(ステータス300系)、バリデーションエラーでは必ずステータス400系を期待し、それに応じてブラウザ側でレスポンスを適宜処理します
      * フォーム送信後にリダイレクトなしで200系を返すと、レスポンスは無視されます
   * Turbo Streamsならば、ブラウザはステータス番号に関わらず、レスポンスbodyの中身だけで応答を決めます。普通は１往復だけでレスポンスします（[Turbo Streamのrefresh](https://turbo.hotwired.dev/reference/streams#refresh)だけは別です。ブラウザにページのリフレッシュをさせます – Morphingを使ったページリロード）

## 私のオススメ --- my-recommendation

* 開発の初期ではTurbo DriveやTurbo Framesを使い、高速にCRUD画面を作っていきます。この際はPOST/Redirect/GETのパターンを使うことになります
* 開発が落ち着いて、UI/UXの改善の取り掛かる余裕が生まれたらTurbo Streamsなどを使って、パフォーマンスの最適化をします
   * その中でPOST/Redirect/GETパターンの見直します
   * その他、パフォーマンス要件に応じて待ちUIや楽観的UIも検討します

