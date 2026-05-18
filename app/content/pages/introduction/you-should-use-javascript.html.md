---
title: JavaScriptは積極的に使おう！
layout: article
order: 50
published: true
---

## HotwireでJavaScriptを使わないのは誤解 --- the-myth-of-not-using-javascript

**Hotwireを使えばJavaScriptを書かなくても良いというのは大きな誤解です**。Hotwireの入門書の多くはStimulusのことを字数を多く割いておらず、JavaScriptなしでUIを作れることを全面に出しています。しかし**JavaScript無しで書くのはHotwireの本来の使い方ではありません**。

Hotwireの意図は"without using much JavaScript"(あまり多くのJavaScriptを使わない)ことです。Reactのように何メガバイトものカスタムJavaScriptをブラウザの送ることには否定的ですが、一方で**多少のカスタムJavaScriptを書くのは間違いなくHotwire流です**。

実際、Hotwireを発明した37signals社のGmail様の[メールアプリ(Hey.com)](https://www.hey.com)では、百数十個のStimulus Controllerが使用されているようです。**大切なことは不必要なJavaScriptを書かないことであり、多少のJavaScriptは（当然）書くべきです**。

![Hey Controllers](content_images/hey-controllers.webp "mx-auto w-[500px]")

## 大切なことは良いUI/UXを作ること --- the-important-thing-is-ui

Hotwireは[37signalsをはじめ](/introduction/key_difference_between_hotwire_and_react#differences-in-ui)、[Cookpad](https://techlife.cookpad.com/entry/2024/11/13/130000)の一般ユーザ向けのBtoCビジネスで使用されています。**UI/UXで決して妥協ができないところも使われているがHotwireです**。

UI/UXを犠牲にしてでもJavaScriptの量を減らすのはHotwireのやり方ではありません。**優先するのはあくまでも良いUI/UXを実現することです**。積極的にJavaScriptを使う必要はありますので、Stimulusの使い方に慣れることを強くお勧めします。

なおHotwireで使用するJavaScriptは、Reactに比べれば非常に簡単です。非同期処理を書くのは非常に稀ですし、高階関数もあまり書きません。これについては別途[HotwireのJavaScriptは簡単](/introduction/hotwire_javascript_is_simple)で紹介しています。
