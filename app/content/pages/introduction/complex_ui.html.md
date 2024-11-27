---
title: Hotwireは複雑なUIに不向き？
layout: article
order: 10
published: true
---

「Reactなら複雑なUI/UXに向いているけれども、Hotwireでは無理ではないか？」という意見があります。これは本当でしょうか？それ以前に「複雑なUI/UX」とな何を指すのでしょうか？

## Reactが解決した「複雑なUI/UX」

Reactは、当時のFacebook社が直面していた「複雑なUI/UX」の課題を解決するために生まれました。その時に導入した（当時懐疑的に思われていた）コンセプトが「単方向データフロー」です。

単方向データフローのコンセプトがどのようにして、当時主流だったクライアントサイドMVCの問題を解決したかについては、[mizchiさんによるZennの本](https://zenn.dev/mizchi/books/0c55c230f5cc754c38b9/viewer/beedb8d09d19e80b246c)が参考になると思います。またReactの誕生秘話については、英語ですが、この[React.js ドキュメンタリー](https://cult.honeypot.io/originals/react-the-documentary/)が参考になります。

これらを総合すると、Reactで言う「複雑なUI/UX」はステート管理が複雑なものを主に指すようです。

そしてステート管理が複雑になるのはどのようなケースになるかというと、[Reduxの公式ドキュメントに記載があります](https://redux.js.org/faq/general/#when-should-i-use-redux)。

>Redux is most useful in cases when:
>
> * You have large amounts of application state that are needed in many places in the app
> * The app state is updated frequently
> * The logic to update that state may be complex
> * The app has a medium or large-sized codebase, and might be worked on by many people
> * You need to see how that state is being updated over time

Reactに当てはまる点で言えば、ステート管理に苦労するのは下記のケースではないかと言えます。

* ステートが沢山あり、アプリの複数箇所で必要
* ステートが頻繁に更新される
* ステート更新ロジックが複雑

<iframe class="mx-auto" width="560" height="315" src="https://www.youtube.com/embed/8pDqJVdNa44?si=tgWa_U1W0itGa0KX" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Stimulusで「複雑なUI/UX」は作れるか？

上述より、StimulusでReact同様の複雑なUI/UXが作れるかどうかの論点は、Stimulusで単一データフローができるか否かにかかっているように思えます。これが実現できれば、Reactが解決した課題は大方Stimulusでも解決可能と言えます。

本サイトでは[「Stimulus Controllerの構造」](http://localhost:3000/concepts/stimulus-typical-structure)の項で、**Action ==> Controller ==> Target**のデータフローを意識したStimulus controllerの書き方を紹介しています。Stimulusでは`*ValueChanged`のコールバックが用意され、これをサポートしていることも紹介しています。

そして、少なくとも私の意見としていうと、Stimulus Controllerを使って単一データフローは作れると思っています。結果として、複雑なUI/UXはStimulusでも十分に作成できるのではないかと思います。

**「Hotwireで複雑なUI/UXは作れない？」というのは、単なる誤解ではないか** と考えています。

