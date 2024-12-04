---
title: HotwireはMVPのMPAから作る
section: Tips
layout: article
order: 10
published: true
---

## MVPとは --- start-with-an-mvp 

[「MVP（Minimum Viable Product）の意味を理解する。そして、なぜ私はEarliest Testable / Usable / Lovableを好むのか。」](https://www.ankr.design/designtips/making-sense-of-mvp)という有名なブログポストでCrisp DesignのHenrik Kniberg氏はアジャイル開発やリーン開発について解説をしています。

これはHotwireにも当てはまります。**最初から完成したUI/UXを作ろうとしない**ことが大切です。**簡単なものから作るぐらいが良い**です。

![mvp-not-like-this.png](content_images/mvp-not-like-this.png)

## 具体例 --- example

[「いいね」ボタンの解説](/examples/like_button)が良い例です。以下のことを順番通りに解説しています。

1. 最初にMPA (Turbo Drive)バージョンを作る
2. Turbo Streamsバージョンを作る
3. 楽観的UI (Optimistic UI)バージョンを作る

詳細は解説記事をご確認していただきたいと思いますが、一番先にMVPを作り、段階的にUI/UXを改善する感覚をわかっていただければ良いと思います。先の手までわかるほどに慣れてくれば、ステップをスキップしても良いと思います。

しかしそれまでは段階的にUI/UXを作っていくことをお勧めします。

## 私の場合 --- personal-experience

私の場合ですと、「簡単だし、経験があるから最初からTurbo FramesやTurbo Streamsで作ろう」って思ってしまうことが多いのですが、しばらくすると頭が混乱することがあります。そのような場合はMPAに立ち返るとうまくいきます。

小さいステップで段階的に開発することが大事です。
