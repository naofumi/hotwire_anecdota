---
title: アコーディオン
layout: article
order: 20
published: true
---

ここで作るのは下記のようなUIです。

![accordion.mov](content_images/accordion.mov "mx-auto max-w-[500px]")

[デモはこちら](/components/accordion)に用意しています。

## 考えるポイント --- thinking-points

![interactive-flow-hotwire.webp](content_images/interactive-flow-hotwire.webp "mx-auto max-w-[500px]")

1. 今回はサーバから非同期でデータを受け取る必要がありません
   1. Stimulusだけで実装します
   2. HTMLのcheckboxやradioを使う方法もありますが、今回は紹介しません
2. Stimulus Controllerの制御範囲を考えます。つまり画面のどこをカバーするかです
   1. 今回のアコーディオンは、各行が独立して動いています。例えば一つの行を開いたら他の行が閉じるというアコーディオンも考えられますが、それではないです
   2. 各行が独立していますので、Stimulus Controllerの制御範囲は行単位で良さそうです
3. Stimulus Controllerのステートを検討します
   1. アクセシビリティを調べると、アコーディオンでは[`aria-expanded`を使うのが良さそうです](https://www.accessibility-developer-guide.com/examples/widgets/accordion/)
   2. `aria-expanded`をCSSで読み取るアプローチを採用します
   3. ただしアコーディオンを拡大する時のCSSトランジションは、拡大時の高さが指定されないとうまくいきません。このためCSSではなくStimulus controllerで表示を変更します

## コード --- code

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
* アコーディオンの各行は`accordion_row` partialを切っています
    * なおこのpartialは`do end`ブロックと`yield`を使って、コードをスッキリさせています。この使い方は[Rails Guide](https://railsguides.jp/layouts_and_rendering.html#シンプルなビューでパーシャルを使う)でも紹介されています

### `accordion_row` partial --- accordion-row-partial

```erb:app/views/components/_accordion_row.html.erb
<div class="py-4 border-b border-gray-300"
     data-controller="accordion">
  <h3 class="flex justify-between text-xl cursor-pointer">
    <span><%= title %></span>
    <button aria-expanded="false"
            class="aria-[expanded=true]:rotate-180 pt-2 transition-all duration-300"
            data-action="click->accordion#toggle">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
      </svg>
    </button>
  </h3>
  <div data-accordion-target="revealable" class="h-0 overflow-hidden transition-all duration-300 text-sm">
    <div class="mt-4"><%= yield %></div>
  </div>
</div>
```

* アコーディオンの各行をコードしているpartialです
* `data-controller="accordion"`となっているところで、`AccordionController` Stimulus controllerに接続します
* `<button>`のところは`class="aria-[expanded=true]:rotate-180"`がありますので、`aria-expanded`属性の値によって表示が変わります
* `data-action="click->accordion#toggle"`のところはアコーディオン開閉ボタンです
    * `data-action="click->accordion#toggle"`は、「クリックしたら`accordion` controllerの`toggle()`メソッドを実行すること」という意味です。イベントハンドラになります
* `data-accordion-target="revealable"`となっているところが、アコーディオンの開閉で見え隠れする箇所です
   * `data-accordion-target="revealable"`なので、Stimulus controllerから制御される箇所です
   * アニメーションを使いますので、単純に`hidden`で隠す訳にはいきません。`h-0 overflow-hidden`で隠して、徐々に大きくなるアニメーションができるような隠し方をしています
   * CSSだけでトランジションができないためにStimulusから制御する必要があります。そのために`target`になっています

### Accordion Controller --- accordion-controller

```js:app/javascript/controllers/accordion_controller.js
import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="accordion"
export default class extends Controller {
  static targets = ["revealable"]

  connect() {
  }

  toggle(event) {
    event.currentTarget.ariaExpanded = event.currentTarget.ariaExpanded == "true" ? "false" : "true"
    this.#toggleRevealableTargets()
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
* 空の`connect() {}`メソッド定義があります。これは`bin/rails g stimulus [controller名]`をやると自動的に作ってくれるもので私はそのまま残すことが多いです
    * Stimulus controllerを繋げるときは、一歩一歩進めることが大切です。このメソッドの中に`alert('hello')`ってやるとcontrollerがちゃんとHTMLと繋がったことがわかりますので、Stimulusを使う第一歩で私は必ずこの確認をしています
    * StimulusとHTMLの接続は非常に動的で、もちろんIDEが静的解析をしてエラーは吐いてくれることはありません（HTML自身が非常に動的なため）。このため、一歩一歩、動作確認しながらcontrollerやaction, targetを繋げていく姿勢が大切です。これさえやれば、動的でも困ることはありません。
* `static targets = `を使って、先ほどHTMLで指定した`data-accordion-target="switch"`, `data-accordion-target="revealable"`と接続します
* 今回はActionは`toggle()`だけです。`data-action="click->accordion#toggle"`によって呼ばれます
   * `toggle()`が呼び出されると
      * アコーディオンの`<button>`の`aria-expanded`属性が変化します。`aria-expanded`属性はCSS擬似セレクタで監視されていますので、ボタンの表示が変化します 
      * `#toggleRevealableTargets()`メソッドが呼ばれ、`revealable`の表示・非表示が変わります（アニメーションの都合上,`height`で制御しています） 

## まとめ --- summary

* アコーディオンをStimulusで実装する方法を紹介しました
* ステートは基本的には`aria-expanded`に持たせていますが、アニメーションの都合上でうまくいかないところはStimulus ControllerからJavaScriptで操作しています

なお今回のアクセシビリティは簡易的にやっただけですので、抜けている箇所があります。この点はご了承ください。
