---
title: Stimulus Controllerの粒度
layout: article
order: 500
---

## Stimulus controllerは本当に再利用する？ --- do-you-really-reuse-stimulus-controllers

Reactのコンポーネントは画面上の見た感じを元にコンポーネント化していくことが多いかと思います。あるいはJSXを書いた時のコード量などで分けていくこともあるでしょう。

一方でStimulusはHTMLとは切り離されていますので、画面上の見た目は直接関係がありません。ヒエラルキーとしてはDOMのツリーを使いますのである程度は繋がりますが、あくまでも間接的です。またコード量はHTMLと独立なので、関係ありません。

StimulusはAction => （何らかのステート） => targetというように処理が流れていきます。ですので、このステートが共有される範囲がStimulus controllerの範囲になっていきます。

## 結果的にはウィジェット単位で切ることが多い --- divide-by-widget

結果的にはウィジェット単位で分けることが多いです。しかしReactと異なり、そこに排他的な関係はありません。例えば１つのHTML要素が２つのStimulus controllerに属しているということは非常によくあります。
