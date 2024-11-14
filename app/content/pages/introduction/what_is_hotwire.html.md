---
title: Hotwireとは何か？
section: Introduction
layout: article
order: 2
published: true
---

## HotwireはSPA --- hotwire-is-an-spa

Hotwireを使うと下記のことができます。

* ページリロードを行わずにページ内容を動的に更新できます
* 動的なモーダルやスライドメニューなどのインタラクティブなUIコンポーネントが作れます
* キャッシュなどを活用した高速なレスポンスが実現できます

これはReactやNext.jsの特徴と言われていものと同じです。つまりHotwireを使うと、ReactやNext.jsで作成されたものと同等のことできます。

## Hotwireはシンプル

* Hotwireでは主にサーバでHTMLを生成します。Next.jsのSSRやServer Componentと同じです
    * このため、**ブラウザにデータを送信するためのJSON APIの作成が不要です** 
* Hotwireは直接DOMを変更します
    * Reactと異なり、常にステートを介する必要がありません 
    * ブラウザサイドの**ステート管理をあまり意識する必要がありません**

## HotwireはReactとは異なります

* Hotwireの考え方はReactとは多くの点で異なります
* Hotwireは従来のMPAを拡張する考え方です。先にHTMLを考えます
* Reactは先にステートを考えます。先にステートがあり、これをHTMLに反映させます

Reactの考え方は公式サイトの[Reactの流儀](https://ja.react.dev/learn/thinking-in-react)で解説されています。またHotwireとReactのアプローチの違いについては[Hotwire, React, jQueryのアプローチ](/how_to_think/approach)で解説しています。

ReactとHotwireの考え方が分岐した歴史については[Hotwireの歴史](/introduction/history)で解説しています。
