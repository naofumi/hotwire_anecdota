---
title: Hotwireは複雑さの排除
section: Introduction
layout: section
order: 001
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

## ReactとHotwireのどっちが複雑？ --- which-is-more-complex

ReactとHotwireのどっちが複雑かは簡単ではありません。学習しなければならないこと、およびパーツの多さでいえば間違いなくReactの方が多いのですが、だからと言って必ずしも複雑だとは言い切れません。主に熟練者から構成された複雑な組織やチーム構成であれば、むしろ複雑な技術の方がマッチする可能性があります。

以下では複数の視点を列挙しました

* Reactを使うためには、Reactを学ぶ必要があります。これは決して簡単ではありません。一方でHotwireを使うにはHotwireを学習する必要はありません。JavaScriptすら必須ではありません。MPAが書けるのであれば、インストールした日からHotwireの恩恵が受けられます
* ReactとRailsがデータをやりとりするためにはJSON APIが追加で必要になります。Hotwireの場合は存在しないものを敢えて作成することになります。JSON APIの設計、ドキュメンテーションおよびテストは煩雑で、これをサポートするための各種のツールが用意されています
* クライアント側でルーティングをする場合はこれを作成する必要があります。サーバ側にもルータはありますので、ルータが合計で２種類必要になります
* JSON APIがあるとフロントエンドチームとバックエンドチームの独立性が保ちやすくなります。JSON APIが固まってしまえば（事前に固定することは容易なことではありませんが）、フロントエンドとバックエンドのコミュニケーションは最小化できます
* Next.jsなどをBFF (Backend For Frontends)として使う場合も考えられます。この場合はサーバが追加になる分、複雑さが増します。ただしフロントエンドのステート管理が簡略化できる可能性もあり、総合的な判断が必要になります
* 認証については、Hotwireの場合はMPA以来のかなり枯れたCookie技術を使います。それに対してReactの場合はシステム構成も考慮した上で多数の認証方式が考えられます。Cookieを使うか、JWTを使うか、JWTをどこに保存するかなどを検討する必要があります
* Hotwireを使う場合は、フロントエンドチームとバックエンドチームは同じERBファイルを編集します。そのため密に連携する必要があります
* フロントエンドはRubyのメソッド呼び出しや制御構造を学び、バックエンドのデータ構造についてもある程度理解する必要があります。ただしオブジェクト指向UI (OOUI)の視点から考えると、データ構造のレベルで連携することは、UIをデザインする上でプラスになりそうです。
