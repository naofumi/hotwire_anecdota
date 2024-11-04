---
title: Hotwire vs. React
section: Introduction
layout: section
order: 005
---

## 判断の視点の提供

ここではHotwireとReactの優劣は特に議論はしません。ただ、判断をする上で私が大切だと思う視点を紹介します。

### 結局は HTML/CSS/JavaScript

HotwireにしてもReactにしても、結局はHTML/CSS/JavaScriptです。WASMを別にすれば、ブラウザで動く以上、基盤の技術は同じです。そしてどれも高級言語です。裏で動いているC++のコードを大きく抽象化しているのがHTML/CSS/JavaScriptです。機械語に近いレベルでアルゴリズムや仕組みを大きく異にしているRust/JavaScript/Java/Ruby/PHP等の比較とは根本的に別物です。

したがってHotwireを使おうが、Reactを使おうが、それこそjQueryを使おうが、高級言語のレベルで同じになります。そのためReactだけにできることやHotwireだけにできることは基本的に存在しません。

### JSON APIの有無

例えばReact + Railsの組み合わせをした場合、双方をつなげるためのJSON APIを設計・開発・メンテナンスする必要が生まれます。Hotwire + Railsでは完全に不要なものです。

単純に考えると無くしてしまった方が効率的だろうと考えがちです。しかしあった方がフロント・バックの分業体制上は都合が良いとか、メンテナンス性が優れているという意見もありますので、結論は簡単には出せません。

組織構造も絡む話ですので、個別に検討する必要があるでしょう。

### 技術的な大きな違いはどこでHTMLを生成するか

HotwireとReactの一番大きな違いはどこでHTMLを生成するかではないかと思います。もちろんただのJavaScriptですので、Hotwireを使ってブラウザでHTMLを生成しても良いですし、またReactでSSRを使えばサーバでHTMLを生成できます。しかし歴史的に見れば、この点が一番の分岐点と言えると思います。


