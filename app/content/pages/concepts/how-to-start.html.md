---
title: HotwireはMPAから作る
description: "Hotwireで最初から完成形のインタラクティブUIを目指さず、まず単純なMPAとして機能を成立させ、必要に応じて段階的に改善する開発手順を紹介します。いいねボタンをTurbo Drive、Turbo Streams、楽観的UIへ発展させる例を通じて、複雑さを少しずつ追加する考え方を示します。"
section: Tips
layout: article
order: 20
published: true
---

HotwireのUIを作る時、**最初から完成したUI/UXを作ろうとしない**ことが大切だと私は考えています。まずは簡単なMPAで機能を実現して、後からUI/UXを改善します。

まだUIデザインが固まっていない場合はもちろんですが、固まっている場合でも段階的にそれに近づけていく方がやりやすいと思います。

## MPAから始める具体例 --- example

[「いいね」ボタンの解説](/examples/like_button)が良い例です。以下のことを順番通りに解説しています。

1. 最初にMPA (Turbo Drive)バージョンを作る
2. Turbo Streamsバージョンを作る
3. 楽観的UI (Optimistic UI)バージョンを作る

詳細は解説記事をご確認していただきたいと思いますが、**段階的にUI/UXを改善する**感覚をわかっていただければ良いと思います。

