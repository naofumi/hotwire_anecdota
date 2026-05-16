---
title: Stimulusはコンポーネントではない
layout: article
order: 160
published: true
descriptors:
  technologies:
    - Stimulus
  demo_urls:
    - ["React版のデモ", "/react/toggle_plain"]
    - ["Stimulus版のデモ", "/components/toggle_stimulus"]
  related_pages:
    - /concepts/stimulus-tips.html.md
---

ここではStimulus controllerとReact等におけるコンポーネントの違いについて説明します。

## ReactはHTMLとイベント処理を密結合。Stimulusは独立性重視 --- react-couples-stimulus-decouples

Reactのコンポーネントの特徴は、HTML(DOM)とイベント処理(JavaScript)を密結合させていることです。CSSモジュールはCSS-in-JSを使用すると、さらにCSSも密結合させます。全てを一緒にすることでコンポーネントとしての再利用性が高まるという考え方です。

それに対してStimulusはHTMLとイベント処理を独立させています。もちろんCSSも独立です。これは従来からのウェブフロントエンドの考え方で[プログレッシブエンハンスメント](https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%82%B0%E3%83%AC%E3%83%83%E3%82%B7%E3%83%96%E3%82%A8%E3%83%B3%E3%83%8F%E3%83%B3%E3%82%B9%E3%83%A1%E3%83%B3%E3%83%88)と呼ばれるものです。独立させることでイベント処理単体の再利用性、もしくはCSS単体の再利用性が高まります。

どちらが正しくてどちらが誤っているかという単純なことは言えませんが、有利不利はあります。また最近Reactでは[Radix UI](https://www.radix-ui.com/), [React Aria Components](https://react-spectrum.adobe.com/react-aria/react-aria-components.html), [Base UI](https://base-ui.com/), [Headless UI](https://headlessui.com/), [Ark UI](https://ark-ui.com/)などの"headless UI"が主流になってきており、「動作」と「表示」を分ける動きも増えています。

## Stimulus controllerはDOMのレンダリングを行いません --- no-rendering

Reactのコンポーネントは以下の全てを行います。

- DOMをレンダリングします。
- ステートを持ちます。
- イベントハンドラーを登録します。

それに対してStimulus controllerは既存のHTMLに対してインタラクティビティを付与するものであり、DOMのレンダリングを行いません。

- ステートを持ちます。
- イベントハンドラーを登録します。

## 実際のコード比較 --- compare-code

ReactのコンポーネントとStimulus controllerを比較するために、トグルを双方で実装した例を見ていきます。

* React版の特徴
  * DOMをレンダリングするため、コンポーネントの中にJSXが入っています。
  * ステート(`useState`)およびイベントハンドラ(`clickHandler()`)も含まれています。
* Stimulus版の特徴
  * DOMのレンダリングはHTMLテンプレート(`app/views/components/toggle_stimulus.html.erb`)が担当しています。
  * Stimulus controller (`app/javascript/controllers/switch_controller.js`)ではステートを管理し(今回は`aria-checked`属性をステートとしている)、イベントハンドラ(`toggle()`)が含まれています。
  * Stimulus controllerとDOMは、HTML属性の`data-controller="switch"`や`data-action="click->switch#toggle..."`によって接続されています。

### React component --- react-component

```typescript:app/javascript/react/components/TogglePlain.tsx
export function TogglePlain() {
  const [enabled, setEnabled] = React.useState(false)

  function clickHandler() {
    setEnabled(!enabled)
  }

  return (
    <button type="button"
            className="group bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out
                   focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2
             aria-checked:bg-indigo-600"
            role="switch"
            tabIndex={0}
            aria-checked={enabled
                          ? "true"
                          : "false"}
            onClick={clickHandler}
    >
      <span className="sr-only">Use setting</span>
      <span aria-hidden="true"
            className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0
                   transition duration-200 ease-in-out
                   group-aria-checked:translate-x-5"
      ></span>
    </button>
  )
}
```

### Stimulus version --- stimulus-version

```erb:app/views/components/toggle_stimulus.html.erb
  <div class="text-center">
    <button type="button"
            class="group bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out
                   focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2
             aria-checked:bg-indigo-600"
            role="switch"
            tabindex="0"
            aria-checked="false"
            data-controller="switch"
            data-action="click->switch#toggle keydown.space:stop:prevent->switch#toggle"
    >
      <span class="sr-only">Use setting</span>
      <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
      <span aria-hidden="true"
            class="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0
                   transition duration-200 ease-in-out
                   group-aria-checked:translate-x-5"
      ></span>
    </button>
  </div>

```

```js:app/javascript/controllers/switch_controller.js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="switch"
export default class extends Controller {
  connect() {
  }

  toggle() {
    this.element.ariaChecked = this.element.ariaChecked === "true" ? "false" : "true"
  }
}
```

## 各方式の特徴 --- characteristics

* Reactはコンポーネントとしての独立性があるため、コンポーネント単体で成立します。
* 一方でStimulus controllerはHTMLレンダリングの責務を持たないため、常にHTMLとセットで考える必要があります。
* Stimulus controllerは任意のHTMLと接続が可能です。例えば`<button>`タグではないものに`data-controller="switch"`をつけても正常に動作します。一方でReactコンポーネントの場合は`<button>`タグ以外のものにインタラクティビティを持たせたい場合、コンポーネントを作り直す必要があります。
* コンポーネントのデザインを大幅に変更したい場合のやり方が大きく変わります。
  * Reactのコンポーネントの場合はコンポーネントを書き換えるか、もしくはJSXの`className` を変更できるように`TogglePlain`コンポーネントのpropsを工夫する必要があります。
  * Stimulus controllerの場合はHTMLテンプレートを書き換えるだけで大きなデザイン変更に対応できます。Stimulus controllerそのものに手を加える必要はありません。

このようにStimulus controllerはインタラクティビティのみを担当し、表示には関与しないため、異なるHTML要素を使ったり、CSSを大幅に変えたり、HTMLの構造自体を変更しても同じStimulus controllerで対応できます。一方でReactコンポーネントは再利用せずに新しいコンポーネントを作成して対応することが多いでしょう。**この点においてはStimulus controllerの方が再利用性が高いと言えます**。

## まとめ --- summary

* Stimulus controllerはReactのコンポーネントとは責務が異なります。特にStimulusはDOMのレンダリングを行わないのが大きな特徴です。
* Stimulus controllerはHTMLにHTML属性を介して接続されます。接続先のHTMLは自由度が高く、CSSを自由に変えたり、HTMLの構造そのものを変えても機能します。

## 追記 --- appendix

* Reactで人気のShadcnは、UIライブラリというよりはコンポーネントのscaffoldであって、自在にカスタマイズ可能なコードを生成してくれます。カスタマイズ性が高いのはこのためで、Shadcnが提供するCSSおよびHTMLの構造を自在に編集できます。
* この考え方はStimulusに近いと言えます。Stimulus controllerはインタラクティビティを担当しますが、表示に関する部分(HTML/CSS)は自在に書き換えられます。
* 一方でMUIやAnt Designなどは固定されたUIライブラリが用意されていて、表示に関する部分だけであっても内部構造に手を加えるのは難易度が高くなっています。ShadcnやStimulus controllerと比べると、より閉じたコンポーネントになっていると言えます。
