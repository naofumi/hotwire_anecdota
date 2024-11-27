---
title: JavaScriptは使おう！
layout: article
order: 10
published: true
---

## HotwireはJavaScriptが好き

Turboは場合によっては、カスタムJavaScript(アプリ固有のJavaScript)を一切書かずにモーダルを出すことができます。しかしJavaScriptを書かないで済むというのはHotwireの副作用であり、設計の意図ではありません。Hotwireの意図は"without using much JavaScript"(あまり多くのJavaScriptを使わない)ことであり、以前として**カスタムJavaScriptを書くのがHotwire流です**。

実際、Hotwireを発明した37signals社のGmail様のメールアプリ(Hey.com)では、百数十個のStimulus Controllerが使用されているようです。大切なことは不必要なJavaScriptを書かないことです。

## HotwireのJavaScriptは"sprinkles"

HotwireのJavaScriptは"sprinkles"なのですが、"sprinkles"がどういう意味かがわかりにくいと思います。下記が参考になると思います

* [「TurboとStimulus: どっちを使う？」](/how_to_think/turbo-or-stimulus)が
