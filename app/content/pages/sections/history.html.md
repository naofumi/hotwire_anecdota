---
title: Hotwireの歴史
section: History
layout: section
order: 010
---

## 進化の分岐点はCSR vs SSR 

![Hotwire History](content_images/hotwire-history.webp)

* 2007年にiPhoneが発売されると、ウェブ技術(HTML/CSS/JavaScript)でネイティブアプリ的なUI/UXを作る方法論の模索が始まりました
* SproutCore(後のEmber.js)、Backbone.js、Angular.js、Reactはこれを目指して生まれた技術です
* 特に注目されたのは、非同期で表示内容を変える技術およびデータバインディング(モデルの内容をHTMLに即時反映させる技術)でした
* データバインディングを実現するためには、ブラウザ側でJavaScriptを使ってHTMLをレンダリングすることが必須でした(CSR)
