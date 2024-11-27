---
title: Hotwireは学習しやすい
section: Introduction
layout: article
order: 50
---

Hotwireは学習しやすいフロントエンドフレームワークです。Reactと比べて学びやすいのはもちろんのこと、jQueryと比べてもわかりやすいと思います。

## Hotwireは高度なJavaScriptを使わない

* Reactは難しいとよく言われています。まず最初のハードルは高度なJavaScriptを使うことです
* Reactを書くためには、JavaScriptのES6記述、高階関数、async await非同期処理などの知識が必要です。これらは入門書にほとんど登場しないか、登場したとしても最後の方に紹介されるものです
* 一方のHotwireは、難しいJavaScriptはほとんど使いません。JavaScript入門チュートリアルレベルの言語機能だけ理解できていれば十分です
* 実際、百以上のStimulus Controllerを書いても、asyncを書いたことがありません。（Hotwireにまだ慣れていない人が書いたものでasyncを使ったものならみたことがあります）

## Reactは新規のコンセプトが多数

* Reactはステートを理解する必要があります。また単方向データフローを理解する必要があります。Reactの流儀に書いてある内容を理解する必要があります
* 一方のHotwireはイベントだけ知っていれば十分です。簡単なイベントハンドラを作り、DOMにCSSクラスを追加したりするのがHotwireの基本的な使い方になります

## Reactはコンセプトが頻繁に変更される

* Reactをはじめとしたフロントエンドフレームワークは頻繁にアップデートされ、React/Next.jsのServer Components, Server Actions, App Routerなど、コンセプト自身が大きく変更されたりします。長期的に使用する製品の場合、メンテナンスコストを考える必要があります
* Hotwireの系譜は2010年ごろから使われていたRailsのUJS (Unobtrusive JavaScript), SJR (Server-rendered JavaScript Responses), PJAX (Turbolinksの前進)とコンセプチ的に大きな変更がありません。以前はHTMLをJavaScriptに包んでサーバからブラウザに送ることが多かったのに対して、HotwireではHTMLをそのまま送るという程度の違いです

## Rubyは学習しやすい

* Rubyの文法はJavaScriptと同じで、C言語系のものです。よく似ています
* Rubyのメソッドは非常に丁寧に設計されており、一貫した名前と呼び出し方法になっています。非常に学習がしやすい言語です

## コーディングを学習し始めたデザイナーでも使いこなせる

* **HTML/CSSには詳しいけれども、高度なJavaScriptはイマイチ自信がない人（特にデザイナー）でもHotwireは使いこなせます**

### 作りやすさについて --- ease-of-buiding

* 認証については、Hotwireの場合はMPA以来のかなり枯れたCookie技術を使います。それに対してReactの場合はシステム構成も考慮した上で多数の認証方式が考えられます。Cookieを使うか、JWTを使うか、JWTをどこに保存するかなどを検討する必要があります
