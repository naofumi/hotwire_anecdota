---
title: Hotwireの歴史
section: History
layout: article
order: 60
published: true
---

## 系統樹 --- evolution-tree

注）下記の系統樹は網羅性・正確性を期したものはなく、大雑把な流れを表現するものです。

なお以前から[Railsのフロントエンドで使われた技術とHotwireおよびReactを並べた解説記事](/examples/side_panel)も用意しています。ご覧ください。

![Hotwire History](content_images/hotwire-history.webp)

## Hotwire --- hotwire

Hotwireの歴史をもう少し細かく説明します。

* Ruby on Railsは2004年の誕生当初からAJAXによる非同期通信と画面の部分更新をサポートしていました。
   * 当初からRailsのERBでHTMLをサーバサイドでレンダーし、これをブラウザに送信していました。
   * 当時は[RJS (Ruby/Remote JavaScript)](https://magazine.rubyist.net/articles/0014/0014-RubyOnRails.html)を使用し、レンダーされたHTMLをJavaScriptに包んでいました。当時はJavaScriptはかなり嫌われていた言語だったため、RubyでJavaScriptを書く方法が考案されました。
   * 当時はまだjQueryが普及していなかったため、[Prototype.js](http://prototypejs.org/)を代わりに使用していました。
   * 結果的にはJavaScriptをブラウザに転送していましたので、[Server-generated JavaScript Responses](https://signalvnoise.com/posts/3697-server-generated-javascript-responses)の一種でした。
   * [Prototype.js](http://prototypejs.org/)を開発し[Sam Stephenson](https://ja.wikipedia.org/wiki/Prototype_JavaScript_Framework)は長く37signalsの社員もあり、Ruby on RailsがAJAX黎明期から深くJavaScript開発に関わっていたことがわかります。
* [jQuery](https://ja.wikipedia.org/wiki/JQuery)が普及すると、RailsはPrototype.jsの代わりにjQueryを採用します。同じ[Server-generated JavaScript Responses](https://signalvnoise.com/posts/3697-server-generated-javascript-responses)を[Rails-UJS](https://github.com/rails/rails-ujs)もしくは[jQuery-UJS](https://github.com/rails/jquery-ujs)で使うことが一般的になります。
  * 上記のRJSを使うのではなく、レンダーされたHTMLを直接vanilla JavaScriptもしくはjQueryで包むようになりました。
  * 本サイトでも[Rails UJSの例を用意しました](/examples/side_panel#sjr)。
* jQueryが多機能でかつ簡潔にコードが書けるため、JavaScriptで包まないでHTML断片だけをRailsサーバから送信する方法も一般的になります。
   * 本サイトでも[HTML断片をjQueryでDOMに挿入する例を用意しました](/examples/side_panel#jquery) 
* 2012年にはBasecamp 3がリリースされ、DHHはブログ記事の中で[Railsフロントエンドの高速化技術](https://signalvnoise.com/posts/3112-how-basecamp-next-got-to-be-so-damn-fast-without-using-much-client-side-ui)を解説しています。
   * ここで紹介されているStackerと呼ばれたSPA的高速化手法がのちに公開された[TurboLinks](https://github.com/turbolinks/turbolinks)です。
      * Stackerのインスピレーションとなったのは[GitHubのPJAX](https://github.com/defunkt/jquery-pjax)です。 
   * 当時からクライアント側のJavaScriptでDOMをレンダリングするライブラリ(今でいうCSR: [Backbone.js](https://backbonejs.org), [AngularJS](https://angularjs.org), [Ember.js](https://emberjs.com/?utm_source=chatgpt.com)など)が話題になっていました。これに対して**サーバでHTMLをレンダーしても非常に高速化できるので、CSRを使う必要はない**というのが本記事の大きな主張でした。
* Hotwireは2020年にリリースされました。2004年から16年間蓄積されたフロントエンドの知見が詰まっています。2004年のRJS以来コンセプトは一貫しており、これを少しずつ改善して進化したものがHotwireです。
