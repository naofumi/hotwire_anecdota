---
title: Stimulus ControllerはCSS classを変更するべきか？
layout: article
order: 35
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

それぞれメリットとデメリットがありますが、私の使用基準は下記のようになっています

* ステートを変えるアクションが複数ある場合、あるいはステートの変更が複数のHTML要素に影響を与える場合はStimulus Valuesをよく使います
   * `value`の変更を画面に反映させる方法として、私は下記のいずれかを使います
      * CSS擬似セレクタを使って`value`の値を読み取り、画面の表示を変更します。画面表示のみ変更するときはこちらを使います
      * `*ValueChanged`コールバックを使用し、aria属性を変更します。そいてaria属性に対するCSS擬似セレクタを使ってaria属性を読み取り、画面の表示を変更します。アクセシビリティのためにaria属性の変更も必須なケースはこちらを選択します
* ステートの扱い方がよりシンプルな場合で、かつ適切なaria属性があれば、valueステートを省略してアクションの中で直接aria属性を書き換えます
* ステートがシンプルで、かつ適切なaria属性がない場合は２つの選択肢があります
   * Stimulus Valuesステートを使い、アクションの中でvaluesを変更します
       * CSS擬似セレクタを使って`value`の値を読み取り、画面の表示を変更します
   * 直接CSS classを変更します
       * BEMを使っている場合は良いと思いますが、Tailwindを使うとCSSクラスが多くなり、辛くなってきます。**Tailwind CSSを使用している場合はStimulus Valuesステートを使いたくなることが多いです**

## まとめ --- summary

Stimulus Controllerは原則としてステートをDOMに持たせるのですが、かなり自由度があります。また**Tailwind CSSを使うか、BEMを使うかによって扱うCSSクラスの数が劇的に変わりますので、そこも判断に影響します**。

その中でも私の場合は上記のルールにしたがって、どのようなDOM要素にステートを持たせるかを判断しています。私が個人的にTailwind CSSを多く使っていることにも影響されていると思いますが、概ねCSS classを直接書き換えずに、`data-*-values`のValuesステートを使う方向に持っていきます。

