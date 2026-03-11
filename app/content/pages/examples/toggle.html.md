---
title: トグル
layout: article
order: 10
published: true
descriptors:
  component_names: 
    - Toggle
    - Switch
  server_request: false
  state_management:
    - aria-checkedもしくはHTML checkbox
  technologies: 
    - Stimulus
    - HTML Checkbox
  demo_urls: 
    - ["Stimulus版", "/components/toggle_stimulus"]
    - ["Checkbox版", "/components/toggle_checkbox"]
  related_pages:
    - /concepts/stimulus-tips.html.md
---

ここで作るのは下記のようなUIです。

![toggle.mov](content_images/toggle.mov)

２つの方法で作ります。デモはこちらです: [Stimulusバージョン](/components/toggle_stimulus "demo")と[Checkboxバージョン](/components/toggle_checkbox "demo")です。

## 考えるポイント --- points-to-consider

* サーバとの非同期通信
  * 不要
* ステート管理：トグルのオン・オフステート
    * `aria-checked` HTML属性を使うやり方 → JavaScript要
    * HTMLの`<input type="checkbox">`を使うやり方 → JavaScript不要



## Stimulus版のコード --- stimulus-code

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

* トグルは`<button>`タグで実装しています。`data-controller="switch"`で`SwitchController(Stimulus)`を接続します
* HTML属性の`data-action="click->switch#toggle keydown.space:stop:prevent->switch#toggle"`により、このトグルはマウスのクリックおよびスペースキーに応答するようになります。スペースキーでも使えることははアクセシビリティの要件です
* HTML属性の`data-action`により、`SwitchController(Stimulus)`の`toggle()`が呼び出されます。ここでは`aria-checked`属性を"true"/"false"の間で切り替えています
* `<button>`タグのCSS classの`aria-checked:bg-indigo-600`により、`aria-checked="true"`の時だけボタンの背景が青く表示されるようになります
* `<span aria-hidden="true" ...>`の要素はトグルの真ん中の丸いところですが。CSSクラスに`group-aria-checked:translate-x-5`と書くことで、CSSだけで左右に移動させます。

## Checkbox版のコード(JavaScriptを使わない) --- without-javascript

昔からあるやり方ですが、ブラウザのネイティブな機能をさらに活かして、JavaScriptを全く使わないアプローチもあります。

HTMLのcheckboxを使います。

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

## React的思考との対比 --- summary

* React的な発想だと、コンポーネントに１つのステートを持たせて、その内容によって２つのHTML要素のマークアップそのものを変えることが多いでしょう。これはReactでは[条件付きレンダー](https://ja.react.dev/learn/conditional-rendering)と呼ばれています
* しかしStimulusではHTMLの変更は一般に最小化します。今回のStimulus版では、１つのHTML要素だけを変更し、CSSにより他のHTML要素の表示は自動的に変更されました。また Checkbox版では`<input type="checkbox">`のステートを使用しましたので、HTMLの変更は一切不要でCSSのみで実装できました。
 
