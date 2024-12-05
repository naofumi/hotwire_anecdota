---
title: なるべく<a>や<form>を使用すること
section: Tips
layout: article
order: 45
published: true
---

## `<a>`タグや`<form>`タグのメリット --- merits-of-using-a-links-and-forms

Reactでインタラクティブな動作をさせる時、`<a>`タグを使用せずに`<button>`タグに`onClick`等のイベントハンドラーをつけることが多いです。同様にformを送信する場合も`<form>`タグに`action`属性をつけずに、代わりに`onSubmit`のイベントハンドラをつけて処理するのが一般的です。このように**Reactはブラウザネイティブの機能を使わずに、カスタムで動作を作ることが多いです**。

Hotwireはこの逆です。**Hotwireではなるべくブラウザ本来の機能を使います**。

ブラウザ本来の機能を使うメリットは以下のものが挙げられます。

* JavaScriptがオフでも`<a>`タグや`<form>`タグは動作しますので、[プログレッシブエンハンスメント](https://ja.wikipedia.org/wiki/プログレッシブエンハンスメント)になります。つまりJavaScriptが読み込まれていなくてもウェブサイトが動作します
* Hotwireの便利な機能が利用できます
    * `<a>`タグの`href`はデフォルトでマウスホバー時に[prefetchされます](https://turbo.hotwired.dev/handbook/drive#prefetching-links-on-hover)。つまりリンクをクリックする前に、Turboがフライングをしてリンク先のウェブページをロードします。このため、非常にレスポンスが速いUI/UXが得られます
    * `<a>`タグに[`data-turbo-method`属性](https://turbo.hotwired.dev/reference/attributes#data-attributes)を追加すると、GET以外のHTTPメソッドを使えます。HTMLの構造上、`<form>`が使いにくい時に便利です。（ただし非GETはなるべく`<form>`を使うことが推奨されています）
    * `<a>`タグおよび`<form>`に[`data-turbo-frame`属性](https://turbo.hotwired.dev/reference/attributes#data-attributes)を追加すると、サーバから返ってきたレスポンスを任意のTurbo Frameに転送できます
    * `<form>`に含まれる`<button>`や`<input>`に[`data-turbo-submits-with`](https://turbo.hotwired.dev/reference/attributes#data-attributes)を追加すると、送信中にボタンのテキストを自動的に変更できます。これだけでPending UI（待ちUI）が実現できます
    * `<a>`タグや`<form>`タグによってリクエストを送信すると、適切なHTML要素に`aria-busy`属性が付きます。アクセシビリティ的に有効な上に、これをCSS擬似セレクタで読み取れば待ちUIがCSSだけで作れます
    * `<form>`に`data-turbo-confirm`属性をつけると、form送信時に最終確認用のモーダルダイアログを表示できます。これはデフォルトではブラウザネイティブの`window.confirm()`が使用されますが、[カスタマイズ](https://turbo.hotwired.dev/reference/drive#turbo.setconfirmmethod)して任意のダイアログを表示できます
  
上記のように、Hotwireでは`<a>`タグや`<form>`タグを使えば数多くの便利機能がついてきます。`onClick`を使ってカスタムのイベントハンドラを書くのではなく、**なるべくブラウザの標準機能で引っ張り、少しでもライブラリに多くの仕事をさせるのがHotwireを便利に使いこなすコツの一つ**だと思います。

## 基本的な指針 --- basic-design-guideline

* サーバからデータを取得するような操作を作るときは、なるべく`<a>`タグや`<form>`タグを使います
   * `click`イベントではなく、例えば`input`や`change`イベントに応答するときは適宜対応するStimulus Controllerを書きます 
* `<button>`タグに`onclick`を書いて、そのハンドラからサーバに`fetch`するようなコードは滅多に書きません
   * 一般的なアコーディオンの開閉などはサーバとの通信が発生しませんので、`<button>`タグにStimulusを繋げます 

## JavaScriptから自在にTurboを使いたい場合 --- using-turbo-from-javascript

Turboを使ってサーバとの非同期通信をスタートさせる場合、`<a>`タグや`<form>`タグが推奨されているのは上述した通りです。でも`<a>`タグや`<form>`タグとは無関係に、JavaScriptからリクエストを送信したい場合もあります。そして`Turbo.visit([url])`でそれが可能なことも紹介しました。しかし実は、ここには制限があります。`Turbo.visit()`はGETメソッドしか送信できないのです。

POST用のメソッドを用意しないなど、TurboではJavaScriptから送信できるリクエストを敢えて制限しています。JavaScriptから非GETのTurboリクエストを送信しにくくしているのです。なるべく`<form>`タグを作って、プログレッシブエンハンスメントできるように書きなさいと言われているかのようです。

**どうしてもJavaScriptから自由にTurboを使いたい場合は[request.js](https://github.com/rails/requestjs-rails?tab=readme-ov-file)があります**。これはGitHubの`rails`リポジトリにありますので、Railsのチームで管理をしているものです（安心して使えます）。request.jsはCSRFトークンの送信や返ってきたTurbo StreamをDOMに挿入する処理もしてくれますので、Turboと一緒に使うときは便利です。


