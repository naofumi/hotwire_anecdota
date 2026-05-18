---
title: なるべく<a>や<form>を使用すること
section: Tips
layout: article
order: 25
published: true
---

## `<a>`タグや`<form>`タグのメリット --- merits-of-using-a-links-and-forms

Hotwireではなるべく通常の`<a>`や`<form>`でナビゲーションをします。

* JavaScriptがオフでも`<a>`タグや`<form>`タグは動作しますので、[プログレッシブエンハンスメント](https://ja.wikipedia.org/wiki/プログレッシブエンハンスメント)になります。つまりJavaScriptが読み込まれていなくてもウェブサイトが動作します
* Hotwireの便利な機能が利用できます
    * `<a>`タグの`href`はデフォルトでマウスホバー時に[prefetchされます](https://turbo.hotwired.dev/handbook/drive#prefetching-links-on-hover)。つまりリンクをクリックする前に、Turboがフライングをしてリンク先のウェブページをロードします。このため、非常にレスポンスが速いUI/UXが得られます
    * `<a>`タグに[`data-turbo-method`属性](https://turbo.hotwired.dev/reference/attributes#data-attributes)を追加すると、GET以外のHTTPメソッドを使えます。HTMLの構造上、`<form>`が使いにくい時に便利です。（ただし非GETはなるべく`<form>`を使うことが推奨されています）
    * `<a>`タグおよび`<form>`に[`data-turbo-frame`属性](https://turbo.hotwired.dev/reference/attributes#data-attributes)を追加すると、サーバから返ってきたレスポンスを任意のTurbo Frameに転送できます
    * `<form>`に含まれる`<button>`や`<input>`に[`data-turbo-submits-with`](https://turbo.hotwired.dev/reference/attributes#data-attributes)を追加すると、送信中にボタンのテキストを自動的に変更できます。これだけでPending UI（待ちUI）が実現できます
    * `<a>`タグや`<form>`タグによってリクエストを送信すると、適切なHTML要素に`aria-busy`属性が付きます。アクセシビリティ的に有効な上に、これをCSS擬似セレクタで読み取れば待ちUIがCSSだけで作れます
    * `<form>`に`data-turbo-confirm`属性をつけると、form送信時に最終確認用のモーダルダイアログを表示できます。これはデフォルトではブラウザネイティブの`window.confirm()`が使用されますが、[カスタマイズ](https://turbo.hotwired.dev/reference/drive#turbo.setconfirmmethod)して任意のダイアログを表示できます
    * `<a>`やGETの`<form>`に`data-turbo-stream`属性をつけると、リクエストヘッダーに`Accept: text/vnd.turbo-stream.html ...`がつき、サーバに対してturbo streamを要求されます。Turbo Streamの機能そのものには関係ありませんが、サーバ側コードが書きやすくなります。
  
上記のように、Hotwireでは`<a>`タグや`<form>`タグを使えば数多くの便利機能がついてきます。`onClick`を使ってカスタムのイベントハンドラを書くのではなく、**なるべくブラウザの標準機能で引っ張り、少しでもライブラリに多くの仕事をさせるのがHotwireを便利に使いこなすコツの一つ**だと思います。

## 基本的な指針 --- basic-design-guideline

* サーバからデータを取得するような操作を作るときは、なるべく`<a>`タグや`<form>`タグを使います。`fetch()`でリクエストをサーバに投げると、Turboが管理できなくなるので、可能な限り避けます。
* `<form>`で通常のsubmitができない場合(例えば`<input>`の`input`や`change`イベントで送信したい場合)は、なるべくJavaScriptから`requestSubmit()`で送信をします。
* それ以外の場合は下記の[JavaScriptから直接Turboを使う](#using-turbo-from-javascript)こともできます。

## JavaScriptから直接Turboを使いたい場合: request.js --- using-turbo-from-javascript

非同期通信をする場合、`<a>`タグや`<form>`タグが推奨されているのは上述した通りです。しかし`<a>`タグや`<form>`タグとは無関係に、JavaScriptからリクエストを送信したい場合もあります。

* `Turbo.visit([url])`で[JavaScriptからTurboのリクエストを投げることができます](https://turbo.hotwired.dev/reference/drive#turbo.visit)。
   * ただし`Turbo.visit()`はGETメソッドしか送信できません。
* GET以外のリクエストを送信したい場合は[request.js](https://github.com/rails/requestjs-rails?tab=readme-ov-file)を使います。request.jsはCSRFトークンの送信や返ってきたTurbo StreamをDOMに自動挿入する処理もしてくれます。

ただし繰り返しになりますが、なるべくならば`request.js`を使わないのがお勧めです。敢えて非表示の`<form>`を作ってでも、`<form>`を使った方が[プログレッシブエンハンスメント](https://ja.wikipedia.org/wiki/プログレッシブエンハンスメント)の考え方に沿っています。また`<form>`要素と`<button>`要素が親子関係にならない場合は[`form`属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/form)を使うと良いでしょう。
