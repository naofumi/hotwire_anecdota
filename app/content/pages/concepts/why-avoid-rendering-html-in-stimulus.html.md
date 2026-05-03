---
title: Stimulus中のHTML生成を避ける理由
layout: article
order: 10
published: true
---

## HTML生成を避けるのは自主ルール --- avoiding-html-is-a-voluntary-rule

Stimulus Controllerの中でHTMLを生成することは可能です。JavaScriptにはそのためのメソッドが多数用意されています。しかし[JavaScriptによるHTML生成を自主的に避けるのがStimulusの流儀](https://stimulus.hotwired.dev/handbook/origin#the-three-core-concepts-in-stimulus)です。

その理由を私なりに紹介し、逆にいつなら許容できるかを考えます。

## ERBとのコードの重複を避ける --- avoid-duplication-with-erb

Rail/ERBではサーバサイドでHTMLをレンダリングするのが基本となります。同じHTMLをStimulusでも生成してしまうと、２箇所で同じを記述することになってしまいます。これはコードの重複になり、メンテナンス上の問題になります。 Stimulus Controllerの中でHTMLレンダリングを避けるのは、このコード重複を避けるためです。

## HTML生成が許容される場合 --- when-html-is-allowed

コード重複の影響が少ない場合や、コード重複が避けられる場合はStimulus controllerでHTMLを生成しても問題ありません。

* **生成するHTMLが少ない場合:** 例えば画面上の文言を修正したりする程度であればコード重複の影響は少ないので、Stimulus controllerでHTMLを生成しても問題ありません。
* **`<template>`タグ** `<template>`タグを利用すると、サーバ側でHTMLのテンプレートを事前にレンダリングすることが可能です。コードの重複は発生しませんので、問題ありません。

## HTML生成を避ける方法 --- avoiding-html-generation

Stimulusでは主にCSSでHTML要素の表示状態を制御し、controllerの中でのHTML生成を避けます。

* Reactでは[条件付きレンダー](https://ja.react.dev/learn/conditional-rendering)が推奨されていますが、これはHTMLの生成を必要とします。

```jsx
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}

```

* Stimulusは条件付きレンダーではなく、例えば下記のようにCSSを使います。そしてStimulusは各`<li>`の`data-checked`属性を制御します。（ここでは表示の仕方だけを示すために、Stimulusのコードは記載していません）
* `data-checked`属性を介さずにStimulusが直接`<span>`のclassを書き換えるなどの方法もあります。しかしStimulusはなるべく表示ロジックとは切り離したいので、あくまでも`data-checked`属性の変更にとどめ、表示はあえてCSSに任せた方が再利用性およびメンテナンス性が高くなります。

```html
<style>
  .item__check {
    display: none;
  }
  [data-checked="true"] .item__check {
    display: inline-block;
  }
</style>

<section>
  <h1>Sally Ride's Packing List</h1>
  <ul>
    <li class="item" data-checked="true">
      Space suit<span class="item__check">✅</span>
    </li>
    <li class="item" data-checked="true">
      Helmet with a golden leaf<span class="item__check">✅</span>
    </li>
    <li class="item">
      Photo of Tam<span class="item__check">✅</span>
    </li>
  </ul>
</section>
```
