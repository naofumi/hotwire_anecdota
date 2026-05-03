---
title: Stimulusはコンポーネントではない
layout: article
order: 25
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

## Stimulus controllerはDOMのレンダリングを行いません --- no-rendering

ReactのコンポーネントはUI要素としての独立性が重視され、単体でDOMのレンダリングができ、単体でインタラクティビティを持つものです。以下の機能を持ちます。

- DOMをレンダリングします。
- ステートを持ちます。
- イベントハンドラーを登録します。

それに対してStimulus controllerはUI要素として独立したものではなく、既存のHTMLに対してインタラクティビティを付与するものです。DOMのレンダリングは行いません。

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

このようにStimulus controllerはインタラクティビティのみを担当し、表示には関与しないため、異なるHTML要素を使ったり、CSSを大幅に変えたり、HTMLの構造自体を変更しても同じStimulus controllerで対応できます。一方でReactコンポーネントは再利用せずに新しいコンポーネントを作成して対応することが多いでしょう。**この点ではStimulus controllerの方が再利用性が高いと言えます**。

## まとめ --- summary

* Stimulus controllerはReactのコンポーネントとは責務が異なります。特にStimulusはDOMのレンダリングを行わないのが大きな特徴です。
* Stimulus controllerはHTMLにHTML属性を介して接続されます。接続先のHTMLは自由度が高く、CSSを自由に変えたり、HTMLの構造そのものを変えても機能します。

## 追記 --- appendix

* Reactで人気のShadcnは、UIライブラリというよりはコンポーネントのscaffoldであって、自在にカスタマイズ可能なコードを生成してくれます。カスタマイズ性が高いのはこのためで、Shadcnが提供するCSSおよびHTMLの構造を自在に編集できます。
* この考え方はStimulusに近いと言えます。Stimulus controllerはインタラクティビティを担当しますが、表示に関する部分(HTML/CSS)は自在に書き換えられます。
* 一方でMUIやAnt Designなどは固定されたUIライブラリが用意されていて、表示に関する部分だけであっても内部構造に手を加えるのは難易度が高くなっています。ShadcnやStimulus controllerと比べると、より閉じたコンポーネントになっていると言えます。
