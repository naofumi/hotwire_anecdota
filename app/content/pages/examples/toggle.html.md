---
title: トグル
layout: article
order: 005
published: true
---

ここで作るのは下記のようなUIです。

![toggle.mov](content_images/toggle.mov)

２つの方法で作ります。デモはこちらです: [Stimulusバージョン](/components/toggle_stimulus)と[Checkboxバージョン](/components/toggle_checkbox)です。

## 考えるポイント --- points-to-consider

1. 簡単な表示の切り替えですので、サーバに非同期でリクエストを投げる必要はありません
   1. Stimulusだけで実装します
   2. ただしStimulusどころか、JavaScriptを使わない方法もありますので、こちらも紹介します
2. Stimulus Controllerの制御範囲ですが、今回は一つのウィジェットだけですので、自明です
3. Stimulus Controllerがどのようにステートを持つかを考えます
   1. CSSクラスにステートを持たせるやり方
      1. 変更が必要な要素は２つです。トグルそのものは左右に動きます。そして背景はグレイから青に変わります（`aria-checked`も設定しまう）
      2. ２つの要素の`class`属性をStimulus Controllerの中から変更します
   2. ルートレベルのHTML属性にステートを持たせ、CSSセレクタでこれを表示に反映させるやり方
      1. 変更が必要な要素は１つだけです。ルートとしては`data-controller=`を記載した、Stimulus controllerが接続された要素を選択します
      2. ルートで変更するHTML属性は`aria-checked`を選択します。将来的にデザインを変更しても、ここは変わらないからです
      3. CSSの擬似属性`:checked`を使えば、CSSだけでトグルを左右に動かしたり、背景をグレイから青に変更できます

今回は3-bのやり方を紹介し、その後にStimulus controllerを使わないやり方を紹介します。

なお私は3-bのやり方はCQRSの考え方に似ている[^cqrs]と思っていて、とても気に入っています。

[^cqrs]: CQRSは[Greg Youngなどが2010年に提唱したアーキテクチャ](https://cqrs.wordpress.com/wp-content/uploads/2010/11/cqrs_documents.pdf)でデータの更新と読み出しを単に分けるのを超えて、全く分離して異なる仕組み・構造にするものです。ここで紹介しているやり方は、一方でJavaScriptによってステート（`aria-checked`属性）を書き込みます(command)。他方ではCSSだけでステートを読み出しています(query)。よってCQRS的なパターンではないかと思います。<br>これに対してReactは自在にHTMLを変更できますので、同じコンポーネントの中でステートを更新し、かつHTML要素を書き換えることになりがちです。その結果として不必要な依存性が生まれやすいのではないかと思います。

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
* `<span aria-hidden="true" ...>`の要素はトグルの真ん中の丸いところで、これは左右に動く必要があります。これは`group-aria-checked:translate-x-5`で実装できます

## まとめ --- summary

* 今回のトグルは、１つのイベントで２つのHTML要素の表示が変更されるものです
* React的な発想だと、コンポーネントに１つのステートを持たせて、その内容によって２つのHTML要素のマークアップそのものを変えることが多いでしょう
* しかしStimulus的な発想では、HTML要素のマークアップを変えるのは１つのHTML要素だけで、CSSにより、他のHTML要素の表示変更はそれに従属させます

Hotwireの考え方は、なるべくブラウザのネイティブな機能を活かし、それを拡張していくというものです。バランスよくHTML/CSS/JavaScriptの機能を使っていきます。それに対してReactを含めたJavaScriptヘビーなアプローチでは、ブラウザ機能をJavaScriptで置き換えていく傾向があります。Hotwireでこれをやってしまうと無駄にJavaScriptが多くなってしまいますので、頭を切り替えた方が良いでしょう。
 
## JavaScriptを使わないアプローチ --- without-javascript

昔からあるやり方ですが、ブラウザのネイティブな機能をさらに活かして、JavaScriptを全く使わないアプローチもあります。HTMLのチェックボックス要素を使うものです。

```erb:app/views/components/toggle_checkbox.html.erb
<% set_breadcrumbs [["Toggle Checkbox", component_path(:toggle)]] %>

<%= render 'template',
           title: "Toggle Checkbox",
           description: "Toggle implemented with a Checkbox" do %>
  <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->

  <div class="text-center">
  <label class="group has-[:checked]:bg-indigo-600 bg-gray-200 relative
                inline-flex h-6 w-11 flex-shrink-0 cursor-pointer select-none
                rounded-full border-2 border-transparent
                transition-colors duration-200 ease-in-out outline-none
                has-[:focus]:ring-2 active:ring-2 ring-indigo-600
         ring-offset-2"
         role="switch"
  >
    <input type="checkbox" class="opacity-0 w-0 border-none"/>
    <span class="sr-only">Use setting</span>
    <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
    <span aria-hidden="true"
          class="group-has-[:checked]:translate-x-5 translate-x-0
                pointer-events-none inline-block h-5 w-5
                rounded-full bg-white shadow ring-0
                transition duration-200 ease-in-out"
    ></span>
  </label>
  </div>
<% end %>
``` 

* HTMLチェックボックス要素はネイティブでステートを持ち、トグル的にオン・オフを切り替えます
* HTMLチェックボックス要素のステートは`:checked`擬似セレクタを使ってCSSから読み取れます
* さらに`:has`擬似セレクタと組み合わせると、チェックボックスステートに応じてトグル全体の表示をCSSだけで切り替えられます
* ネイティブなHTML要素なので、アクセシビリティーの要件（スペースキーで切り替えられること）なども満たします
