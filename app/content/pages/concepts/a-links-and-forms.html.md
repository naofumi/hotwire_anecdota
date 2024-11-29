---
title: なるべく<a>や<form>を使用すること
section: Tips
layout: article
order: 050
published: true
---

## `<a>`タグや`<form>`タグのメリット

Reactでインタラクティブな動作をさせる時、`<button>`タグに`onClick`等のイベントハンドラーをつけることが多いです。同様にformを送信する場合も`<form>`タグに`action`属性をつけずに`onSubmit`のイベントハンドラをつけて処理するのが一般的です。

**Reactではブラウザ本来の動作をさせずに、カスタムの動作をさせることを好みます**。Hotwireはこの逆です。**Hotwireではなるべくブラウザ本来の機能を使います**。

メリットとしては以下のものが挙げられます。

* JavaScriptがオフでも`<a>`タグや`<form>`タグは動作しますので、[プログレッシブエンハンスメント](https://ja.wikipedia.org/wiki/プログレッシブエンハンスメント)になります
* Hotwireの便利な機能が利用できます
    * `<a>`タグの`href`はデフォルトで[prefetchされます](https://turbo.hotwired.dev/handbook/drive#prefetching-links-on-hover)。このため非常にレスポンスが速いUI/UXが実現されています
    * `<a>`タグに[`data-turbo-method`属性](https://turbo.hotwired.dev/reference/attributes#data-attributes)を追加すると、GET以外のHTTPメソッドを使えます。HTMLの構造上、`<form>`が使いにくい時に便利です。（ただし非GETはなるべく`<form>`を使うことが推奨されています）
    * `<a>`タグおよび`<form>`に[`data-turbo-frame`属性](https://turbo.hotwired.dev/reference/attributes#data-attributes)を追加すると、サーバから返ってきたレスポンスを任意のTurbo Frameに転送できます
    * `<form>`に含まれる`<button>`や`<input>`に[`data-turbo-submits-with`](https://turbo.hotwired.dev/reference/attributes#data-attributes)を追加すると、送信中にボタンのテキストを自動的に変更できます。これだけでPending UI（待ちUI）が実現できます
    * `<a>`タグや`<form>`タグによってリクエストを送信すると、適切なHTML要素に`aria-busy`属性が付きます。アクセシビリティ的に有効な上に、これをCSS擬似セレクタで読み取れば待ちUIがCSSだけで作れます
    * `<form>`に`data-turbo-confirm`属性をつけると、form送信時に最終確認用のモーダルダイアログを表示できます。これはデフォルトではブラウザネイティブの`window.confirm()`が使用されますが、[カスタマイズ](https://turbo.hotwired.dev/reference/drive#turbo.setconfirmmethod)して任意のダイアログを表示できます
  
なるべく`<a>`タグや`<form>`タグを使うようにすれば、便利機能がいろいろ使えます。`onClick`を使ってカスタムのイベントハンドラを書くのではなく、なるべく標準機能で引っ張り、少しでもライブラリに多くの仕事をさせるのがHotwireを便利に使いこなすコツの一つだと思います。

## 基本的な指針

* サーバからデータを取得するような操作を作るときは、なるべく`<a>`タグや`<form>`タグを使います
* `<button>`タグに`onclick`を書いて、そのハンドラから`fetch`するようなコードは滅多に書きません
* サーバと通信しない操作の場合、もしくは`<a>`タグや`<form>`タグが提供するイベントでは不十分な場合は`<button>`等からのイベントを拾い、Stimulusでイベントを処理させます
    * リアルタイム検索では`input`イベントをStimulusで拾って、その中から`form.requestSubmit()`を呼びます。こうすることで`<form>`の便利機能が使えます
    * 一般的なアコーディオンの開閉などはサーバとの通信が発生しませんので、`<button>`タグにStimulusを繋げます
    * JavaScriptだけでTurboを呼び出したい時は`Turbo.visit()`を使います。このメソッドからTurbo Framesの指定などもできます

## JavaScriptから自由にTurboを使いたい場合

Turboを使ってサーバとの非同期通信をスタートさせる場合、`<a>`タグや`<form>`タグが推奨されているのは上述した通りです。でもJavaScriptからやりたい場合もあります。そして`Turbo.visit([url])`でそれが可能なことも紹介しました。しかし実は、ここには制限があります。`Turbo.visit()`はGETメソッドしか送信できないのです。

`fetch()`のように自在に好きなリクエストを送信できるようにはせず、TurboではJavaScriptから送信できるリクエストを敢えて制限しています。JavaScriptから非GETのTurboリクエストを送信しにくくしているのです。なるべく`<form>`タグを作って、プログレッシブエンハンスメントできるように書きなさいと言われているかのようです。

どうしてもJavaScriptから自由にTurboを使いたい場合は[request.js](https://github.com/rails/requestjs-rails?tab=readme-ov-file)があります。これはGitHubの`rails`リポジトリにありますので、Railsのチームで管理をしているものです。request.jsはCSRFトークンの送信や返ってきたTurbo StreamをDOMに挿入処理もしてくれます。


