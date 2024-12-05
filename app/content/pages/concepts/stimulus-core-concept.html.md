---
title: Stimulusのコア・コンセプト
layout: article
order: 25
published: true
---

ここに記載している内容は[Stimulus 1.0を公開した時にDHHが解説](https://signalvnoise.com/svn3/stimulus-1-0-a-modest-javascript-framework-for-the-html-you-already-have/)を参照し、私の経験で少し補足したものです。

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

## ステートの管理 --- managing-state

* ステートはHTML要素に持たせます

<span class="italic">
**補足:** もちろんステートをURL, cookie, localStorage, `window`オブジェクトやStimulus Controllerのインスタンス変数等に持たせることはできます。Reactと異なり「ステートはこう管理すべき」というのがないだけです。とはいえStimulusでは一般的にステートをHTML要素に持たせます。それは上述のように変更を受けたHTMLそのものであったり、あるいはStimulus Controllerのインスタンス変数にバインディングされた[Values](https://stimulus.hotwired.dev/reference/values)だったりします。
</span>

## Reactを含めた他のライブラリと一緒に使う --- use-with-other-libraries

* Stimulusは他のライブラリと一緒に使えます（RailsにはTrixというリッチテキストエディタが含まれていますが、それはStimulusで書かれているわけではありません）
* 本サイトでは[Stimulusを他のJavaScriptと組みわせて使用した例](/other_libraries)を紹介しています
