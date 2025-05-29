---
title: その他
layout: article
order: 50
published: false
---


## Hotwireはセミオーダー、Reactはフルオーダー --- hotwire-semi-order-react-full-order

* Hotwireはサーバで出来上がったパーツ（HTML短編）を工事現場で繋ぎ合わせます
* Reactは工事現場で具材（JSON API）から組み立てます

Reactの方は現場の状況に応じて大幅な変更をする場合は強力ですが、フロントエンドの作業は増えます。HotwireはDBに近い工場で効率的にパーツを作り、Turboで現場に送り、Stimulusで微調整をしながらパッと組み立てます。

![what-is-hotwire-hotwire.webp](content_images/what-is-hotwire-hotwire.webp "max-w-[600px] mx-auto")

![what-is-hotwire-react.png](content_images/what-is-hotwire-react.png "max-w-[600px] mx-auto")

## Hotwireは直接的、Reactは間接的 --- hotwire-is-direct-react-is-indirect

* HotwireはTurboでHTMLをサーバから受け取り、StimulusでHTML/CSSを制御します
* Reactはサーバからデータを受け取り、ステートに保存します。直接HTML/CSSを変更してはいけません。必ずステートを介して、間接的にHTMLを操作します

## とにかくHotwireはReactとは異なる --- hotwire-and-react-are-different

* HotwireとReactは結局はJavaScriptです。したがって**最終的にやれることは同じ**です
    * 例えばRubyでできることとC言語でできることは大きく異なります。その場合はツールの違いが非常に大きいです。でもHotwireとReactなら結局ブラウザのJavaScript/HTML/CSSを介しますので、ツールの違いは軽微です
* 一方でHotwireとReactはアプローチが大きく異なります

![hotwire-history.webp](content_images/hotwire-history.webp "mx-auto max-w-[500px]")

Reactの考え方は公式サイトの[Reactの流儀](https://ja.react.dev/learn/thinking-in-react)で解説されています。またHotwireとReactのアプローチの違いについては[Hotwire, React, jQueryのアプローチ](/how_to_think/approach)で解説しています。

