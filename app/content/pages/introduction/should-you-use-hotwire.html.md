---
title: あなたはHotwireを採用するべきか？
section: Introduction
layout: article
order: 50
published: true
---

## ReactとHotwireのどっちを採用するべきか？ --- which-should-i-choose

ReactとHotwireのどっちを採用するべきかは簡単な話ではありません。作ろうとしているウェブアプリの仕様・性質、チームの構成、チームの大きさ、予算や納期、ビジネスモデルが確立しているか否かなど、さまざまな要因を含めた総合的な判断が必要です。

**難点は情報の正確性と完全性です。ちまたで言われている話は不正確なもののが多いです。** そこで、ここでは判断の際に考慮すべきポイントについて、参考になる情報をリストアップしました。

この情報を元に、ケースバイケースで判断していただければと思います。

### 実績について --- track-record

* Hotwireは37signalsのメールアプリ Heyを作るために開発されたライブラリです。また37signalsはプロジェクト管理システム Basecampもこの祖先となる技術で作っています
* [CookpadはHotwireを採用](https://techlife.cookpad.com/entry/2024/11/13/130000)しています
* GitHubはHotwireの先祖となる技術(PJAX)で作られ、Turbo/Hotwire系の技術を使用して来ました。現在はTurboを使用しています。一部のページの画面の一部分でReactを使用しています
    * Hotwireのベースは少なくとも2012年のGitHubのPJAXに遡れます。10年以上、世界で有数のアクセス数のあるサイトでの実績があるコンセプトと言えます

### 類似したアプローチ --- similar-technologies

* Hotwireに類した技術としてはHTMX, LiveWire(Laravel), LiveView(Elixir/Phoenix)等が近年話題になっています

### ReactとHotwireの共存 --- react-with-hotwire

* GitHubでもApple Storeでも、ReactとMPAを共存して使っています
    * GitHubはTurbo (Hotwire)を使ったページに埋め込んでいます
    * Facebookも以前はReactをMPAに埋め込んで使用していました。
* ReactとHotwireを共存させるのは簡単にできます。コード例をご覧ください
* ReactとHotwireは共存できますので、ReactをとるかHotwireをとるかの二者択一は不要です。簡単にスタートできるHotwireでプロジェクトを開始し、UI/UXにこだわる箇所でReactを使うこともできます

### 作れるUI/UXの完成度について --- ui

* ReactとHotwireはどちらもHTML/CSS/JavaScriptを使っています。HTML/CSS/JavaScriptを使ってできることであるならば、結局どちらも同じレベルでできます
* ReactやNext.jsを使えば、Hotwireよりも優れたUI/UXのページが簡単に作れるのではないかと考えがちです。しかしそんなことはありません。これについては、[フロントエンドエンジニアのためのHotwire入門](https://hotwire-n-next.castle104.com)で実証しています
* UI/UX

### 学習コストについて --- learning

* Reactを使うためには、Reactを学ぶ必要があります。これは決して簡単ではないと一般に言われています。難しさの最大のポイントは、JavaScriptをしっかり理解する必要があることと言われています
* Reactをはじめとしたフロントエンドフレームワークは頻繁にアップデートされ、React/Next.jsのServer Components, Server Actions, App Routerなど、コンセプト自身が大きく変更されたりします。長期的に使用する製品の場合、メンテナンスコストを考える必要があります
* Hotwireは2021年に登場しましたが、ベースとなる技術は2012年と大きく変わりません。React系と比較して、新しいコンセプトを学び直すコストがかからないことが期待できます
* Hotwireでは、フロントエンドはRubyのメソッド呼び出しや制御構造を学び、バックエンドのデータ構造についてもある程度理解する必要があります。ただしRubyはJavaScriptと構文が似ていて、わかりやすい言語です

### エコシステム --- ecosystem

* Reactはエコシステムが大きく、UIコンポーネントライブラリーなどが充実しています。それに対してHotwireはまだキャッチアップ段階です
* 一方でJavaScriptライブラリについては、Reactを必要としないものも充実しています。[Chart.js](https://www.chartjs.org), [Interact.js](https://interactjs.io), [Tiptap](https://tiptap.dev)を含め、Reactなしでも問題なく使えます

### 作りやすさについて --- ease-of-buiding

* 認証については、Hotwireの場合はMPA以来のかなり枯れたCookie技術を使います。それに対してReactの場合はシステム構成も考慮した上で多数の認証方式が考えられます。Cookieを使うか、JWTを使うか、JWTをどこに保存するかなどを検討する必要があります

### 作らなければならないパーツ数 --- number-of-parts

* Reactではサーバからデータを取得するためのJSON APIが追加で必要になります。Hotwireの場合は存在しないものを追加で作成することになります。JSON APIの設計、ドキュメンテーションおよびテストは煩雑ですが、これをサポートする各種ツールが用意されています
    * JSON APIの変更はフロントエンドとバックエンドが連携して進める必要があります。Hotwireはこれが不要になりますので、一人のエンジニアで素早く変更が可能です。その点、よりアジャイル向きと言えそうです
* クライアント側でルーティングをする場合はこれを作成する必要があります。サーバ側にももちろんルータはありますので、ルータを合計で２種類作ることになります
* Next.jsなどをBFF (Backend For Frontends)として使う場合も考えられます。この場合はサーバを追加する必要がありますので、管理するものが増えます

### 組織との適合性 --- organization

いわゆる[コンウェイの法則](https://bliki-ja.github.io/ConwaysLaw)の話になります

* JSON APIがあるとフロントエンドチームとバックエンドチームの独立性が保ちやすくなります。JSON APIが固まってしまえば（事前に固定することは容易なことではありませんが）、フロントエンドとバックエンドのコミュニケーションは最小化できます
* Hotwireを使う場合は、フロントエンドチーム（デザイナー）とバックエンドチームは同じERBファイルを編集します。そのため密に連携する必要があります
* Hotwireを使うチームでは、フロントエンドがいないケースも多々あります
* 37signalsでは小さいチームでウェブ版とモバイルアプリ版双方の製品を作ります。37signalsのチームは2-3名です。Hotwireは小さいチームでの開発に適していると言えるでしょう
