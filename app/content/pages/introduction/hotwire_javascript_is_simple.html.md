---
title: HotwireのJavaScriptは簡単
layout: article
order: 40
published: true
---

## Hotwireは入門書レベルのJavaScriptで書ける --- you-can-write-hotwire-with-tutorial-level-javascript

Hotwireは入門書程度のJavaScriptで十分に書けます。ReactのようにJavaScriptの高度な理解が要求されることはありません。

* Hotwireでは**高階関数はほとんど使いません**。`Array.forEach()`とか`Array.filter()`などの初歩的なものを使ってDOM操作はしますが、高階関数を意識することはまずありません。
* Hotwireでは**async awaitやPromise、コールバック等は滅多に書きません**
   * Reactでasync await等が必要になるのはほとんどが`fetch()`というでサーバと通信をするときだけです。それさえなければ、async awaitの必要性は激減します
   * Hotwireの場合は、`fetch()`はすべてTurboが担当します。そしてTurboは通常はJavaScriptすら必要なく、HTMLの属性を書くだけで十分です。もちろんasync awaitは登場しません

Hotwireの方が入門者、もしくはJavaScriptに特に詳しくないウェブデザイナーにとって優しいライブラリーと言えます。

## 実際のJavaScript入門書を見てみる --- javascript-introduction

先日、[「1冊ですべて身につくJavaScript入門講座」](https://amzn.asia/d/3cE80DK)を購入して読んでみました。

この入門書で学習するJavaScriptの範囲は下記のものです。

* `document.querySelector()`などのセレクタ
* `element.addEventListener()`などのイベント処理
* `element.textContent`, `element.classList`などのDOM操作
* 関数の定義の仕方
* `for`文、`if`文
* `Array`や`Object`への基本的な値の出し入れ

「これじゃ全然足りない！もっとJavaScriptをちゃんと勉強しないと現場で使えない」とお思いかもしれませんが、**私が[本サイトで書いているStimulus Controller](https://github.com/naofumi/hotwire_anecdota/tree/master/app/javascript/controllers)はこれでほぼカバーできます**。JavaScript classの基本、三項演算子、`setInterval()`を追加すれば良い程度です。

![javascript-intro-book.webp](content_images/javascript-intro-book.webp "max-w-[300px] mx-auto")

