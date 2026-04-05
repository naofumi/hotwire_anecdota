---
title: Hotwireの技術的特徴
layout: article
order: 20
published: true
---

## はじめに --- introduction

ここではHotwireの技術的特徴を解説します。技術選定などの際に参考にしてください。

## HotwireはSPA --- hotwire-is-an-spa

HotwireはSPAですので、以下の特徴があります。

* ページリロードを行わずにページ内容を動的に更新できます
* ページ間でDOMのステートを維持できます
* キャッシュなどを活用した高速なレスポンスが実現できます

HotwireはSPAです。ReactのSPA同じです。**基盤技術が同じですので、Hotwireを使えばReactと同じことができます**。

## HotwireはJavaScriptを使う --- hotwire-uses-javascript

多くに人はHotwireはJavaScriptを書かなくてもUIを作る技術だと勘違いしています。
これは大きな間違いです。HotwireはJavaScriptを使います。

* 動的なモーダル、ライドメニュー、複雑なコンポーネントなど、インタラクティブなUIコンポーネントが作れます
* ReactもHotwireも結局はJavaScriptでしかありません。やりやすさに多少の違いはありますが、やれることは全く同じです。

## HotwireはJSON APIが不要 --- hotwire-needs-no-json-api

HotwireはReact SPAよりも遥かに少ない工数で作成できます。また遥かに単純な構造になります。これはJSON APIを挟んでサーバとブラウザ間でデータでやり取りしなくて良いからです。

* Reactの場合は、ブラウザにJSON APIでデータを送ります。このために以下のものが必要です
   * JSON API送信機能(サーバ)
   * Open API (Swagger)のドキュメント
   * JSON API受信機能(ブラウザ)
   * データ変換やビジネスロジック(ブラウザ)
* Hotwireの場合はERBファイルがビジネスロジックを含むモデルを直接扱います。上記のものがすべて不要になります
* 作るものが少ないので、当然ながら**Hotwireは開発速度が圧倒的に速くなります**。ビジネスとして成功したウェブサービスはしばしば数百ページのサイトになりますが、このようなケースでは非常に有利になります
* スタートアップなどでリソースが少なく、小さいチームで開発する場合に向いています

## HotwireはSSR --- hotwire-is-ssr

HotwireはサーバでHTMLをレンダリングしてブラウザに送信するSSR(Server-side Rendering)です(２ページ目からSPA)。Next.jsなどと同じです。React Server Components (RSC)と類似した技術です

* 初回ページのロードはSPAより速いです。
* **SEOに有利です**。
* 画面がチラつきにくく、SPAよりもUI/UXが優れています。

## HotwireにReactを埋め込むことができる --- you-can-embed-react-in-hotwire

[ReactをHotwire/ERBに簡単に埋め込めます](/other_libraries/using_with_react)。

* Hotwire/ERBとReactの資産を活かすことができます。
  * ERBがもたらす作業工数の少なさを活かしながら、Reactのコンポーネントを使うことができます。 
* 優れたUI/UXが実現できます。[Appleのウェブサイトなどで使用されている方法](/introduction/using_with_react)を別途解説していますので、ご覧ください。

## Hotwireは歴史の長い安定した技術 --- hotwire-is-stable

Hotwireは安定したライブラリですので、**数年後にバージョンアップデートに苦しむことはありません**

* Hotwireは2010年に公開された[Rails UJS](https://github.com/rails/jquery-ujs)および2012年に公開された[Turbolinks](https://github.com/turbolinks/turbolinks-classic)をベースとした技術です
* Hotwireは2021年にTurbolinksとRails UJSの機能を[Turbo](https://github.com/hotwired/turbo)に統合し、[Stimulus](https://github.com/hotwired/stimulus)を合わせたものです。2021年以降、APIはほどんと変わっていません

## HotwireはjQueryからの移行が簡単 --- jquery-to-hotwire

* HotwireはjQueryと親和性が高く、共存できます。
* jQueryのサイトを徐々にHotwire化して、メンテナンス性を向上できます。

## Hotwireはモバイルアプリが作れる --- hotwire-is-for-native

* Hotwireは[ネイティブアプリの作成](https://native.hotwired.dev)にも使用できます。

## Hotwireは高度なUI/UXが実現可能 --- hotwire-has-great-ui-ux

Hotwireは非同期通信等を活用した優れたUI/UXが作れます。以下の有名ウェブサイトはHotwireもしくはHotwireと近縁の技術を使い、優れたユーザ体験を実現しています

* [クックパッド](https://cookpad.com/jp)
* [GitHub](https://github.com/)
* [Basecamp(プロジェクト管理)](https://basecamp.com/)

## HotwireでNext.jsと同等以上のUI/UXが実現可能 --- hotwire-has-better-ui-ux-than-nextjs

HotwireとNext.jsで同じUIを作ると、しばしばHotwireの方が良いUI/UXになります。

* [デモサイト](https://hotwire-n-next.castle104.com/)

