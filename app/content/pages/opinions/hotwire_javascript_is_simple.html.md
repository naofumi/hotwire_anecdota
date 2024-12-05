---
title: HotwireのJavaScriptは簡単
layout: article
order: 10
published: true
---

## Hotwireは入門書レベルのJavaScriptで書ける --- you-can-write-hotwire-with-tutorial-level-javascript

[Reactとの比較](opinions/why_is_react_difficult)になりますが、Hotwireで使うJavaScriptは簡単です。**Hotwireは入門書程度のJavaScriptで十分に書けます**。

* Hotwireでは高階関数はほとんど使いません。`Array.forEach()`とか`Array.filter()`などの初歩的なものを使ってDOM操作はしますが、高階関数を意識することはまずありません。
* Hotwireではasync awaitやPromise、コールバック等は滅多に書きません
   * Reactでasync await等が必要になるのはほとんどが`fetch()`というでサーバと通信をするときだけです。それさえなければ、async awaitの必要性は激減します
   * Hotwireの場合は、`fetch()`はすべてTurboが担当します。そしてTurboは通常はJavaScriptすら必要なく、HTMLの属性を書くだけで十分です。もちろんasync awaitは登場しません

Hotwireの方が入門者、もしくはJavaScriptに特に詳しくないウェブデザイナーにとって優しいライブラリーと言えると思います。

## 実際のJavaScript入門書を見てみる --- javascript-introduction

先日、[「1冊ですべて身につくJavaScript入門講座」](https://amzn.asia/d/3cE80DK)を購入して読んでみました。

この入門書で学習するJavaScriptの範囲は下記のものです。

* `document.querySelector()`などのセレクタ
* `element.addEventListener()`などのイベント処理
* `element.textContent`, `element.classList`などのDOM操作
* 関数の定義の仕方
* `for`文、`if`文
* `Array`や`Object`への基本的な値の出し入れ

**「これじゃ全然足りない！もっとJavaScriptをちゃんと勉強しないと現場で使えない」とお思いかもしれませんが、私が本サイトで書いているStimulus Controllerはこれでほぼカバーできます**。JavaScript classの基本、三項演算子、`setInterval()`を追加すれば良い程度です。

別の言い方をすれば、**Reactで必要とされる高レベルのJavaScriptは偶有的な複雑性です。本質的な複雑性は入門レベルのJavaScriptでカバーされています**。

![javascript-intro-book.webp](content_images/javascript-intro-book.webp "max-w-[300px] mx-auto")

## まとめ --- summary

* HotwireのJavaScriptは、デザイナー向けの初歩的な知識だけでほぼ書けます
* ウェブデザイナー、ウェブコーダーでも十分にHotwireのJavaScriptコードが書けます
* Hotwireは、Reactと比べて、はるかに裾野が広い技術と言えます
