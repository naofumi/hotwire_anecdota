---
title: Hotwireの歴史
section: History
layout: section
order: 010
published: true
---

## 系統樹 --- evolution-tree

注）下記の系統樹は網羅性・正確性を期したものはなく、大雑把な流れを表現するものです

![Hotwire History](content_images/hotwire-history.webp)

* ReactやVueはブラウザでHTMLを生成するCSRとして発展しました。ブラウザでHTMLを書き換えます。[Reactの条件付きレンダー](https://ja.react.dev/learn/conditional-rendering)がその典型です
* Hotwire, HTMX, Alpine.js, Livewire等はサーバでHTMLを生成するSSRとして発展しました。HTMLの書き換えも主にサーバを使います
* ルーツであるjQueryの頃は様々なアプローチが混在していました。サーバからHTMLを受け取り、そのままブラウザの表示を書き換えることもありました。またサーバからJSONを受け取り、ブラウザでHTMLを生成し、ブラウザ表示を書き換えることもしました。

## CSR類とSSR類は別

系統樹を見てわかるように、CSR類とSSR類はどっちが優れているか劣っているかではなく、別系統です。ウェブのインタラクティブUIを作るアプローチがそもそも異なります。そのため、Reactに詳しい人がHotwireを学ぶ場合、あるいは逆にHotwireの人がReactを学ぶ場合には頭の切り替えが必要になります。
