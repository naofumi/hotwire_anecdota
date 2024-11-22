---
title: HotwireのJavaScriptは簡単
layout: article
order: 005
published: true
---

## Hotwireは入門書レベルのJavaScriptで書ける

[Reactとの比較](opinions/why_is_react_difficult)になりますが、HotwireはJavaScriptの入門書程度のJavaScriptで十分に書けます。

* Hotwireでは高階関数はほとんど使いません。`Array.forEach()`とか`Array.filter()`などの初歩的なものを使ってDOM操作はしますが、高階関数を意識することはまずありません。
* Hotwireではasync awaitやPromise、コールバック等は滅多に書きません
   * Reactでasync await等が必要になるのは主に`fetch()`というでサーバと通信をするときです。Hotwireの場合は、これはすべてTurboが担当します。そしてTurboは通常はJavaScriptすら必要なく、HTMLの属性を書くだけで十分です
   * Hotwireの場合は、Promiseを返すライブラリAPIを扱う時
   * だけasync awaitを使う感じになります

Hotwireの方が入門者、もしくはJavaScriptに特に詳しくないウェブデザイナーにとって優しいライブラリーと言えるかもしれません。

## 実際のJavaScript入門書を見てみる

先日、[「1冊ですべて身につくJavaScript入門講座」](https://amzn.asia/d/3cE80DK)を購入して読んでみました。

![javascript-intro-book.webp](content_images/javascript-intro-book.webp "max-w-[300px] mx-auto")
