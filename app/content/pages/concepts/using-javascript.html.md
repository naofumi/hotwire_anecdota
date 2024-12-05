---
title: JavaScriptは使おう！
layout: article
order: 5
published: true
---

## HotwireはJavaScriptが好き --- hotwire-loves-javascript

Turboは場合によっては、カスタムJavaScript(アプリ固有のJavaScript)を一切書かずにモーダルを出すことができます。しかしJavaScriptを書かないで済むというのはHotwireの副作用であり、設計の意図ではありません。Hotwireの意図は"without using much JavaScript"(あまり多くのJavaScriptを使わない)ことであり、多少の**カスタムJavaScriptを書くのがHotwire流です**。

実際、Hotwireを発明した37signals社のGmail様の[メールアプリ(Hey.com)](https://www.hey.com)では、百数十個のStimulus Controllerが使用されているようです。**大切なことは不必要なJavaScriptを書かないことであり、多少のJavaScriptは書くべきです**。

## 大切なことは良いUI/UXを作ること --- the-important-thing-is-ui

Hotwireは37signalsをはじめ、[Cookpad](https://techlife.cookpad.com/entry/2024/11/13/130000)の一般ユーザ向けのBtoCビジネスで使用されています。**UI/UXで決して妥協ができないところも使われているがHotwireです**。

UI/UXを犠牲にしてでもJavaScriptの量を減らすのはHotwireのやり方ではありません。

**大切なのはあくまでも良いUI/UXを実現することです**。
