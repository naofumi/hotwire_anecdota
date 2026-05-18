---
title: Hotwire, React, jQueryのアプローチの比較
section: Tips
layout: article
order: 10
published: true
---

Hotwireの考え方を理解しやすくするために、他の技術との違いを簡単に紹介します。

なお下記内容は[各種技術でサイドパネルを実装した例](/examples/side_panel)で具体的にご確認いただけます。

## Hotwire vs. React --- hotwire-vs-react

* Reactはステートからの単方向データフローを**強制します**。
   * 簡単な操作の場合は、不必要に回りくどいことをしているように見えることがあります。
   * Hotwireは直接HTML/DOMを操作します。
      * 複雑なUIの場合は、必要に応じてステートからの単方向データフローを使用できます。
* ReactはHTML(DOM)/イベントハンドリング(JavaScript)が**密結合しています**。
   * JSXにイベント処理やステートを埋め込みやすいため、接続は簡単になります。
   * クライアントサイドでレンダリングしないとインタラクティブになりません。
   * HotwireはHTMLとStimulus controllerが分離されているため、サーバでレンダーしたHTMLをそのまま利用できます。
      * ドメインモデルが複雑だったりデータ漏洩要件が厳しい場合はRailsサーバでHTMLをレンダーした方が有利なので、この場合はHotwireが適しています。 
* Hotwire/TurboはJavaScriptをほとんど書かずにサーバとの非同期通信・部分画面更新を実現できます。
    * Reactで非同期通信・部分画面更新をする場合はJavaScriptで処理を記述する必要があります。
    * Hotwireは[Ruby on RailsのOmakase](https://rubyonrails.org/doctrine#omakase)の考え方を引き継いでいて、繰り返し使う箇所は簡略化していると言えます。

## Hotwire vs jQuery --- hotwire-vs-jquery

* jQueryは一般的に`DOMContentLoaded`でイベントハンドラを接続します。
   * インタラクティブに画面が更新されるUIの場合は`DOMContentLoaded`だけを頼りにできず、イベントハンドラの接続処理が複雑になります。 
   * [Hotwire/StimulusはMutationObserverAPIを使ってイベントハンドラ](https://stimulus.hotwired.dev/reference/lifecycle-callbacks#order-and-timing)を接続します。そのため高度にインタラクティブなUIでもイベントハンドラの接続に悩む必要がありません。
* Hotwire/StimulusはHTMLに接続する方法が規約で指定されているため、コードが読みやすくなっています。
   * jQueryの場合はHTMLに接続する箇所(いわゆるbehavior hooks)の規約がなく、`id`を使ったり`class`を使ったり`data-*`属性を使ったりとルールがありませんでした。 どのHTML要素がどのjQueryコードに接続するかがわかりにくくなっていました。
   * なおjQueryをわかりやすくするための工夫は現場のコードでも良く見かけます。私が理解している限りで[いくつかまとめています](https://zenn.dev/naofumik/articles/588a62005c41e4)。
* Hotwire/TurboはJavaScriptをほとんど書かずにサーバとの非同期通信・部分画面更新を実現できます。
   * jQueryで非同期通信・部分画面更新をする場合はJavaScriptで処理を記述する必要があります。
   * ただし[jQueryの記述は非常に簡略化されていて](https://api.jquery.com/load/)、`element.load([URL])`だけでデータフェッチからDOMへの挿入までまとめてやってくれます。


