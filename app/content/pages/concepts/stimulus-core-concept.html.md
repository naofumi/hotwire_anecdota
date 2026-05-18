---
title: Stimulusのコア・コンセプト
layout: article
order: 120
published: true
---

ここに記載している内容は2018年に書かれた[The Origin of Stimulus (Stimulusの始まり)](https://stimulus.hotwired.dev/handbook/origin)を参照し、私の経験で少し補足したものです。

## Stimulusの３つのコア・コンセプト --- 3-core-concepts

* **Controller:** Actionから指令を受け、処理をし、結果をTargetに出力するもの。全体をまとめます
* **Action:** ブラウザのイベントを受け取り、適切なControllerの適切なメソッドを呼び出すもの
* **Target:** Controllerから参照されるもの。通常はControllerで処理された結果がtargetに反映・出力されますが、Controllerがtargetの状態を読み出すこともあります

## （通常は）HTMLを生成しない --- do-not-generate-javascript

* Stimulusは通常はHTMLを生成しません
* Stimulusはサーバが生成した既存のHTMLに繋がれ、そのHTMLを変更します
    * CSSクラスの追加・削除（HTML要素の表示・非表示やアニメーション等を制御します）
    * HTML要素の並べ替え
    * HTML要素のコンテンツ（テキスト等）の変更
* もちろん新しいDOM要素を作ったりすることもできますが、このようなケースは少数です
* 補足: [HTML生成が許容される場合](/concepts/why-avoid-rendering-html-in-stimulus#when-html-is-allowed)

## ステートの管理 --- managing-state

* ステートはHTML要素に持たせます

<span class="italic">
**補足:** Stimlus Controllerには[Values](https://stimulus.hotwired.dev/reference/values)が用意されており、ステート管理ができます。したがって「StimulusはステートをHTML要素に持たせないといけない」ということではなく、**「ステートはどこに持っても良い」**と考えた方が良いでしょう。
</span>

## Reactを含めた他のライブラリと一緒に使う --- use-with-other-libraries

* Stimulusは他のライブラリと一緒に使えます（RailsにはTrixというリッチテキストエディタが含まれていますが、それはStimulusで書かれているわけではありません）
* なお本サイトでは[Stimulusを他のJavaScriptと組みわせて使用した例](/other_libraries)を紹介しています
