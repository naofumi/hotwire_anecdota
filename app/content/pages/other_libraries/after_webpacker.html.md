---
title: Sprockets, Webpacker後の世界
section: Tips
layout: article
order: 005
published: true
---

## Sprockets, Webpacker時代 --- the-age-of-sprockets-and-webpacker

*下記の歴史については私もよくわからないところがありますので、参考程度と考えてください*

Ruby on RailsはGoogle V8エンジンやnode.jsよりも古いフルスタックフレームワークで、昔から積極的にJavaScriptやCSSのビルド技術を取り入れていました。

特にSprocketsは歴史が古く、少なくとも[2011にリリースされたRails 3.1にRails Guide](https://guides.rubyonrails.org/v3.1/asset_pipeline.html)がありました。この頃はCSS, SASS, JavaScript, CoffeeScriptのビルドに使用されていました。[Webpackはまだ登場していませんでした](https://ja.wikipedia.org/wiki/Webpack)ので、CSSやJavaScriptの中にERBのタグを入れるやり方は当時は必要でした。

例えば下記のような書き方は（今では非常に気持ち悪がられますが）よく見かけました。

```css
.class { background-image: url(<%= asset_path 'image.png' %>) }
```

```js
$('#logo').attr({
  src: "<%= asset_path('logo.png') %>"
});
```

その後、アプリっぽいJavaScript (React等)の処理はSprocketsからWebpackに委譲され、SprocketsとWebpackを繋げるのが[Webpacker](https://github.com/rails/webpacker)が使われるようになりました。WebpackerはCSSや画像のビルド等にも使用できました。

## Rails 7以降のRailsのJavaScript --- javascript-after-rails-7

2021年のRails 7以降は、Webpackerではない新しいJavaScriptのビルド方法が採用されました。大きく[３種類用意されています](https://world.hey.com/dhh/rails-7-will-have-three-great-answers-to-javascript-in-2021-8d68191b)。

1. **Import mapsを使用したノービルド JavaScript:** JavaScriptを一切ビルドしないアプローチです。Sprocketsの誕生以前は効率が悪かった伝統的なアプローチが、HTTP2, ES6, import mapsが登場したおかげで再び現実的になったのです。それを最大限に活かしたのが[Import maps](https://github.com/rails/importmap-rails)を使用したノービルド JavaScriptです
2. **JavaScriptのエコシステムを活用したビルドツール:** React SPAのようにどうしてもビルドが必要な場合のために、無理にRailsベースのWebpackerを使うのではなく、JavaScriptのエコシステムのツールを活用した方法として[jsbundling-gem](https://github.com/rails/jsbundling-rails)が用意されています。これはBun, esbuild, rollup.js, Webpackのうちの好きなものを使ってJavaScriptをビルドするものです。特に強い希望がなければ推奨はesbuildです。Basecamp 3はWebpackerからjsbundling-gem + esbuildに移行されたようです。また**本サイトはReactを使用していますので、jsbundling-gem + esbuildでJavaScriptをビルドしています**
3. **RailsをAPIモードで使用する:** フロントエンドとバックエンドのリポジトリを完全に分離しているのならRailsをAPIモードで使用して、Rails側では一切JavaScriptに関与しないというアプローチもあります

## Rails 7以降のCSS --- css-after-rails-7

CSSについてはSASS等を使わずに生のCSSを使う方法がデフォルトとして用意されています。最新のCSSはネスト化された定義やCSS変数など、従来はSASSがなければ実現できなかった機能が最初から用意されています。以前に比べて、大きいプロジェクトであっても生のCSSが現実的に使えるようになっています。

Tailwind CSSやSASSを使うのであれば、CSSをビルドするツールが必要になります。Tailwind CSSについては別個の[tailwindcss-rails gem](https://github.com/rails/tailwindcss-rails)が用意されていますし、SASSを使いたいのであれば[dartsass-rails gem](https://github.com/rails/dartsass-rails/)が用意されています。またビルド時にどっちみちNode.jsを使うのであれば[cssbundling-rails gem](https://github.com/rails/cssbundling-rails)が用意されています。

tailwindcss-rails gemおよびdartsass-rails gemはNode無しで使えるのに対して、cssbundling-rails gemはNodeを必要とするぐらいの違いです。

**本サイトでは、Reactを使う関係でどうしてもNodeを使用しますので、ついでにTailwind CSSもcssbundling-rails gemでビルドさせています**。Reactを使わずに、またJavaScriptはimport mapsにするのであれば、tailwindcss-rails gemを使用したかもしれません。

## Rails 8以降の画像等のアセットの処理 --- image-assets-after-rails-8

非常に長い歴史を持つSprocketsでしたが、ノービルドが可能になったこと、およびJavaScript, CSS周りのエコシステムが充実してことを受けて、だんだん役割が狭まってきました。最初はJavaScriptのビルド、CSSのビルド、そしてdigestの付与等の役割を担っていたのが、今ではdigestの付与ぐらいしか役割がなくなってしまいました。そこで登場したのが[Propshaft](https://world.hey.com/dhh/introducing-propshaft-ee60f4f6)です。

[Propshaft](https://github.com/rails/propshaft)はdigestの管理が主な仕事になります。ERBを使った気持ち悪い手段を取らなくても[CSSやJavaScriptからアセットファイルを参照できます](https://github.com/rails/propshaft?tab=readme-ov-file#referencing-digested-assets-in-css-and-javascript)し、esbuild等がすでにdigestをつけてくれるのならば、[propshaftが二重にdigestをつけるのを防ぐこともできます](https://github.com/rails/propshaft?tab=readme-ov-file#bypassing-the-digest-step)。

## まとめ --- summary

このようにRails 7, 8でRailsのアセット管理は大きく見直されました。**ノービルドでやる場合であっても、あるいはReact/JSXを使ってJavaScriptをビルドする場合であっても、アセット管理は大幅に簡略化されています**。

特に**フロントエンドエンジニアに嫌われていたのは、Webpackerによる独自のRailsとの統合**だったのではないかと思います。これが原因でReact/VueフロントエンドとRailsバックエンドのリポジトリを完全に分けていたプロジェクトも多いかと思います。しかし**今のRailsはフロントエンドのエコシステムとより親和性のある方法を採用しています**。

SprocketsやWebpackerがどうしても必要だった時代はもう過ぎ去りました。新しいツールと簡素な管理で、今まで以上に充実したアセット管理ができるようになったと言えるでしょう。
