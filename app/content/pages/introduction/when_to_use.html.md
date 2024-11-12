---
title: Hotwireはどいういう時に向いているか？
section: Introduction
layout: section
order: 005
published: true
---

## 優れたUI/UXを提供したい場合 --- when-you-need-good-ui

**「Hotwireは難しいUIはできない」**、**「エンドユーザ向けの画面はやはりReactを使った方が良い」** という話はよく聞きます。**これは大きな誤りです**。[「フロントエンドエンジニアのためのHotwire入門」](https://hotwire-n-next.castle104.com)で実証している通り、一般的な範囲であればHotwireが劣るところはありません。Hotwireの方がむしろ優れているケースは珍しくありません。

## 小さいチームで開発する場合 --- when-team-is-small

HotwireはJSON APIがありません。APIの両岸でフロントエンドエンジニアとバックエンドエンジニアが対峙するのではなく、互いに細かく連携し、自主的に協力し合いながら製品を作り上げていくチームに向いています。

Hotwireが生まれた[37signals社のチームサイズは３名](https://medium.com/signal-v-noise/threes-company-df77db78d1af)です。デザイナー１名とプログラマー２名。37signalsはこのチームでフロントエンドもバックエンドも、ウェブアプリとモバイルアプリも作ります。そういうチームではHotwireが最適です。

## デザイナーもコーディングする場合 --- when-designers-code

ウェブデザイナーがコーディングもするケースは非常に多くあります。特にWordpressなどを駆使して店舗のウェブサイトやマーケティングサイトを制作するところでは普通です。

HotwireはMPAをベースとした技術です。HTML/CSSには精通しているけれども、React/Next.jsはよくわからないウェブデザイナーにとっても、非常に学習しやすいのではないかと思います。

## フロントエンジニアがバックエンドの学習にも積極的な場合 --- when-front-engineers-wish-to-learn-backend

OOUI(オブジェクト指向UI)の世界では、デザイナーやフロントエンドエンジニアもデータ構造を大雑把に理解している必要があります。理解していなければ良いデザインが作れません。

そのような意識がチーム内にあれば、フロントエンドエンジニアはデータ構造もRubyも理解しようとするでしょう。バックエンドエンジニアもそれを伝えようとするでしょう。こういうチームならHotwireは向いています。

## 社員のモチベーションやエンゲージメントを高めたい場合 --- motivation

分業体制は社員のモチベーションやエンゲージメントのネガティブに作用しがちです。最終成果物に対するコミットメントが薄くなります。全員がデザインからインフラまでできる必要はありませんが、技術的な垣根はなるべく取り払った方が良いのではないでしょうか？

Hotwireでデザイナーからバックエンド・インフラが一丸になれば、社員のモチベーションを高める効果が期待できます。

## いいとこ取りをしたい場合

Hotwireでも難しいUI/UXは作成できます。しかし優れたライブラリーがReact用に既に存在していることもあります。この場合、車輪の再開発は必要ありません。いいとこ取りをしましょう。

MPAのページにReactを埋め込むのは簡単です。[Reactの公式サイトによると](https://ja.react.dev/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)、Facebookも長らくこの使い方がメインでした。Apple StoreなどもMPAのページにReactを埋め込んでいます。Hotwireを使っていてもReactを埋め込むことは問題なくできます。

![apple-store.webp](content_images/apple-store.webp "max-w-[500px] mx-auto")

