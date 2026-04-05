---
title: モーダル
layout: article
order: 100
published: true
descriptors:
  component_names:
    - Modal
    - Dialog
    - Popup
  server_request: true
  state_management:
    - aria-expanded
  technologies:
    - Turbo Streams
    - Stimulus
    - Turbo Drive
  demo_urls:
    - ["デモ", "/todos"]
  related_pages:
    - /concepts/stimulus-tips.html.md
---

ここではモーダルダイアログの実装を紹介します。

* [HTMLネイティブの`dialog`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/dialog)を使わずに、ゼロからHotwireで作成します。HTMLネイティブなものは別途紹介します。
* JavaScriptをほとんど使わないような**簡易的モーダル**の実装ではありません。JavaScriptを使い、アクセシビリティにも配慮したモーダルを作ります。
* あえて難しめのモーダルを作ることで、Hotwireのコツを少し紹介していきたいと思います。
* 複数のページに跨って紹介していきます。上の「子ページ」から各セクションをご覧になってください。

下記のようなUIになります。

![modal-full.mov](content_images/modal-full.mov "mx-auto")


## 考えるポイント --- considerations

* サーバとの非同期通信
   * 今回はモーダルの中身をサーバから非同期で取得するとします。Turbo FramesおよびTurbo Streamsのいずれも使用できますが、今回はTurbo Framesで十分なのでこれを使います。
   * モーダルの中から`<form>`の送信します。今回はTurbo Streamsによる方法を主に紹介します。なおデモではvariantを使ってTurbo Driveを使用した場合のUI/UXを試すこともできます。
* [モーダルダイアログに期待されるアクセシビリティ要件](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)はかなり多いため、キーボードショートカットを含めてJavaScript/Stimulusでの対策が必要です。
* モーダルの中でサーバサイドバリデーションを行う場合。
   * Turbo DriveやTurbo Framesの設計思想として、サーバ側は非同期処理を意識することなく、通常のMPAと同じ形のままに残すというのがあります。つまり非同期処理の複雑さは全てブラウザ側で処理します。
   * 一方でTurbo Streamsはサーバサイドが非同期処理に深く関与します。画面のどの部分をどのように非同期更新するかを、サーバの状態に応じて細かく指定できます。
   * サーバサイドバリデーションを行う場合は成功・失敗によって処理が大きく変わりますので、Turbo Streamsで処理するのに適しています。例えば成功の場合はモーダルを閉じて、リダイレクトして、トーストを表示します。一方でバリデーションが失敗した場合はモーダルを開いたままにして、エラーは表示して、トーストを表示しないなどの処理が必要になります。
   * なおクライアントサイドバリデーションでは失敗を事前にブロックしますので、成功した場合の処理だけ考えます。そのためTurbo Drive, Turbo Framesでも対応しやすくなります。

## 今回の設計のポイント --- points-to-consider

モーダルダイアログでCRUDをする場合は、検討すべき項目が多くなりますので、今回は分割して紹介します。それぞれのページに移動して、ご確認ください。

1. [モーダルの表示・非表示](/examples/modal/modal-show-with-animation)
   1. モーダルのDOMをどこに配置するか
   2. モーダルをクリックするボタンとの距離の課題の解決
   3. 表示内容をサーバから取得するところ
   4. レスポンス遅延の対応
   5. モーダルをクローズする処理
2. [フォームを送信してモーダルを隠す](/examples/modal/modal-form-success-and-hide)
   1. フォームの送信
   2. 変更されたデータを使って背景にある画面を更新
   3. トーストの表示
   4. 成功した場合は自動的にモーダルを閉じる
   5. [失敗した場合はモーダルを表示したままにして、エラーを表示する](/examples/modal/modal-form-failure)

