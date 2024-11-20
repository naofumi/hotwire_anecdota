---
title: Hotwireとは何か？
section: Introduction
layout: article
order: 3
published: true
---

## HotwireはSPA --- hotwire-is-an-spa

Hotwireを使うと下記のことができます。

* ページリロードを行わずにページ内容を動的に更新できます
* 動的なモーダルやスライドメニューなどのインタラクティブなUIコンポーネントが作れます
* キャッシュなどを活用した高速なレスポンスが実現できます

これはReactやNext.jsの特徴と言われていものと同じです。つまりHotwireを使うと、ReactやNext.jsで作成されたものと同等のことできます。

## Hotwireはシンプル --- hotwire-is-simple

* Hotwireでは主にサーバでHTMLを生成します。Next.jsのSSRやServer Componentと同じです
    * このため、**ブラウザにデータを送信するためのJSON APIの作成が不要です** 
* Hotwireは直接DOMを変更します
    * Reactは常にステートを介さないDOM変更は原則禁止ですが、Hotwireの場合はシンプルな場合はステートを介さなくても良いです
    * 基本的に**ステート管理をあまり意識する必要がありません**
* 複雑なUI/UXを作るときに初めてStimulusのステート管理を学べば十分です 

## HotwireのJavaScriptは簡単 --- hotwire-javascript-is-simple

* Reactを書くためには、JavaScriptのES6記述、高階関数、async await非同期処理など、高いレベルの知識が必要です。React自身も難解ですが、その前にJavaScriptの難解な機能を理解する必要があります
* Hotwireはこれらをほとんど使いません。JavaScript入門チュートリアルレベルの言語機能だけ理解できていれば十分です
* **HTML/CSSには詳しいけれども、高度なJavaScriptはイマイチ自信がない人（特にデザイナー）でもHotwireは使いこなせます**

## HotwireはReactとは異なります

* Hotwireの考え方はReactとは多くの点で異なります
* Hotwireは従来のMPAを拡張する考え方です。先にHTMLを考えます
* Reactは先にステートを考えます。先にステートがあり、これをHTMLに反映させます

Reactの考え方は公式サイトの[Reactの流儀](https://ja.react.dev/learn/thinking-in-react)で解説されています。またHotwireとReactのアプローチの違いについては[Hotwire, React, jQueryのアプローチ](/how_to_think/approach)で解説しています。

ReactとHotwireの考え方が分岐した歴史については[Hotwireの歴史](/introduction/history)で解説しています。
