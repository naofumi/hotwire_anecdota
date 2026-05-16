---
title: Stimulus ControllerはCSS classを変更するべきか？
layout: article
order: 130
published: true
---

## 考え方 --- approach

* Stimulus controllerにUIの振る舞いのみの責務を与え、UIの表示はHTML/CSSに任せるという考え方があります。
* UIの振る舞いのみに集中するのであれば、Stimulus controllerの中にCSS classをハードコードするべきではありません。
* 

## Stimulus ControllerはどうやってHTML要素の表示を制御するべきか？ --- how-should-stimulus-controllers-control-html-elements

Stimulus Controllerは主にHTMLの属性を変更して表示を制御します。しかし**DOM要素は属性だけでも数種類あります**。どれを選択すれば良いかは容易ではありません

* `data-*-values`: Stimulusが管理する[`Values`ステート](https://stimulus.hotwired.dev/reference/values)。`*ValueChanged`コールバックが自動的に呼ばれます
  * 単なる`data-*`属性にステートを保持することも可能ですが、`data-*-values`を使った方がcontrollerとの対応がつきやすく、Stimulus controllerから操作しやすくなります。
* `aria-*`: アクセシビリティ視点で`aria-*`属性が必要とされる場合はどの道Stimulusから制御する必要があります。使い方も名前の付け方もアクセシビリティの約束事があり、悩まないのが利点です。
* CSS class: スタイルシートを定義すれば、CSS classの変更はすぐに表示に反映されます。

## 私の基準 --- my-guidelines

それぞれメリットとデメリットがありますが、私の使用基準は下記のようになっています

* ステートを変えるアクションが複数ある場合、あるいはステートの変更が複数のHTML要素に影響を与える場合(要は複雑な場合)はStimulus Valuesをよく使います
   * `value`の変更を画面に反映させる方法として、私は下記のいずれかを使います
      * CSS擬似セレクタを使って`value`の値を読み取り、画面の表示を変更します。画面表示のみ変更するときはこちらを使います
      * `*ValueChanged`コールバックを使用し、aria属性を変更します。そいてaria属性に対するCSS擬似セレクタを使ってaria属性を読み取り、画面の表示を変更します。アクセシビリティのためにaria属性の変更も必須なケースはこちらを選択します
* ステートの扱い方がよりシンプルな場合で、かつ適切なaria属性があれば、valueステートを省略してアクションの中で直接aria属性を書き換えます
* ステートがシンプルで、かつ適切なaria属性がない場合は２つの選択肢があります
   * Stimulus Valuesステートを使い、アクションの中でvaluesを変更します
       * CSS擬似セレクタを使って`value`の値を読み取り、画面の表示を変更します
   * 直接CSS classを変更します
       * ただしTailwindを使っている場合は変更すべきCSSクラスが多くなり、辛くなってきます。**Tailwind CSSを使用している場合はStimulus Valuesステートを使いたくなることが多いです**
       * BEM等を使っている場合は変更すべきCSSクラスは少ないのですが、それでも**私はなるべくCSSクラスを直接変更することを避けます。「表示」の責務と「振る舞い」の責務が混在してしまうためです**。
       * Stimulusには[CSS classes](https://stimulus.hotwired.dev/reference/css-classes)機能があり、「表示」と「振る舞い」の責務を分けやすくする工夫もあります。CSSクラスを直接変更する場合はこれを使うと良いでしょう。

