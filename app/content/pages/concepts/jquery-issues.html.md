---
title: Stimulusが解決したjQueryの問題
layout: article
order: 180
published: true
---

Reactを推奨する人の多くはjQueryコードのメンテナンスの難しさを取り上げ、Reactではこれが解消されていると言います。またDHH自身も[Stimulusの目的はコードスタイルを統一し、再利用を促すことだった](https://stimulus.hotwired.dev/handbook/origin)としています。

> Prior to Stimulus, Basecamp used a smattering of different styles and patterns to apply these sprinkles. Some code was just a pinch of jQuery, some code was a similarly sized pinch of vanilla JavaScript, and some again was larger object-oriented subsystems. They all usually worked off explicit event handling hanging off a data-behavior attribute.
>
> While it was easy to add new code like this, it wasn’t a comprehensive solution, and we had too many in-house styles and patterns coexisting. That made it hard to reuse code, and it made it hard for new developers to learn a consistent approach.

jQueryを書いている開発者自身がどのように工夫をし、jQueryの課題を解決しようとしたかをZennで紹介しました([モダンなjQueryに挑戦してみよう](https://zenn.dev/naofumik/articles/588a62005c41e4))。

より良いStimulusの書き方の参考になると思います。ぜひご覧ください。
