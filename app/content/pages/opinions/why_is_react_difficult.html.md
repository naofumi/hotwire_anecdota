---
title: Reactはなぜ習得が難しいか
layout: section
order: 005
published: true
---

## Reactの難しさはJavaScriptの習得にある

「React 難しい」でインターネットを検索すると多くのヒットがあります。英語で"React difficult"をやっても同じです。そして大体同じことを言っています

1. JavaScriptをしっかり勉強しなければならない
2. コンポーネントの分け方がわからない
3. JSXに慣れるのが難しい
4. Reduxが難しい
5. ...

中でもJavaScriptをしっかり勉強しなければならないというのがダントツです。

JavaScriptをしっかり勉強しなければならないのは、一見すると当たり前です。ReactはJavaScriptで書かれていますので、それが読み書きできなければならないのは当然に思えます。

しかし、私もそうでしたが、多くのRuby on Rails開発者はRubyから始めていません。Ruby on Railsで一通りウェブサイトが作れるぐらいになってから、あるいはその随分後になってRubyをしっかり学び直す人が多いのではないかと思います。JavaScriptをしっかり勉強しないとReactが難しいというのは違和感があります。

またHotwireとReactを並べて各経験が増えてくると、もう一つのことに気づきます。**Hotwireで書くJavaScriptとReactで書くJavaScriptは全然違うのです。HotwireのJavaScriptの方が基礎的でReactの方が難易度が高いです。**

Hotwireの方がシンプルで、Reactの方が複雑だと言っているのではありません。**Reactの方がJavaScriptの機能を多く使っていて、特に後の方で学習する学習難易度の高い機能を使っている**という意味です。

下記は私が自分のHotwireコードとReactコードを比較して、JavaScriptに限って感じたことを挙げました。

* Reactでは高階関数のコンセプトを多用します
    * イベントハンドラを子コンポーネントに渡すとき、関数へのレファランスをpropsで渡します
    * `useState()`の返り値の第２引数（例えば`const [user, setUser] = useState(null)`の`setUser`）は関数へのレファランスです
    * `useEffect()`は高階関数で、中に記述するのはクロージャー（無名関数）です
    * Hotwireではこのような書き方はほとんどしません。せいぜい`Array#forEach()`等でクロージャーを使うぐらいです
* Reactはasync awaitやコールバック関数を多用します
    * 大半はサーバからデータを取得するための`fetch()`でasync awaitを使います
    * Hotwireの場合はサーバからデータ取得はTurboが担当します。Turboの呼び出しは通常はJavaScriptからやらず、`<a>`タグや`<form>`タグのHTML要素が自動的にやってくれます。まれに`Turbo.visit()`をJavaScriptから呼び出すこともありますが、サーバレスポンスの処理はすべてTurboが担当しますので、コールバックを渡す必要がありません
    * Turboでレスポンス後の処理をカスタマイズする場合は、Turboが発火するカスタムイベントをStimulus Controllerで拾うというやり方をします。滅多にやりませんが、やはりasync awaitが不要です

JavaScriptを学習する上で、高階関数やコールバックは経験が浅い人にとっては難しい概念になります。Hotwireはこれを使わなくても十分にプログラムが書けますので、そういう人にとって優しいライブラリーと言えるかもしれません。

## 自然言語の理解と比較してみる

JavaScriptを十分に理解しないといけないライブラリと、簡単なところしか分からなくても使えるライブラリの関係がわかりにくいかもしれないので、英語などの自然言語と比較してみたいと思います。

TOIECには[「TOEICスコアとコミュニケーション能力レベルとの相関表」](https://www.iibc-global.org/hubfs/library/default/toeic/official_data/lr/pdf/proficiency.pdf)があります。

これをみて分かるように、470点以上あれば「日常生活のニーズを充足し、業務上のコミュニケーションができる」となっています。なんとかビジネス会話ができるのです。一方で860点以上になれば「Non-Nativeとして十分なコミュニケーションができる」となります。英単語は誰でも使うものから、あまり使わないものまで幅広くありますし、英語の構文にしても同じです。これはJavaScriptと同じでは無いでしょうか？

Hotwireを使うためにはTOEIC 470点あればよくて、一方でReactを使うのには730点が必要という状況があっても不思議ではありません。

確証はありませんが、こんな感じのことになっているのでは無いかと感じます。

![toeic-proficiency.webp](content_images/toeic-proficiency.webp "max-w-[500px]")



