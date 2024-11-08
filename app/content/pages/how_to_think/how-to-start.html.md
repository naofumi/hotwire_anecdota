---
title: Hotwire開発の考え方
section: Tips
layout: section
order: 030
---

## HotwireはMVP的に作る

[「MVP（Minimum Viable Product）の意味を理解する。そして、なぜ私はEarliest Testable / Usable / Lovableを好むのか。」](https://www.ankr.design/designtips/making-sense-of-mvp)という有名なブログポストでCrisp DesignのHenrik Kniberg氏はアジャイル開発やリーン開発について解説をしています。

![mvp-not-like-this.png](content_images/mvp-not-like-this.png)

これがHotwireによる開発の本質だと私は考えています。

## MVPを作るということ 

「顧客に対してテストができ、かつフィードバッグをもらえるような、思いつく限りで最も小さなものを提供する」のがMVPです。「ただただ学ぶ」ためのものをまず作ります。

そして多くのケースでは「顧客」はクライアントではなく、開発者自身だったり、PMだったり、あるいはデザイナーだったりします。とにかく動くものを先に作ります。

> カギとなる問いは「一番コストをかけずに早く学べる方法は何か？」である。スケートボードよりもさらに前に、何かを提供することはできるだろうか？バスのチケットはどうだろう？

そして**ウェブフロントエンドにおいて、一番コストがかからないのはMPAを作ることです。** だからほとんどのケースにおいて、HotwireはMPAから開発を始めるのが良いでしょう。

以下、具体例を見ていきましょう

## 「いいね」ボタンを作る

