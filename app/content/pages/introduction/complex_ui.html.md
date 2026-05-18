---
title: Reactの「複雑なUI/UX」？
layout: article
order: 80
published: true
---

ここでは「複雑なUI/UX」を定義し、Reactがなぜ「複雑なUI/UX」に適しているのかを確認しながら、Stimulusで同様の問題を解決する方法について考えます。

## Reactが解決した「複雑なUI/UX」

ReactはFacebook社が直面していた「複雑なUI/UX」の課題を解決するために生まれました。そこで生まれたコンセプトが**[「単方向データフロー」](https://ja.react.dev/learn/thinking-in-react)**です。

単方向データフローの何が優れていたかは[mizchiさんによるZennの本](https://zenn.dev/mizchi/books/0c55c230f5cc754c38b9/viewer/beedb8d09d19e80b246c)が参考になると思います。またReactの誕生秘話については、英語ですが、この[React.js ドキュメンタリー](https://cult.honeypot.io/originals/react-the-documentary/)が参考になります。 

このように**Reactでいう「複雑なUI/UX」とは、ステートを中心とした単方向データフローに適したUI**を指していると言えます。そしてそれがどのようなケースかというと、[Reduxの公式ドキュメントに記述されています](https://redux.js.org/faq/general/#when-should-i-use-redux)。

>Redux is most useful in cases when:
>
> * You have large amounts of application state that are needed in many places in the app
> * The app state is updated frequently
> * The logic to update that state may be complex
> * The app has a medium or large-sized codebase, and might be worked on by many people
> * You need to see how that state is being updated over time

<iframe class="mx-auto" width="560" height="315" src="https://www.youtube.com/embed/8pDqJVdNa44?si=tgWa_U1W0itGa0KX" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Stimulusで「複雑なUI/UX」は作れるか？

上述より、Stimulusでも単一データフローを実装できれば、Reactが解決した課題はStimulusでも解決可能と結論できます。そしてStimulusにはそのためのツールが実は用意されています。[Stimulusでステートを管理する](https://stimulus.hotwired.dev/reference/values)ための`Values`および`*ValueChanged`コールバックです。

[「Stimulus Controllerの構造」](/concepts/stimulus-typical-structure)の項で紹介している通り、これを使用するとステート(`Values`)を中心とした単一データフローのStimulus controllerが作れます。単一データフローが実装できるということは、 Reactがいう複雑なUI/UXはStimulusでも十分に作成できるということです。

多少のDXの差はあるものの、**「Hotwireで複雑なUI/UXは作れない？」というのは、単なる誤解ではないか** と考えています。



## Reactで作られていない「複雑なUI/UX」

React == 「複雑なUI/UX」ではないことを示すために、以下の事実をリストアップします。他にも多数の例がありますが、Reactは「複雑なUI/UX」といっても課題の一部を解決しているにすぎないことがわかります。

* FigmaはReactを使っていますが、メニューやボタンなどで使っているのみです。実際に図を並べでデザインするところは[Canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas)です。Figmaの「複雑なUI/UX」は主にCanvasです（下図参照）。
* Reactでグラフを描くためによく使用されている[react-chartjs-2](https://github.com/reactchartjs/react-chartjs-2)はvanilla JSの[Chart.js](https://www.chartjs.org)のラッパーです。複雑な動きはvanilla JSで実装されています。
* リッチテキストエディタのTipTap[TipTap](https://tiptap.dev)はReact版もありますが、vanilla JS版もあり、ベース技術はvanilla JSです。React版はラッパーになります。

![Figma Canvas](content_images/figma-canvas.webp "mx-auto ")
