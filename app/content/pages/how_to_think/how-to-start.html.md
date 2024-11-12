---
title: HotwireはMVPのMPAから作る
section: Tips
layout: section
order: 010
published: true
---

## MVPとは --- start-with-an-mvp 

[「MVP（Minimum Viable Product）の意味を理解する。そして、なぜ私はEarliest Testable / Usable / Lovableを好むのか。」](https://www.ankr.design/designtips/making-sense-of-mvp)という有名なブログポストでCrisp DesignのHenrik Kniberg氏はアジャイル開発やリーン開発について解説をしています。

これはHotwireにも当てはまります。**最初から完成したUI/UXを作ろうとしないことが大切です。あえて簡単すぎるものから作るぐらいがちょうど良いぐらいです。**

![mvp-not-like-this.png](content_images/mvp-not-like-this.png)


## MVPを作るということ --- creating-an-mvp

「顧客に対してテストができ、かつフィードバッグをもらえるような、思いつく限りで最も小さなものを提供する」のがMVPです。「ただただ学ぶ」ためのものをまず作ります。

そして多くのケースでは「顧客」はクライアントではなく、開発者自身だったり、PMだったり、あるいはデザイナーだったりします。とにかく動くものを先に作ります。

> カギとなる問いは「一番コストをかけずに早く学べる方法は何か？」である。スケートボードよりもさらに前に、何かを提供することはできるだろうか？バスのチケットはどうだろう？

そして一番コストがかからないのは**MPAを作ることです。** だからほとんどのケースにおいて、HotwireはMPAから開発を始めるのが良いでしょう。

## 具体例 --- example

具体例は「いいね」ボタンを作るで紹介しています。

1. 最初にMPAを作る
2. Turbo Streamsで部分置換をする
3. 楽観的UI (Optimistic UI)として実装する

詳細はそちらを確認していただきたいと思いますが、一番先にMVPを作り、段階的にUI/UXを改善する感覚をわかっていただければ良いと思います。

## 私の場合 --- personal-experience

私の場合ですと、「簡単だから最初からTurbo FramesやTurbo Streamsで作ろう」って思ってしまうことが多いのですが、しばらくすると混乱することがあります。そのような場合はMPAに立ち返るとうまくいくことがよくあります。

小さいステップで段階的に開発するとうまくいくようです。
