---
title: トグル
layout: article
order: 10
published: true
---

ここで作るのは下記のようなUIです。

![toggle.mov](content_images/toggle.mov)

２つの方法で作ります。デモはこちらです: [Stimulusバージョン](/components/toggle_stimulus)と[Checkboxバージョン](/components/toggle_checkbox)です。

## 考えるポイント --- points-to-consider

![interactive-flow-hotwire.webp](content_images/interactive-flow-hotwire.webp "mx-auto max-w-[500px]")

1. サーバに非同期でリクエストを投げる必要はありません
   1. Stimulusだけで実装します
2. Stimulus Controllerの制御範囲ですが、今回は一つのウィジェットだけですので、そこだけ囲めば十分です
3. Stimulus Controllerがどのようにステートを持つかを考えます
   1. CSSクラスにステートを持たせるやり方
      1. 変更が必要な箇所は３つです。トグルを左右に動かします。さらに背景をグレイから青に変えます。加えて`aria-checked`も設定します
      2. Stimulusからこの全てを変更するのは大変ですので、採用しません
      3. なお上記の判断はTailwind CSSを使っている場合が前提です。CSSの親子関係を使えばCSSクラスを変更する箇所は減りますので、Stimulusでは親だけを変更する使い方ができます
   2. ルートレベルのHTML属性にステートを持たせ、CSSセレクタでこれを表示に反映させるやり方
      1. トップのHTML要素に`aria-checked`をつけます
      2. CSSの擬似属性`:checked`を使い、CSSだけでトグルを左右に動かしたり、背景をグレイから青に変更したりします
      3. これならばStimulusは１つのHTML要素に`aria-checked`をつけるだけですので、こちらを採用します



## コード --- code

```erb:app/views/components/toggle_stimulus.html.erb
<% set_breadcrumbs [["Toggle Stimulus", component_path(:toggle)]] %>

<%= render 'template',
           title: "Toggle Stimulus",
           description: "Toggle implemented with Stimulus" do %>
  <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
  <div class="text-center">
    <button type="button"
            class="group bg-gray-200 aria-checked:bg-indigo-600
            relative inline-flex h-6 w-11 flex-shrink-0
            cursor-pointer rounded-full border-2 border-transparent
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            role="switch"
            aria-checked="false"
            data-controller="switch"
            data-action="click->switch#toggle keydown.space:stop:prevent->switch#toggle"
    >
      <span class="sr-only">Use setting</span>
      <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
      <span aria-hidden="true"
            class="translate-x-0 group-aria-checked:translate-x-5
            pointer-events-none inline-block h-5 w-5
            rounded-full bg-white shadow ring-0
            transition duration-200 ease-in-out"
      ></span>
    </button>
  </div>
<% end %>
```

```js:app/javascript/controllers/switch_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
  }

  toggle() {
    this.element.ariaChecked = this.element.ariaChecked === "true" ? "false" : "true"
  }
}
```

* トグルは`<button>`タグで実装しています。`data-controller="switch"`でstimulus controllerを接続します
* `data-action="click->switch#toggle keydown.space:stop:prevent->switch#toggle"`により、このトグルはマウスのクリックおよびスペースキーに応答するようになります。スペースキーでも使えるはアクセシビリティの要件です
* `data-action`により、stimulus controllerの`toggle()`が呼び出されます。ここでは`aria-checked`属性を"true"/"false"の間で切り替えています
* `<button>`タグのCSS classの`aria-checked:bg-indigo-600`により、`aria-checked="true"`の時だけボタンの背景が青く表示されるようになります
* `<span aria-hidden="true" ...>`の要素はトグルの真ん中の丸いところで、これは左右に動く必要があります。これはCSSクラスに`group-aria-checked:translate-x-5`と書けば実現できます

## まとめ --- summary

* 今回のトグルは、１つのイベントで２つのHTML要素の表示が変更されるものです
* React的な発想だと、コンポーネントに１つのステートを持たせて、その内容によって２つのHTML要素のマークアップそのものを変えることが多いでしょう。これはReactでは[条件付きレンダー](https://ja.react.dev/learn/conditional-rendering)と呼ばれています
* しかしStimulusではHTMLの変更は一般に最小化します。今回はマークアップを変えるのは１つのHTML要素だけで、CSSにより、他のHTML要素の表示をそれに従属させます

Hotwireの考え方は、なるべくブラウザのネイティブな機能を活かし、それを拡張していくというものです。HTMLだけでなくCSSを混ぜながら、バランスよくHTML/CSS/JavaScriptの機能を使っていきます。

ブラウザ機能を多角的に検討することは、Hotwireを綺麗に書くコツの一つと言えます。
 
## JavaScriptを使わないアプローチ --- without-javascript

昔からあるやり方ですが、ブラウザのネイティブな機能をさらに活かして、JavaScriptを全く使わないアプローチもあります。こうした方がさらにHotwireっぽいと言えるでしょう。

HTMLのチェックボックス要素を使うものです。

[デモはこちらです](/components/toggle_checkbox)

```erb:app/views/components/toggle_checkbox.html.erb
<% set_breadcrumbs [["Toggle Checkbox", component_path(:toggle)]] %>

<%= render 'template',
           title: "Toggle Checkbox",
           description: "Toggle implemented with a Checkbox" do %>
  <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->

  <div class="text-center">
  <label class="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer select-none rounded-full border-2 border-transparent
                transition-colors duration-200 ease-in-out outline-none
                has-[:focus]:ring-2 active:ring-2 ring-indigo-600 ring-offset-2
          has-[:checked]:bg-indigo-600"
         role="switch"
  >
    <input type="checkbox" class="peer opacity-0 w-0 border-none"/>
    <span class="sr-only">Use setting</span>
    <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
    <span aria-hidden="true"
          class="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0
                 transition duration-200 ease-in-out
                 peer-[:checked]:translate-x-5"
    ></span>
  </label>
  </div>
<% end %>
``` 

* HTMLチェックボックス要素（`<input type="checkbox"...>`）はネイティブでステートを持ちます。動きとしてはトグル的にオン・オフを切り替えます
* HTMLチェックボックスのステートは`:checked`擬似セレクタを使ってCSSから読み取れます
* さらにTailwind CSSの`peer`擬似セレクタと組み合わせると、チェックボックスステートに応じてトグル全体の表示をCSSだけで切り替えられます
* ネイティブなHTML要素なので、アクセシビリティーの要件（スペースキーで切り替えられること）なども満たします

## 最後に --- final-words

Stimulusを使うコツとして、私は下記を意識するようにしています。

* Stimulusではブラウザのネイティブな機能をなるべく使います
   * アクセシビリティが簡単に実現できます
   * コードが少なくなりますので、メンテナンスがしやすくなります
* Stimulusを使う場合はステートを意識します。下記から適切な方法を選択します
   * ネイティブなHTML要素(`<input>`タグなど)のステートの活用を検討します
   * `aria`属性をステートとすることを検討します
   * CSSクラスをステートとすることを検討します
   * [StimulusのValues](https://stimulus.hotwired.dev/reference/values)をステートとすることを検討します
   * CSSクラスを使うかはStimulus Valuesステートを使うかの判断は、[CSSライブラリの選択に影響を受けます](/opinions/should_stimulus_controllers_change_classes)。Tailwind CSSの場合はStimulus Valuesを使いたくなります
* ステートをなるべくCSSだけで画面表示に反映させます（なるべくならHTMLを大きく変えません）
