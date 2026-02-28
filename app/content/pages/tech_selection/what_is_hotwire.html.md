---
title: Hotwireとは何か？
section: Introduction
layout: article
order: 10
published: true
---

Hotwireの技術的な特徴を紹介します。

## Hotwireは高度なUI/UXが実現可能 --- hotwire-has-great-ui-ux

Hotwireは非同期通信等を活用した優れたUI/UXが作れます。以下の有名ウェブサイトはHotwireもしくはHotwireと近縁の技術を使い、優れたユーザ体験を実現しています

* [クックパッド](https://cookpad.com/jp)
* [GitHub](https://github.com/)
* [Basecamp(プロジェクト管理)](https://basecamp.com/)

## HotwireでNext.jsと同等以上のUI/UXが実現可能 --- hotwire-has-better-ui-ux-than-nextjs

HotwireとNext.jsで同じUIを作ると、しばしばHotwireの方が良いUI/UXになります。

* [デモサイト](https://hotwire-n-next.castle104.com/)

## HotwireはSPA --- hotwire-is-an-spa

HotwireはSPAですので、以下の特徴があります。

* ページリロードを行わずにページ内容を動的に更新できます
* ページ間でDOMのステートを維持できます
* 動的なモーダルやスライドメニューなど、インタラクティブなUIコンポーネントが作れます
* キャッシュなどを活用した高速なレスポンスが実現できます

HotwireはSPAです。ReactやNext.jsと同じです。**基盤技術が同じですので、Hotwireを使えばReactやNext.jsと同じことができます**。

## HotwireはJSON APIが不要 --- hotwire-needs-no-json-api

HotwireではJSON APIを挟んでサーバとブラウザ間でデータでやり取りする必要がありません。その効果は絶大です。

* Reactの場合は、ブラウザにJSON APIでデータを送ります。このために以下のものが必要です
   * JSON API送信機能(サーバ)
   * Open API (Swagger)のドキュメント
   * JSON API受信機能(ブラウザ)
   * データ変換やビジネスロジック(ブラウザ)
* Hotwireの場合はERBファイルがビジネスロジックを含むモデルを直接扱います。上記のものがすべて不要になります
* 作るものが少ないので、当然ながら**Hotwireは開発速度が圧倒的に速くなります**。ビジネスとして成功したウェブサービスはしばしば数百ページのサイトになりますが、このようなケースでは非常に有利になります
* スタートアップなどでリソースが少なく、小さいチームで開発する場合に向いています

## HotwireはSSR --- hotwire-is-ssr

HotwireはサーバでHTMLをレンダリングしてブラウザに送信するSSR(Server-side Rendering)です(２ページ目からSPA)。Next.jsなどと同じですし、話題のReact Server Components (RSC)と類似した技術です

* 初回ページのロードはSPAより速いです
* **SEOに有利です**
* 画面がチラつきにくく、SPAよりもUI/UXが優れています
* React系のSSRと異なり、hydrationをしなくてもすぐにインタラクティブになります

## Hotwireは安定したテクノロジー --- hotwire-is-stable

頻繁に入れ替わり、破壊的変更も多いReact/Vue/Next.js/Nuxt.jsと比較して、Hotwireは安定した基盤に基づいています。**数年後にバージョンアップデートに苦しむことはありません**

* Hotwireは2010年に公開された[Rails UJS](https://github.com/rails/jquery-ujs)および2012年に公開された[Turbolinks](https://github.com/turbolinks/turbolinks-classic)をベースとした技術です
* Hotwireは2021年にTurbolinksとRails UJSの機能を[Turbo](https://github.com/hotwired/turbo)に統合し、[Stimulus](https://github.com/hotwired/stimulus)を合わせたものです。2021年以降、APIはほどんと変わっていません

## HotwireはjQueryからの移行が簡単 --- jquery-to-hotwire

jQueryとHTMLテンプレートで書かれたウェブサービスをReact等でリプレイスするのは多変なプロジェクトです。特にビジネスとして成功し、数百ページから構成されたサイトをすべてReactにするのは至難の業で、多くの場合はReact + jQueryのハイブリッドとして残っています。

HotwireはjQueryと親和性が高いので、jQueryのサイトをモダンにして、メンテナンス性を向上するのに適しています。

## Hotwireは習得が簡単 --- hotwire-is-easy-to-learn

ReactやVueと異なり、Hotwireは伝統的なウェブ技術をベースにしています。新しいコンセプトを学ばなくても容易に習得できます。Wordpress等でサイトを作っていた人ならすぐに理解できます。Async/awaitなどのPromiseやステート管理、高階関数などの複雑な話は出てきません。

HTML/CSS/JavaScriptの基礎を理解し、JavaScriptのイベント処理等を理解していれば、Hotwireは十分に書けます。

## Hotwireはモバイルアプリが作れる --- hotwire-is-for-native

Hotwireは[ネイティブアプリの作成](https://native.hotwired.dev)にも使用できます。
