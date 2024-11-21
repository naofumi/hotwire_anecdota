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

## Hotwireはセミオーダー、Reactはフルオーダー --- hotwire-semi-order-react-full-order

* Hotwireはサーバで出来上がったパーツ（HTML短編）を工事現場で繋ぎ合わせます
* Reactは工事現場で具材（JSON API）から組み立てます

Reactの方がブラウザステートに合わせて柔軟にUIを調節しやすいのですが、フロントエンドの作業は増えます。HotwireはDBに近い工場で効率的にパーツを作り、現場でパッと組み立てます。

![what-is-hotwire-hotwire.webp](content_images/what-is-hotwire-hotwire.webp "max-w-[600px] mx-auto")

![what-is-hotwire-react.png](content_images/what-is-hotwire-react.png "max-w-[600px] mx-auto")

## Hotwireは直接的、Reactは間接的

* HotwireはHTMLをサーバから受け取り、HTMLを制御します
* Reactはステートをサーバから受け取り、ステートを制御します。そして必ずステートを介して、間接的にHTMLを操作します

## とにかくHotwireはReactとは異なる

* HotwireとReactは幼稚園の時は一緒に遊んだけれども、小学校から別々の国に行った従兄弟同士みたいなものです
* 今では喋る言葉も、考え方も変わっています

![hotwire-history.webp](content_images/hotwire-history.webp "mx-auto max-w-[500px]")

Reactの考え方は公式サイトの[Reactの流儀](https://ja.react.dev/learn/thinking-in-react)で解説されています。またHotwireとReactのアプローチの違いについては[Hotwire, React, jQueryのアプローチ](/how_to_think/approach)で解説しています。


ReactとHotwireの考え方が分岐した歴史については[Hotwireの歴史](/introduction/history)で解説しています。
