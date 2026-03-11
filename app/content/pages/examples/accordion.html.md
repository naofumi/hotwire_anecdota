---
title: アコーディオン
layout: article
order: 20
published: true
descriptors:
  component_names:
    - Accordion
    - Expandable
    - Collapsible
    - Disclosure
  server_request: false
  state_management:
    - aria-expanded (Stimulus版)
  technologies:
    - Stimulus
    - Native HTML
  demo_urls:
    - ["Stimulus版", "/components/accordion"]
    - ["Native版", "/components/accordion_native"]
  related_pages:
    - /concepts/stimulus-tips.html.md
---

ここで作るのは下記のようなUIです。

![accordion.mov](content_images/accordion.mov "mx-auto max-w-[500px]")

[デモはこちら](/components/accordion)に用意しています。

## 考えるポイント --- thinking-points

* サーバとの非同期通信
    * 不要 
* アコーディオンの開閉ステート
    * 開閉ボタンの`aria-expanded`属性をステートとします
* その他の属性変更
    * a11yのために、`aria-hidden`や`inert`の属性を追加します
    * トランジションを実現するために、アコーディオンの詳細文の箇所の高さをStimulusから制御します。これはCSSの`interpolate-size`のサポートが広がれば不要になる見込みです。
* 追記
    * `<details>`, `<summary>`を使った例も参考として紹介しますが、滑らかなトランジションに必要な`interpolate-size`CSSSがまだすべての主要ブラウザに広がっていないため、あくまでも参考扱いです
    * 他に`<input type="checkbox">`や`<input type="radio">`を使用する方法もありますが、ネイティブな`<details>`, `<summary>`での完全な実装が近い将来期待できますので、解説しません

## Stimulus版のコード --- code-stimulus

### Accordion Controller --- accordion-controller

```js:app/javascript/controllers/accordion_controller.js
import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="accordion"
export default class extends Controller {
  static targets = ["revealable", "trigger"]

  connect() {
    this.#syncContentA11y()
  }

  toggle() {
    this.triggerTarget.ariaExpanded = this.#isExpanded() ? "false" : "true"
    this.#toggleRevealableTargets()
    this.#syncContentA11y()
  }

  #isExpanded() {
    return this.triggerTarget.ariaExpanded == "true"
  }

  #syncContentA11y() {
    this.revealableTargets.forEach(target => {
      if (this.#isExpanded()) {
        target.ariaHidden = "false"
        target.inert = false
      } else {
        target.ariaHidden = "true"
        target.inert = true
      }
    })
  }

  #toggleRevealableTargets() {
    this.revealableTargets.forEach(target => {
      /*
      * CSS transitions cannot transition if the destination height
      * is not explicitly specified (like height: auto).
      * Hence, we get the scrollHeight with JavaScript and
      * explicitly set that value as the destination height.
      * */
      if (parseInt(target.style.height)) {
        target.style.height = 0
      } else {
        const scrollHeight = target.scrollHeight
        target.style.height = scrollHeight + "px"
      }
    })
  }
}
```

* Stimulus Controllerの作り方は[ここ](/tips/how-you-should-create-stimulus-controllers)をご確認ください
* Stimulus Controllerで一番最初に見るべきポイントはイベントに応じて変化するステートです。
  * このControllerのイベントハンドラは`toggle()`だけなので、そこでステートがどのように変化するかを確認します。
  * そうすると`this.triggerTarget.ariaExpanded`がステートだというのがわかります。`toggle()`を実行することでこの値の`"true"`, `"false"`と変化します。
* `this.triggerTarget.ariaExpanded`ステートは、のちに詳しく説明しますが、CSSセレクタで検知できます。つまりCSSこのステートを監視して、自動的にUIを更新してくれます
* `#syncContentA11y()`はCSSだけでは対応できない箇所を更新しています
   * 今回はコンテンツ部分(Accordion開閉で表示・非表示となる箇所)のa11y対応です
   * このようにCSSだけで対応できるところはCSSで対処し、DOMの直接操作が必要なところはStimulus Controllerの中で対処することがよくあります
* `this.#toggleRevealableTargets()`はCSS transitionのための工夫、`this.#syncContentA11y()`はコンテンツに対してa11yのための`aria`属性を変更したり、`inert`属性を追加したりしています。


### アコーディオンのview --- accordion-view

