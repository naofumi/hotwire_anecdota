---
title: Stimulus中のHTML生成を避ける理由
layout: article
order: 10
published: true
---

## HTML生成を避けるのは自主ルール --- avoiding-html-is-a-voluntary-rule

Stimulus Controllerの中でHTMLを生成することは可能です。JavaScriptにはそのためのメソッドが多数用意されています。しかし **[JavaScriptによるHTML生成を自主的に避けるのがStimulusの流儀](https://stimulus.hotwired.dev/handbook/origin#the-three-core-concepts-in-stimulus)** です。

その理由を私なりに紹介します。

## ERBとのコードの重複を避ける --- avoid-duplicatio-with-erb

Railsの世界ではまずERBを使ってサーバサイドでHTMLをレンダリングするのが大原則となります。**サーバでのERBレンダリングが主**です。同じHTMLをStimulusでも生成してしまうと、２箇所で同じを記述することになってしまいます。これはコードの重複になり、メンテナンス上の問題になります。

**Stimulus Controllerの中でHTMLレンダリングをなるべくしないのは重複を避けるためです**。

## Stimulusでは小さなHTMLレンダリングに留める --- you-can-render-html-inside-stimulus

もちろんStimulus Controllerの中でJavaScriptを使ってHTMLをレンダリングしたり、直接DOMを記述することは可能です。jQueryではこれが一般的でした。また軽量のJavaScriptテンプレートライブラリも昔から存在します。

しかしHotwireのそもそもの存在意義はフロントエンドを簡単に書けるようすることです。Stimulusは簡単じゃなければ存在意義がありません。Viewのコードを書く箇所が重複して、メンテナンス負荷が大きくなったら本末転倒です。そのため、**StimulusはCSSクラスの切り替えやHTML属性の変更、あるいはHTML内容のちょっとした書き換えに留めることを一般的です**。**StimulusではHTMLレンダリングコード重複によるメンテナンスコスト増大を嫌うのです**。

## StimulusでしかHTMLレンダリングしないのなら問題ない --- its-ok-if-only-rendering-in-stimulus

Hotwireで避けたいのはHTMLレンダリングコードの重複です。したがってサーバサイドでのレンダリングをやめて、クライアントサイドに完全に任せるなら問題ありません。例えば本サイトでも以下のケースを紹介しています。

* [Stimulus Controllerの中にReact/JSXを埋め込む](/other_libraries/using_with_react)ケース
   * この場合はReactがHTMLを生成しますが、これReactだけが担当しているコンポーネントで、ERBで同じHTMLを書いていません 
* [Stimulus Controllerの中にChart.jsなどの外部ライブラリを埋め込む](/other_libraries/chartjs-stimulus)ケース
    * この場合はChart.jsがHTML(canvas)を生成しますが、これChart.jsだけが担当しています

上記の例以外に、Stimulusだけで多くのHTMLを書く場合もあるでしょう。特に複雑な楽観的UIを実現したい場合は有用かもしれません。

**HTMLをレンダリングする箇所がブラウザだけならば、Stimulusで処理しても問題はありません**。メンテナンス上で注意を要するのは、ブラウザとサーバ双方に同じHTMLを生成するコードがある場合です

## ブラウザとサーバで同じ言語を使えば良いのか？ --- should-the-browser-and-server-use-the-same-language

「StimulusがHTMLレンダリングをしないのはコードの重複を避けるためだ」というのであれば、Next.jsのようにサーバとブラウザで同じJavaScriptを使い、双方で同じコードを実行すれば良いのではないかという意見もあります。

しかしそれが銀の弾ではないことが、最近のNext.jsの混乱で特に明確になってきています。セキュリティ上の問題が増えたり、"use client", "use server"などのディレクティブでコードの管理が難しくなります。

ブラウザとサーバで同じ言語を使えば良いという話ではないというのが最近の論調ではないかと思います。
