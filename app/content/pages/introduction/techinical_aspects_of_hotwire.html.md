---
title: Hotwireの技術的特徴
layout: article
order: 20
published: true
---

## Turboの特徴 --- turbo-features

Turboは`fetch`を使ってサーバと通信し、非同期でブラウザ画面を更新する一連の技術です。

### TurboはサーバからHTMLを受け取ります --- turbo-receives-html-from-server

Turboは下記の処理を行います。

* `fetch`もしくはWebsocketを使ってサーバと通信します。
   * `<a>`タグのクリックもしくは`<form>`タグのSubmitに応答して自動的にTurboのリクエストを送信します。
   * JavaScriptからは`Turbo.visit()`で[Turboのリクエストを送信できます](https://turbo.hotwired.dev/reference/drive#turbodrivevisit)。
* サーバからHTMLを取得します。
* HTMLをDOMに反映します。この際[morphingを使う](https://turbo.hotwired.dev/handbook/page_refreshes)と差分のみを反映しますので、DOMのステートを維持することも可能です。

### TurboはJSON APIが不要です --- turbo-doesnt-need-json-api

ReactはブラウザでDOMをレンダリングします。動的なデータをレンダリングするためにはサーバからJSON APIでデータを渡す必要があります。しかしTurboはサーバでレンダリング済みのHTMLを受け取るため、JSON APIが不要です。

JSON APIが不要なため、Turboでは`fetch`のコードを書いたり、エラーハンドリングしたり、レスポンスをステートに保存したりする必要がなく、コードが大幅に簡略化されます。

### Turbo Driveは画面遷移を高速化するSPA --- turbo-drive-is-an-spa

Turbo Driveは`<body>`タグ全体を入れ替えるため、画面全体が切り替わります。結果としてSPAの画面遷移を実現します。

**メリット**

* **高速なページ遷移が実現できます:** ページ間でステートが維持され、キャッシュやpreloadingも実施されるため、ページ遷移が高速になります。また`<head>`にある`<script>`のJavaScriptや`<link>`のCSSを再読み込みする必要がないため、画面遷移がさらに滑らかになります。
* **コードがとても簡単に書けます:** MPA用に書いたページが、Turbo Driveをインストールするだけで使用できます。コードは非常に簡単で、非同期通信を意識する必要はありません。 

### Turbo Framesは画面を分割して非同期的に更新します --- turbo-frames-splits-screen

Turbo Framesは画面の一部分を独立した領域として考えられる場合、その部分だけを非同期更新するのに有効です。例えば検索結果を表示するテーブル、タブ切り替えのコンテンツなどがTurbo Framesに適しています。概念としては`<iframe>`に似ています。

**メリット**

* **簡単に使えます:** MPA用に書いたページを`<turbo-frame>`タグで囲むだけでTurbo Framesを利用できます。また`<a>`タグや`<form>`タグに`data-turbo-frame`属性をつけるだけで、`<turbo-frame>`の中身を非同期更新できます。
* **便利機能が付いています:** ローディング状態を示す`busy`, `complete`属性が自動的についたり、`autoscroll`属性でスクロールを制御したりできます。
* **URLを更新できます:** 

### Turbo Streamsは細かい制御を可能にする --- turbo-streams-allows-fine-control

Turbo Framesは画面の一部分を非同期更新するのに対して、Turbo Streamsは画面の複数箇所を細かく非同期更新するのに適しています。

**メリット**

* **画面の複数箇所を更新:** Turbo DriveおよびTurbo Framesは画面の連続した１箇所を非同期更新するが、Turbo Streamsであれば画面の複数箇所を非同期更新できます。
* **通常と異なる制御が可能:** Turbo DriveやTurbo Framesは一番一般的なケースを想定して作られています。例えば[Turbo DriveはFormを送信したのちに303リダイレクトを期待する](https://turbo.hotwired.dev/handbook/drive#redirecting-after-a-form-submission)が、[Turbo Streamsを使えばリダイレクトせずにPOST後に直接画面を更新できます](https://turbo.hotwired.dev/handbook/drive#streaming-after-a-form-submission)。
* **WebSocketが利用できます:** Turbo StreamsはWebSocketを活用することで、リアルタイムなUI更新が可能です。例えばチャットアプリやライブストリームなどに利用できます。

## Stimulusはインタラクションを管理します --- stimulus-manages-interactions

フロントエンドにおけるインタラクティビティとは、ユーザのアクションに対してステートを更新して、画面の表示を切り替えたり、バリデーションを実施したり、またサーバとの非同期通信をしたりすることです。Stimulusはこのためのツールを提供し、指定されたHTML要素をインタラクティブにします。

- **ライフサイクル管理:** Stimulus controllerがマウントしたりアンマウントしたりするときに自動的に実行されるコールバックが用意されています。
- **ステート:** Stimulus Controllerはvaluesというステートを持ち、ステートが変更されたらコールバックが実行されます。
- **イベントハンドラ:** 

