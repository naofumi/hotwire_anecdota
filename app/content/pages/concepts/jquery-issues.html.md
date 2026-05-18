---
title: Stimulusが解決したjQueryの問題
layout: article
order: 180
published: true
---

Reactを推奨する人の多くはjQueryコードのメンテナンスの難しさを取り上げます。そしてReactがこれを解消したと主張します。今まで実現困難だったUI/UXがReactで可能になったのではなく、[Reactがルール(単方向データフロー)を強制することで一部の複雑なコードが整理された](/introduction/complex_ui)と言って良いと思います。

一方でDHH自身も[Stimulusの目的はコードスタイルを統一し、再利用を促すことだった](https://stimulus.hotwired.dev/handbook/origin)としています。

> Prior to Stimulus, Basecamp used a smattering of different styles and patterns to apply these sprinkles. Some code was just a pinch of jQuery, some code was a similarly sized pinch of vanilla JavaScript, and some again was larger object-oriented subsystems. They all usually worked off explicit event handling hanging off a data-behavior attribute.
>
> While it was easy to add new code like this, it wasn’t a comprehensive solution, and we had too many in-house styles and patterns coexisting. That made it hard to reuse code, and it made it hard for new developers to learn a consistent approach.

ただしjQueryも複雑なスパゲッティコードに甘んじていたわけではなく、各開発者はそれぞれにいろいろな工夫をしていました。これについては([モダンなjQueryに挑戦してみよう](https://zenn.dev/naofumik/articles/588a62005c41e4))で紹介していますのでご覧ください。

良いjQueryの書き方と良いStimulusの書き方はかなり共通していると思います。ぜひご覧ください。
