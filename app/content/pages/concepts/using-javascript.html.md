---
title: JavaScriptの活用
section: Tips
layout: article
order: 060
---

## HotwireはJavaScriptが好き

Turboは場合によっては、カスタムJavaScript(アプリ固有のJavaScript)を一切書かずにモーダルを出すことができます。しかしJavaScriptを書かないで済むというのはHotwireの副作用であり、設計の意図ではありません。Hotwireの意図は"without using much JavaScript"(あまり多くのJavaScriptを使わない)ことであり、以前としてカスタムJavaScriptを書くのがHotwire流です。

実際、Hotwireを発明した37signals社のGmail様のメールアプリ(Hey.com)では、百数十個のStimulus Controllerが使用されているようです。大切なことは不必要なJavaScriptを書かないことです。

## HotwireのJavaScriptは"sprinkles"

HotwireはTurboとStimulusから構成されています。

* Turboはサーバとの通信を必要とします。そしてサーバは通常はHTMLを返します
* Stimulusはサーバとの通信を(通常は)行いません

したがって基本的な使い分けは下記のようになります

* サーバとの通信が必要ないもの（例えば静的なアコーディオンやプルダウンメニューの開閉など）はStimulusで十分です
* HTMLの大きな書き換えを必要とする処理は通常はTurboを使います
* サーバから最新の情報が必要な場合はTurboを使います

状況に応じて、Turboを使うかStimulusを使うかの判断が必要です。

![When to use Turbo or Stimulus](content_images/turbo-vs-stimulus.webp)
