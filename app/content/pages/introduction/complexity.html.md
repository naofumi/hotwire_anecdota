---
title: 複雑さの排除
section: Introduction
layout: section
order: 001
---

## フロントエンド開発と複雑さの制御 -- complexity

コンピュータの中の世界はロジックです。合理的で整合性のある世界です。ピューな論理の世界です。しかし、我々が住んでいる現実世界はそうはいきません。我々は人間であり、人間の世界に住んでいます。不完全で複雑で、思いつきや感覚が圧倒的に支配しています。

フロントエンドの仕事はコンピュータの中の世界と現実世界を繋げることです。ユーザインタフェースとは、不完全な人間の世界を合理的で整合性のあるコンピュータの世界に繋げるインタフェースです。複雑になりやすいのは至極当然のことです。

jQuery, React, Hotwireなどが生まれたのはこのような背景があってのことです。最終的にはすべてHTML/CSS/JavaScriptになるので、やれることには大差はありません。しかしフロントエンドの複雑さをどのように制御するかにおいては、大いに異なります。

## Hotwireの本質は複雑さの排除 -- hotwire-eliminates-complexity

Hotwireが生まれる前、ブラウザから非同期的にサーバ通信を行い、画面を部分更新するのに使われていたのは下記の２つの技術です。

* **[Unobtrusive Javascript(控えめなJavaScript)](https://railsguides.jp/v4.2/working_with_javascript_in_rails.html#「控えめなjavascript」):**
* **[Server-generated JavaScript Responses](https://railsguides.jp/v4.2/working_with_javascript_in_rails.html#シンプルな例):** 詳しくは [Server-generated JavaScript Responses](https://signalvnoise.com/posts/3697-server-generated-javascript-responses):

特に後者のServer-generated JavaScript Responseはサーバからブラウザに対してJavaScriptを送信するもので、画面の部分更新に限らず、複雑なロジックを書き、ブラウザを完全に制御できました。とても強力な反面、コードが複雑でわかりにくくなってしまう可能性がありました。

Turboは[強力だけれども複雑なコードを生みやすいServer-generated JavaScript Responseを無くしました](https://turbo.hotwired.dev/handbook/streams#but-what-about-running-javascript%3F)。そしてたった８つのDOM操作(append, prepend, before, after, replace, update, remove, and refresh)しかできないようにしています。JavaScriptによる複雑な制御をするのであれば、Stimulusを使ってブラウザの中でやりなさいという制限を設けています。

このようにHotwireは機能の制限と責務への集中により**複雑さの排除を仕組み化しています**。

## ReactとHotwireのどっちが複雑？ -- which-is-more-complex

ReactとHotwireのどっちが複雑かは簡単ではありません。パーツの多さでいえば間違いなくReactの方が多いのですが、だからと言って必ずしも複雑だとは言い切れません。複雑な組織やチーム構成であれば、むしろ複雑な技術の方がマッチするからです。

* ReactとRailsがデータをやりとりするためにはJSON APIが必要になります。Hotwireであればこれは不要になります
* JSON APIがあるとフロントエンドチームとバックエンドチームの独立性が保ちやすくなります。一方でHotwireを使う場合は、フロントエンドチームとバックエンドチームがより密に連携する必要があるでしょう
