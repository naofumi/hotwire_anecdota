---
title: Stimulus ControllerはなぜControllerか？
section: Concept
layout: article
order: 500
---

## Stimulus Controllerのイメージ

Stimulusで書くコードはControllerと呼ばれています。そのイメージはゲームコントローラと同じです。

* ユーザからの操作を受け付けます
* 実際の処理をする本体に送信します
* 本体で処理した結果、ステートを変更します
* ステートをもとにユーザにフィードバックを与えます（ゲームの場合はコントローラを介さずに、画面でフィードバックを表示します）

![Game Controller](content_images/game-controller.webp)

## Stimulus Controllerの要素

Stimulus Controllerの処理の流れは

1. ユーザからのイベントを受け取る
2. 内部処理をして、ステートを変更する
3. ステートをDOMに反映して、ユーザにフィードバックを与える

### イベント（ユーザからの操作）を受けるところ

* `connect()`, `disconnect()`などのライフサイクルメソッド
* `data-action`のイベントを受け取るアクションメソッド
* `data-*-value`の値の変化に反応する`*ValueChanged`コールバックメソッド

### ステートを保管するところ

Reactの場合はステートを`useState()`, `useContext()`やRedux Storeなど、決まったところに保存するのがルールです。しかしStimulusではそのようなルールはありません。ブラウザがステートを保存できるところなら、どこにでも保存できます。その中でもStimulusは一つだけ、`values`を提供しています。

* cookies, localStorage, sessionStorage
* Stimulus Controllerクラスのインスタンス変数
* `values`
* その他

### フィードバックを返すところ

* `targets`
* `outlets`
