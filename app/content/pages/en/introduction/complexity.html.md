---
title: Hotwireは複雑さの排除
section: Introduction
layout: article
order: 100
---

## フロントエンド開発は複雑 --- complexity

コンピュータの中の世界は合理的で整合性のあるロジックの世界です。論理の世界です。しかし、我々が住んでいる現実世界はそうはいきません。我々は人間であり、人間の世界に住んでいます。不完全で複雑で、思いつきや感覚が圧倒的に支配しています。

フロントエンドの仕事はロジックの世界と現実世界を繋げることです。そしてユーザインタフェースとは、不完全な人間の世界を、合理的で整合性のあるロジックの世界に繋げるものです。複雑になりやすいのは至極当然のことです。

jQuery, React, Hotwireなどが生まれたのはこのような背景があってのことです。結局はHTML/CSS/JavaScriptになるので、やれること自体には大差はありません。しかしフロントエンドの複雑さをどのように制御するかにおいて、それぞれに異なる進化をしてきました。

## 複雑さを排除するために生まれたHotwire --- hotwire-eliminates-complexity

Hotwireが生まれる前、非同期的な画面の部分更新をする技術として、下記の２つがRailsで提供されていました。

* **[Unobtrusive Javascript(控えめなJavaScript)](https://railsguides.jp/v4.2/working_with_javascript_in_rails.html#「控えめなjavascript」):**
* **[Server-generated JavaScript Responses](https://railsguides.jp/v4.2/working_with_javascript_in_rails.html#シンプルな例):** 詳しくは [Server-generated JavaScript Responses](https://signalvnoise.com/posts/3697-server-generated-javascript-responses):

特に後者のServer-generated JavaScript Responseはサーバからブラウザに対してJavaScriptを送信するものでした。JavaScriptを使って画面の部分更新を行い、JavaScriptで複雑なロジックを書き、JavaScriptでブラウザを完全に制御できました。とても強力な反面、コードが複雑でわかりにくくなってしまいました。

Turboでは[Server-generated JavaScript Responseを無くしました](https://turbo.hotwired.dev/handbook/streams#but-what-about-running-javascript%3F)。いくら強力でも、アプリケーションコードが複雑になってしまうのではメンテナンス性に問題があります。

代わりに開発したTurbo Streamsでは、JavaScriptを書けないようにしました。そしてたった８つのDOM操作(append, prepend, before, after, replace, update, remove, and refresh)しかできないように制限しました。JavaScriptによる複雑な制御が必要ならば、それはブラウザの責務だという考え方です。Stimulusを使ってブラウザの中で処理を記述することを強制しました。

このようにHotwireは敢えて非同期通信の機能を制限し、**複雑さの排除を仕組み化しました**。[Leaky Abstraction](https://en.wikipedia.org/wiki/Leaky_abstraction)ではありますが、いざとなればゼロからJavaScriptを書くだけだという考えです。

## Reactによる複雑さの排除

公式の[Reactの流儀](https://ja.react.dev/learn/thinking-in-react)に書かれているように、Reactも複雑さを排除するためのルールが決まっています。

* UIコンポーネント階層への分割: [単一責任の原則](https://ja.wikipedia.org/wiki/単一責任の原則)に則る
* UIの状態を最小限かつ完全に表現するstate: ステートによるUI状態の管理
* 単方向データフロー: 親から子コンポーネントへと階層を下る形でのみデータを渡す

Reactはプログラミングのスタイルをルール化することで複雑さの排除を行なっています。

