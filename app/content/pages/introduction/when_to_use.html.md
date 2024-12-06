---
title: Hotwireはどいういう時に向いているか？
section: Introduction
layout: article
order: 40
published: true
---

## 優れたUI/UXを提供したい場合 --- when-you-need-good-ui

「Hotwireは難しいUIはできない」、「エンドユーザ向けの画面はやはりReactを使った方が良い」という話はよく聞きます。**これは大きな誤りです**。[「フロントエンドエンジニアのためのHotwire入門」](https://hotwire-n-next.castle104.com)で実証している通り、**特殊なケースでない限りHotwireがNext.jsに劣ることはありません**。個別に見ていくと、[Hotwireの方がNext.jsよりむしろ優れているケースも珍しくありません](https://hotwire-n-next.castle104.com/)。

**優れたUI/UXを提供したい場合、Hotwireは良い選択肢です**。

## 小さいチームで開発する場合 --- when-team-is-small

HotwireはJSON APIがありません。APIの両岸でフロントエンドエンジニアとバックエンドエンジニアが川の両岸で対峙するのではなく、互いに細かく連携し、自主的に協力し合いながら製品を作り上げていくチームに向いています。

Hotwireが生まれた[37signals社のチームサイズは３名](https://medium.com/signal-v-noise/threes-company-df77db78d1af)です。デザイナー１名とプログラマー２名。37signalsはこのチームでフロントエンドもバックエンドも、ウェブアプリとモバイルアプリも作ります。そういうチームではHotwireが最適です。

## デザイナーもコーディングする場合 --- when-designers-code

多くのウェブデザイナーはJavaScriptやjQueryのコーディングできます。特にWordpressなどを駆使して店舗のウェブサイトやマーケティングサイトを制作するウェブデザイナーの多くは、自分で動きをコーディングします。

jQueryができれば、Hotwireはできます。Reactと異なり、新しいコンセプトを理解しなくても、JavaScriptをしっかり勉強し直さなくても、Hotwireは学習できます。

ウェブデザイナーを活用したい場合、Hotwireは最適です。

## オブジェクト指向UIを目指す場合 --- when-you-want-to-do-ooui

OOUI(オブジェクト指向UI)の世界では、[デザイナーやフロントエンドエンジニアもオブジェクトやその属性を理解している必要があります](https://techblog.yahoo.co.jp/entry/2023011830396626/)。理解していなければ良いデザインが作れません。

**Hotwireを使うとフロントエンドとバックエンドの距離は一気に縮まります**。フロントエンドエンジニアもバックエンドのデータ構造を常に確認します。双方でデータ構造の理解が深まり、議論できます。これがオブジェクト指向UIの成功に繋がっていくでしょう。

## 社員のモチベーションやエンゲージメントを高めたい場合 --- motivation

**分業はモチベーションやエンゲージメントにネガティブに作用します**。成果物に対するコミットメントが薄くなります。

Hotwireでデザイナーからバックエンド・インフラが一丸になれば、社員のモチベーションを高める効果が期待できます。

## Reactも使い、良いとこどりする場合 --- best-of-both-world

[HotwireのページにReactを埋め込むのは簡単です](/other_libraries/using_with_react)。[Reactの公式サイトによると](https://ja.react.dev/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)、Facebookも長らくこの使い方がメインでした。Apple StoreなどもMPAのページにReactを埋め込んでいます。Hotwireを使っていてもReactを埋め込むことは問題なくできます。

例えば**CRUD画面をRuby on Railsで高速に開発し、高度なインタラクティビティが要求される箇所だけは慣れたReactを使うこともできます**。良いとこどりができます。

私たちの目的は良いUI/UXを作ることであって、Hotwire vs. Reactのどちらか一方を選定をすることではありません。良いとこどりできる場合は積極的にやりましょう。

![apple-store.webp](content_images/apple-store.webp "max-w-[500px] mx-auto")

