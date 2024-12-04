---
title: Stimulus中のHTML生成を避ける理由
layout: article
order: 10
published: true
---

## HTML生成を避けるのは自主ルール

Stimulus Controllerの中でHTMLを生成することはできます。jQuery時代のように、JavaScriptコードで自在にHTMLは作れます。しかし **[JavaScriptによるHTML生成を自主的に避けるのがStimulusの流儀](https://stimulus.hotwired.dev/handbook/origin#the-three-core-concepts-in-stimulus)** です。

その理由を私なりに紹介します。

## ERBとのコードの重複を避ける --- avoid-duplicatio-with-erb

Railsの世界ではまずERBを使ってサーバサイドでHTMLをレンダリングするのが大原則となります。**サーバでのERBレンダリングが主**です。同じHTMLをStimulusでも生成してしまうと、２箇所で同じを記述することになってしまいます。これはコードの重複になり、メンテナンス上の問題になります。

**Stimulus Controllerの中でHTMLレンダリングをなるべくしないのは重複を避けるためです**。

## StimulusでHTMLレンダリングをすることもある --- you-can-render-html-inside-stimulus

もちろんStimulus Controllerの中でJavaScriptを使ってHTMLをレンダリングしたり、直接DOMを記述することは可能です。jQueryではこれが一般的でした。また軽量のJavaScriptテンプレートライブラリも昔から存在します。やろうと思えば簡単にできます。

しかしHotwireのそもそもの存在意義はフロントエンドを簡単に書けるようすることです。Stimulusは簡単じゃなければ存在意義がありません。Viewのコードを書く箇所が重複して、メンテナンス負荷が大きくなったら本末転倒です。そのため、**StimulusはCSSクラスの切り替えやHTML属性の変更、あるいはHTML内容のちょっとした書き換えに留めることを一般的です**。

## StimulusでしかHTMLレンダリングしないのなら問題ない

Hotwireで避けたいのはHTMLレンダリングコードの重複です。したがってサーバサイドでのレンダリングをやめて、クライアントサイドに完全に任せるなら問題ありません。実際、Stimulusの中でReact/JSXを書き、Stimulusのステートなどをpropsとして渡していくこともできます。

また一般的にはChart.jsなどを使って、StimulusでChart.js等にデータを渡すことは普通にやります。

**HTMLをレンダリングする箇所がブラウザかサーバのどちらか一方であれば、Stimulusで行ってもERBで行っても問題はありません**。

## ブラウザとサーバで同じ言語を使えば良いのか？ --- should-the-browser-and-server-use-the-same-language

「StimulusがHTMLレンダリングをしないのはコードの重複を避けるためだ」というのであれば、Next.jsのようにサーバとブラウザで同じJavaScriptを使い、双方で同じコードを実行すれば良いのではないかという意見もあります。

しかしそれが銀の弾ではないことが、最近は特に明確になってきています。セキュリティ上の問題が増えたり、"use client", "use server"などのディレクティブでコードの管理が難しくなります。

ブラウザとサーバで同じ言語を使えば良いという話ではないというのが最近の論調ではないかと思います。
