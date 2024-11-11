---
title: なるべく<a>や<form>を使用すること
section: Tips
layout: section
order: 050
published: true
---

## なぜ<a>タグや<form>タグを使用するか？

React等でインタラクティブなコンポーネントを作るとき、一般に`<button>`タグに`onClick`等のイベントハンドラーをつけます。同様にformを送信する場合も`<form>`タグに`action`属性をつけずに`onSubmit`のイベントハンドラをつけて処理するのが一般的です（ただしNext.jsのServer Action等は除きます）。

メリットとしては以下のものが挙げられます。

* JavaScriptがオフでも`<a>`タグや`<form>`タグは動作しますので、[プログレッシブエンハンスメント](https://ja.wikipedia.org/wiki/プログレッシブエンハンスメント)になります
* 宣言的なAPIに統一されますので、便利な機能が追加されています
    * `<a>`タグの`href`はデフォルトで[prefetchされます](https://turbo.hotwired.dev/handbook/drive#prefetching-links-on-hover)。このため非常にレスポンスが速いUI/UXが実現されています
    * `<a>`タグに[`data-turbo-method`属性](https://turbo.hotwired.dev/reference/attributes#data-attributes)を追加すると、GET以外のHTTPメソッドを使えます。HTMLの構造上、`<form>`が使いにくい時に便利です。ただし非GETはなるべく`<form>`を使うことが推奨されています
    * `<a>`タグおよび`<form>`に[`data-turbo-frame`属性](https://turbo.hotwired.dev/reference/attributes#data-attributes)を追加すると、サーバから返ってきたレスポンスを任意のTurbo Frameに転送できます
    * `<form>`に含まれる`<button>`や`<input>`に[`data-turbo-submits-with`](https://turbo.hotwired.dev/reference/attributes#data-attributes)を追加すると、送信中にボタンのテキストを自動的に変更できます。これだけでPending UIが実現できます
    * `<form>`に`data-turbo-confirm`属性をつけると、form送信時に最終確認用のモーダルダイアログを表示できます。これはデフォルトではブラウザネイティブの`window.confirm()`が使用されますが、[カスタマイズ](https://turbo.hotwired.dev/reference/drive#turbo.setconfirmmethod)して任意のダイアログを表示できます
  
ここに挙げていない各種の機能もあります。

とにかく、なるべく`<a>`タグや`<form>`タグを使うようにしていれば、便利機能が勝手にどんどん追加されていきます。`onClick`を使ってカスタムのイベントハンドラを書くのではなく、なるべく標準機能で引っ張り、少しでもライブラリに多くの仕事をさせるのがHotwireを便利に使いこなすコツの一つだと思います。

## 基本的な指針

* サーバからデータを取得するような操作を作るときは、なるべく`<a>`タグや`<form>`タグを使います
* `<button>`タグに`onclick`を書いて、そのハンドラから`fetch`するようなコードは滅多に書きません
* サーバと通信しない操作の場合、もしくは`<a>`タグや`<form>`タグが提供するイベントでは不十分な場合は`<button>`等からのイベントを拾い、Stimulusでイベントを処理させます
    * リアルタイム検索では`input`イベントをStimulusで拾って、その中から`Turbo.visit([url])`を書きます
    * 一般的なアコーディオンの開閉などはサーバとの通信が発生しませんので、`<button>`タグにStimulusを繋げます

## JavaScriptから自由にTurboを使いたい場合

Turboを使ってサーバとの非同期通信をスタートさせる場合、`<a>`タグや`<form>`タグが推奨されているのは上述した通りです。でもJavaScriptからやりたい場合もあります。そして`Turbo.visit([url])`でそれが可能なことも紹介しました。しかし実は、ここには制限があります。`Turbo.visit()`はGETメソッドしか送信できないのです。

`fetch()`のように自在に好きなリクエストを送信できるようにはせず、TurboではJavaScriptから送信できるリクエストを敢えて制限しています。JavaScriptから非GETのTurboリクエストを送信しにくくしているのです。なるべく`<form>`タグを作って、プログレッシブエンハンスメントできるように書きなさいと言われているかのようです。

どうしてもJavaScriptから自由にTurboを使いたい場合は[request.js](https://github.com/rails/requestjs-rails?tab=readme-ov-file)があります。これはGitHubの`rails`リポジトリにありますので、Railsのチームで管理をしているものです。request.jsはCSRFトークンの送信や返ってきたTurbo StreamをDOMに挿入処理もしてくれます。


