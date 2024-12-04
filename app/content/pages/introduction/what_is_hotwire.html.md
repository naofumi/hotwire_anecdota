---
title: Hotwireとは何か？
section: Introduction
layout: article
order: 30
published: true
---

## HotwireはSPA --- hotwire-is-an-spa

Hotwireを使うと下記のことができます。

* ページリロードを行わずにページ内容を動的に更新できます
* 動的なモーダルやスライドメニューなどのインタラクティブなUIコンポーネントが作れます
* キャッシュなどを活用した高速なレスポンスが実現できます

つまりHotwireはSPAです。ReactやNext.jsと同じです。**基盤技術が同じですので、Hotwireを使えばReactやNext.jsと同じことができます**。

## Hotwireはシンプル --- hotwire-is-simple

* Hotwireでは主にサーバでHTMLを生成します。Next.jsのSSRやReact Server Componentと同じです
    * このため、**ブラウザにデータを送信するためのJSON APIの作成が不要です** 
* Hotwireは直接DOMを変更できます
    * Reactはステートを介さないDOM変更は原則禁止です。常にステートを介します。一方でHotwireはステートを使っても良いですし、シンプルな場合は省略しても構いません
* Hotwireは、複雑なUI/UXを作るときにStimulusの[Valuesによるステート管理](https://stimulus.hotwired.dev/reference/values)を行います

## HotwireのJavaScriptは簡単 --- hotwire-javascript-is-simple

* Reactを書くためには、JavaScriptのES6記述、高階関数、async await非同期処理など、高いレベルの知識が必要です。React自身がかなり難解であることに加えて、その前にJavaScriptも高いレベルで理解する必要があります
* Hotwireは「入門チュートリアルレベルのJavaScript」だけ理解できていれば十分です。ループや条件分岐、それとDOM属性の変更ができれば十分です。JavaScriptの難しい機能は知らなくてもHotwireは書けます
* **HTML/CSSは使いこなせるけれども、高度なJavaScriptはイマイチ自信がない人（特にデザイナー）でもHotwireは使いこなせます**

なお、本サイトはチュートリアルではありませんので、Hotwireの基本は教えませんが、別途検索していただければ見つかると思います

## Hotwireはセミオーダー、Reactはフルオーダー --- hotwire-semi-order-react-full-order

* Hotwireはサーバで出来上がったパーツ（HTML短編）を工事現場で繋ぎ合わせます
* Reactは工事現場で具材（JSON API）から組み立てます

Reactの方は現場の状況に応じて大幅な変更をする時は強力ですが、フロントエンドの作業は増えます。HotwireはDBに近い工場で効率的にパーツを作り、Turboで現場に送り、Stimulusで微調整をしながらパッと組み立てます。

![what-is-hotwire-hotwire.webp](content_images/what-is-hotwire-hotwire.webp "max-w-[600px] mx-auto")

![what-is-hotwire-react.png](content_images/what-is-hotwire-react.png "max-w-[600px] mx-auto")

## Hotwireは直接的、Reactは間接的 --- hotwire-is-direct-react-is-indirect

* HotwireはTurboでHTMLをサーバから受け取り、StimulusでHTML/CSSを制御します
* Reactはサーバからデータを受け取り、ステートに保存します。直接HTML/CSSを変更してはいけません。必ずステートを介して、間接的にHTMLを操作します

## とにかくHotwireはReactとは異なる --- hotwire-and-react-are-different

* HotwireとReactは結局はJavaScriptです。したがって最終的にやれることは同じです
   * 例えばRubyでできることとC言語でできることは大きく異なります。ここではツールの違いが非常に大きいです。でもHotwireとReactは結局ブラウザのJavaScript/HTML/CSSを介しますので、ツールの違いは軽微です 
* 一方でHotwireとReactはアプローチが大きく異なります

![hotwire-history.webp](content_images/hotwire-history.webp "mx-auto max-w-[500px]")

Reactの考え方は公式サイトの[Reactの流儀](https://ja.react.dev/learn/thinking-in-react)で解説されています。またHotwireとReactのアプローチの違いについては[Hotwire, React, jQueryのアプローチ](/how_to_think/approach)で解説しています。

