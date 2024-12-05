---
title: あなたはHotwireを採用するべきか？
section: Introduction
layout: article
order: 50
published: true
---

## ReactとHotwireのどっちを採用するべきか？ --- which-should-i-choose

ReactとHotwireのどっちを採用するべきかは簡単な話ではありません。作ろうとしているウェブアプリの仕様・性質、チームの構成、チームの大きさ、予算や納期、ビジネスモデルが確立しているか否かなど、さまざまな要因を含めた総合的な判断が必要です。

そもそも二者択一にする必要もありません。[ReactとHotwireは綺麗に共存できます](/other_libraries/using_with_react)。

とはいえ、もし選択を迫られているのならば、このサイトでお手伝いできるのは、**正確性と完全性を持った情報の提供です**。残念ながら、このような情報は思いの外に見つかりにくいです。

ここでは判断の際に考慮すべきポイントについて、参考になる情報をリストアップしました。

### 実績について --- track-record

* Hotwireは[37signalsのメールアプリ Hey](https://www.hey.com)を作るために開発されたライブラリです。また[37signalsのプロジェクト管理システム Basecamp](https://basecamp.com)もこの祖先となる技術で作られています
* [CookpadはHotwireを採用](https://techlife.cookpad.com/entry/2024/11/13/130000)しています
* GitHubはHotwireの先祖となる技術(PJAX)で作られ、Turbo/Hotwire系の技術を使用して来ました。現在もTurboを使用しています。一部のページの画面の一部分でReactを使用しています
    * Hotwireのベースは少なくとも2012年のGitHubのPJAXに遡れます。10年以上、世界で有数のアクセス数のあるサイトでの実績があるコンセプトと言えます

この他にもHotwireは多くのプロジェクトで使われています。BtoB向けの管理画面に限らず、BtoCでも積極的に採用されています。

### 類似したアプローチ --- similar-technologies

* Hotwireに類した技術としては[HTMX](https://htmx.org), [LiveWire(Laravel)](https://laravel-livewire.com), [LiveView(Elixir/Phoenix)](https://www.phoenixframework.org)等が近年話題になっています
* 例えば[HonoにHTMXを載せたスタック](https://blog.yusu.ke/hono-htmx-cloudflare/)なども面白いです

### ReactとHotwireの共存 --- react-with-hotwire

* [ReactとHotwireを共存させるのは簡単です](/other_libraries/using_with_react)。コード例をご覧ください
* ReactとHotwireは共存できますので、ReactをとるかHotwireをとるかの二者択一は不要です。簡単にスタートできるHotwireでプロジェクトを開始し、UI/UXにこだわる箇所でReactを使うこともできます

### 作れるUI/UXの完成度について --- ui

* ReactとHotwireはどちらもHTML/CSS/JavaScriptを使っています。HTML/CSS/JavaScriptを使ってできることであるならば、結局どちらも同じレベルでできます
* **Hotwireを使うことで、React/Next.jsと同等以上のUI/UXが実現できます**。これについては、[フロントエンドエンジニアのためのHotwire入門](https://hotwire-n-next.castle104.com)で実証しています

### 学習コストについて --- learning

* Reactを使うためには、当たり前ですがReactを学ぶ必要があります。これは決して簡単ではないと一般に言われています。**難しさの最大のポイントは、JavaScriptをしっかり理解する必要があること**と[言われています](/opinions/why_is_react_difficult)
* Reactをはじめとしたフロントエンドフレームワークは頻繁にアップデートされ、**React/Next.jsのServer Components, Server Actions, App Routerなどはコンセプト自身が大きく変更されたりします**。メンテナンスコストについては、JavaScript系のライブラリは一抹の不安を覚えます
* **Hotwireは2021年に登場しましたが、ベースとなる技術は2012年と大きく変わっていません**。React系と比較して、新しいコンセプトを学び直すコストがかからないことが期待できます
* Hotwireでは、フロントエンド担当者もRubyのメソッド呼び出しや制御構造を学び、バックエンドのデータ構造についてもある程度理解する必要があります。[OOUIの視点で考えれば](https://techblog.yahoo.co.jp/entry/2023011830396626/)、これはむしろプラスとも言えます。
* RubyはJavaScriptと構文が似ていて、学習しやすい言語です

### エコシステム --- ecosystem

* 一方でJavaScriptライブラリについては、Reactを必要としないものが充実しています。[Chart.js](https://www.chartjs.org), [Interact.js](https://interactjs.io), [Tiptap](https://tiptap.dev)を含め、Reactなしでも問題なく使えます（むしろReact用のラッパーを使う場合は、ラッパー自身がしっかりメンテナンスされないリスクも考慮が必要です）
* ReactはUIコンポーネントライブラリーなどが充実しています。それに対してHotwireはまだキャッチアップ段階ですが、[Shadcn/ui on Rails](https://shadcn.rails-components.com)など、有望なプロジェクトが多く出てきています

### 作りやすさについて --- ease-of-buiding

* **認証については、Hotwireの場合はMPA以来のかなり枯れたCookie技術を使います**。実装のためのライブラリや技術資料、ノウハウ、セキュリティ上の課題は簡単に見つかります。それに対してReactの場合は多数の認証方式が考えられます。Cookieを使うか、JWTを使うか、JWTをどこに保存するかなどを検討する必要があります
   * Reactの世界では簡単のためにAuth0やCognitoなどの外部認証を使うことが多いようです
   * Hotwireの場合にAuth0やCognitoを使うこともできますが、むしろ枯れたDeviseを使う方が圧倒的に簡単です

### 作らなければならないパーツ数 --- number-of-parts

* Reactではサーバからデータを取得するためのJSON APIが追加で必要になります。**Hotwireの場合はJSON APIは不要です**
    * JSON APIの変更はフロントエンドとバックエンドが連携して進める必要があります。**HotwireはJSON APIが不要になります**ので、一人のエンジニアで素早く変更が可能です
* クライアント側でルーティングをする場合はこれを実装する必要があります。サーバ側にももちろんルータはありますので、ルータを合計で２つ作ることになります
* Next.jsなどをBFF (Backend For Frontends)として使う場合も考えられます。この場合はサーバを追加する必要がありますので、管理するものが増えます。（つまり２台のサーバを管理する必要があります）

### 組織との適合性 --- organization

いわゆる[コンウェイの法則](https://bliki-ja.github.io/ConwaysLaw)の話になります

* JSON APIがあるとフロントエンドチームとバックエンドチームの独立性が保ちやすくなります。JSON APIが固まってしまえば（事前に固定することは容易なことではありませんが）、フロントエンドとバックエンドのコミュニケーションは最小化できます。この最も極端な例はGraphQLです。GraphQLであれば、理論上は個々のJSON APIを協議することすら不要にできます
* Hotwireを使う場合は、フロントエンドチーム（デザイナー）とバックエンドチームは同じERBファイルを編集します。そのため密に連携する必要があります
* Hotwireを使うチームでは、フロントエンド専任がいないケースも多々あります
* 37signalsでは小さいチームでウェブ版とモバイルアプリ版双方の製品を作ります。37signalsのチームは2-3名です。Hotwireは小さいチームでの開発に適していると言えるでしょう
