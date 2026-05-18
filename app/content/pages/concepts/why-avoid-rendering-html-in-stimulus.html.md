---
title: Stimulus中のHTML生成を避ける理由
layout: article
order: 140
published: true
---

## HTML生成を避けるのは自主ルール --- avoiding-html-is-a-voluntary-rule

Stimulus Controllerの中でHTMLを生成することは可能です。JavaScriptにはそのためのメソッドが多数用意されています。しかし[JavaScriptによるHTML生成を自主的に避けるのがStimulusの流儀](https://stimulus.hotwired.dev/handbook/origin#the-three-core-concepts-in-stimulus)です。

その理由を私なりに紹介し、いつならば許容できるかを考えます。

## ERBとのコードの重複を避ける --- avoid-duplication-with-erb

Rail/ERBではサーバサイドでHTMLをレンダリングするのが基本となります。同じHTMLをStimulusでも生成してしまうと、２箇所で同じを記述することになってしまいます。これはコードの重複になり、メンテナンス上の問題になります。 Stimulus Controllerの中でHTMLレンダリングを避けるのは、このコード重複を避けるためです。

## ブラウザでのHTML生成の主な負担はJSONの準備にある --- the-burden-of-html-generation-is-often-json

すでにJSONが用意されている場合ならHTMLの生成は簡単です。JSXにJSONを流し込むだけで十分です。しかしブラウザでHTMLをレンダリングする際に[しばしば問題になるのはJSONの準備](/introduction/key_difference_between_hotwire_and_react)です。簡単なものであれば問題ありませんが、大きなHTMLをブラウザで生成する場合、特にSPAの場合はJSONの準備が大きな負担になります。

## HTML生成が許容される場合 --- when-html-is-allowed

コード重複の影響が少ない場合や、コード重複が避けられる場合はStimulus controllerでHTMLを生成しても問題ありません。

* **生成するHTMLが少ない場合:** 例えば画面上の文言を修正したりする程度であればコード重複の影響は少ないので、Stimulus controllerでHTMLを生成しても問題ありません。
* **`<template>`タグ** `<template>`タグを利用すると、サーバ側でHTMLのテンプレートを事前にレンダリングすることが可能です。コードの重複は発生しませんので、問題ありません。
* もちろん上記は絶対的な基準ではなく、実際に用途に合わせて柔軟に考えたら良いと思います。

## CSSでHTML生成を避ける方法 --- avoiding-html-generation-with-css

**Stimulusでは主にCSSでHTML要素の表示状態を制御**し、HTML生成を不要にします。実際のコードを見ながら解説します。

### Reactの場合 --- in-react

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

* Reactでは[条件付きレンダー](https://ja.react.dev/learn/conditional-rendering)が推奨されていますので、`Item`コンポーネントに渡す`isPacked` propsで表示の有無を制御します。
* `Item`コンポーネントの中では`isPacked`のtrue/falseを見て、異なるDOMをレンダーします。

### CSSの場合 --- in-css

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

* Stimulusの例ではCSSを使います。
* 各`<li>`の`data-checked`属性を変更することで`item__check`の表示のオン・オフを切り替えています。
* Stimulus Controllerは各`<li>`を描画するかしないかを制御するのではなく、`data-checked`属性を切り替えて、表示・非表示を切り替えています。

なお`data-*`属性を変えるのではなく、Stimulusから直接CSSクラスを書き換える方法もあります。しかし表示に関するCSSクラスと状態に関するCSSクラスの見分けがつかなくなる問題点があります。`data-*`属性を使って、**表示とステートを分ける**ことをお勧めします。