```erb:app/views/components/accordion.html.erb
  <div>
    <h2 class="text-4xl pb-8 border-b border-gray-300">
      Frequently Asked Questions
    </h2>
    <%= render 'accordion_row',
               title: "携帯プランの変更はどうすればいいですか？" do %>
      携帯プランの変更は、店頭・公式アプリ・ウェブサイトから可能です。アプリやウェブでは24時間対応しており、数分で完了します。
    <% end %>
    <%= render 'accordion_row',
               title: "機種変更時のデータ移行はできますか？" do %>
      機種変更時、データ移行はスタッフがサポートします。また、クラウドサービスやアプリを使えば簡単に自分で移行も可能です。
    <% end %>
    <%= render 'accordion_row',
               title: "解約の手続き方法を教えてください。" do %>
      解約手続きは、契約者ご本人が店頭で行う必要があります。身分証明書をご持参ください。一部プランはウェブでの手続きも可能です。
    <% end %>
  </div>
```

* アコーディオンを表示するERBです
* アコーディオンの各行は`accordion_row` partialを使ってコンポーネント化しています。
    * なおこのpartialは`do end`ブロックと`yield`を使って、コードをスッキリさせています。この使い方は[Rails Guide](https://railsguides.jp/layouts_and_rendering.html#シンプルなビューでパーシャルを使う)でも紹介されています

### `accordion_row` partial --- accordion-row-partial

```erb:app/views/components/_accordion_row.html.erb
<div class="py-4 border-b border-gray-300"
     data-controller="accordion">
  <button class="group w-full flex justify-between text-xl cursor-pointer"
          data-action="click->accordion#toggle"
          data-accordion-target="trigger"
          aria-expanded="false">
    <span><%= title %></span>
    <div class="group-aria-[expanded=true]:rotate-180 pt-2 transition-all duration-300">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
      </svg>
    </div>
  </button>
  <div data-accordion-target="revealable" class="h-0 overflow-hidden transition-all duration-300 text-sm">
    <div class="mt-4"><%= yield %></div>
  </div>
</div>
```

* アコーディオンの各行をコードしているpartialです
* `data-controller="accordion"`となっている`<div>`で、上述の`AccordionController` Stimulus controllerに接続します
* `<button>`に`data-action="click->accordion#toggle"`があります。つまりこのボタンがクリックされると`AccordionController`の`toggle()`メソッドが呼び出されます
   * 上述したように`toggle()`メソッドはこの`<button>`のステートを変更し、`aria-expanded="false"`を`"true"`に書き換えます
   * SVGアイコン(下向き矢印)を囲む`<div>`には`class="group-aria-[expanded=true]:rotate-180`がついています。これは親の`<button>`要素の`aria-expanded`属性に反応して、`"true"`ならば180度回転するものです。つまり`AccordionController`のステートの変化に反応している表示を変えています。
* `data-accordion-target="revealable"`となっているところが、アコーディオンの開閉で見え隠れする箇所です
   * `data-accordion-target="revealable"`により、`AccordionController`からは`this.revealableTargets`として簡単にアクセスできます。
   * トランジションを使いますので、単純に`hidden`で隠す訳にはいきません。`h-0 overflow-hidden`で隠して、徐々に高さを変える隠し方をしています。`AccordionController`の`#toggleRevealableTargets()`の処理です
   * 現場ではCSSの限界のためこのような記述をしています。将来的にはCSSが進歩して、ここのコードは不要になるでしょう

## native版のコード --- code-native

```erb:app/views/components/accordion_row_native.html.erb
<div class="py-4 border-b border-gray-300">
  <details class="group">
    <summary class="flex cursor-pointer list-none items-start justify-between text-xl marker:content-none">
      <span><%= title %></span>
      <span class="pt-2 transition-transform duration-300 group-open:rotate-180" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
        </svg>
      </span>
    </summary>
    <div class="text-sm">
      <div>
        <div class="mt-4"><%= yield %></div>
      </div>
    </div>
  </details>
</div>
```

* ステートは全てnativeの`<details>`タグが管理するため、JavaScriptが不要になっています
* `<summary>`はnativeに表示非表示が切り替わりますのでJavaScriptはやはり不要です。滑らかなトランジションを実現するCSSがまだ主要ブラウザで十分にサポートされていないため、今回はトランジションさせていません。近い将来にトランジションもnativeで可能になるはずです
* SVGアイコン(下向き矢印)は`<details>`, `<summary>`はnativeにサポートしていませんが、開閉状態は`<summary>`の`open`属性に反映されますので、`class="group-open:rotate-180"`で検知して、CSSを使って表示を変更しています

## まとめ --- summary

* アコーディオンをStimulusで実装する方法を紹介しました
* ステートは基本的には`aria-expanded`に持たせていますが、トランジションの都合でうまくいかないところはStimulus ControllerからJavaScriptで操作しています。またJavaScriptでDOMを書き換えないといけない箇所(今回はa11y関連)はStimulus Controllerで対処しています
* 近い将来はStimulus Controllerさえ不要になり、全てJavaScriptなしでアコーディオンが作れるようになる見込みです
