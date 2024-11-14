---
title: アコーディオンの作成
layout: article
order: 005
published: true
---

ここで作るのは下記のようなUIです。

![accordion.mov](content_images/accordion.mov "mx-auto max-w-[500px]")

[デモはこちら](/components/accordion)に用意しています。

## 考えるポイント --- thinking-points

1. 今回はサーバから非同期でリクエストを投げる必要がありません
   1. アコーディオンを開いた時のデータは最初にページをロードした時にすでに取り込まれています
   2. 従って今回はStimulusだけで実装します
   3. なお、アコーディオンをブラウザネイティブのチェックボックスで実装する方法もありますが、今回は使いません
2. Stimulusを使うことが決定したら、次はStimulus Controllerの制御範囲を考えます。つまり画面のどこをカバーするかです
   1. 今回のアコーディオンは、各行が独立して動いています。例えば一つの行を開いたら他の行が閉じるというアコーディオンも考えられますが、それではないです（UX的には最悪だと思いますが...）
   2. 各行が独立していますので、Stimulus Controllerの制御範囲は行単位で良さそうです
3. Stimulus Controllerは[Values](https://stimulus.hotwired.dev/reference/values)でステートを持つことができます。しかし今回は画面の更新箇所が限定的でシンプルです。Valuesを使わず、直接HTML要素の`class`属性を変更するので十分でしょう

## コード --- code

### アコーディオンのview --- accordion-view

```erb:app/views/components/accordion.html.erb
  <div>
    <h2 class="text-4xl pb-8 border-b border-gray-300">
      Frequently Asked Questions
    </h2>
    <%= render 'accordion_row',
               title: "吾輩は猫である。名前はまだ無い。" do %>
      どこで生れたかとんと見当けんとうがつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。
    <% end %>
    <%= render 'accordion_row',
               title: "この書生の掌の裏でしばらくはよい心持に坐っておった" do %>
      ふと気が付いて見ると書生はいない。たくさんおった兄弟が一疋ぴきも見えぬ。肝心かんじんの母親さえ姿を隠してしまった。その上今いままでの所とは違って無暗むやみに明るい。眼を明いていられぬくらいだ。はてな何でも容子ようすがおかしいと、のそのそ這はい出して見ると非常に痛い。吾輩は藁わらの上から急に笹原の中へ棄てられたのである。
    <% end %>
    <%= render 'accordion_row',
               title: "吾輩の主人は滅多めったに吾輩と顔を合せる事がない" do %>
      職業は教師だそうだ。学校から帰ると終日書斎に這入ったぎりほとんど出て来る事がない。家のものは大変な勉強家だと思っている。当人も勉強家であるかのごとく見せている。しかし実際はうちのものがいうような勤勉家ではない。
    <% end %>
  </div>
```

* アコーディオンを表示するERBです
* アコーディオンの各行は`accordion_row` partialを切っています
    * なおこのpartialは`do end`ブロックと`yield`を使って、コードをスッキリさせています。この使い方は[Rails Guide](https://railsguides.jp/layouts_and_rendering.html#シンプルなビューでパーシャルを使う)でも紹介されています

### `accordion_row` partial --- accordion-row-partial

```erb:app/views/components/_accordion_row.html.erb
<div class="py-4 border-b border-gray-300"
     data-controller="accordion"
     data-accordion-toggle-switch-class="rotate-180">
  <h3 class="flex justify-between text-xl cursor-pointer">
    <span><%= title %></span>
    <div data-accordion-target="switch"
         data-action="click->accordion#toggle" 
         class="pt-2 transition-all duration-300">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
      </svg>
    </div>
  </h3>
  <div data-accordion-target="revealable" class="h-0 overflow-hidden transition-all duration-300 text-sm">
    <div class="mt-4"><%= yield %></div>
  </div>
</div>
```

* アコーディオンの各行をコードしているpartialです
* `data-accordion-target="revealable"`となっているところが、アコーディオンの開閉で見え隠れする箇所です
   * `data-accordion-target="revealable"`なので、Stimulus controllerから制御される箇所です
   * アニメーションを使いますので、単純に`hidden`で隠す訳にはいきません。`h-0 overflow-hidden`で隠して、徐々に大きくなるアニメーションができるような隠し方をしています
* `data-controller="accordion"`となっているところで、`accordion` Stimulus controller(後述)に接続します
    * `data-accordion-toggle-switch-class="rotate-180"`のところは、アコーディオンを開閉させたとり、ボタンをどのように変化させ、ユーザにフィードバックを与えるかを記しています。ここでは180度回転させます
* `data-accordion-target="switch"` `data-action="click->accordion#toggle"`のところはアコーディオン開閉ボタンです
    * `data-action="click->accordion#toggle"`は、「クリックしたら`accordion` controllerの`toggle()`メソッドを実行すること」という意味です。イベントハンドラになります
    * `data-accordion-target="switch"`は、ここがStimulus controllerから制御される箇所だと示しています。アコーディオン開閉時に矢印を回転させるためです

StimulusはこのようにHTMLをcontrollerに接続します。大きく、２つの指定をしています

* どのHTML要素からStimulus controllerにイベントを送るか
* どのHTML要素がStimulusから制御され、表示が更新されるか

## Accordion Controller --- accordion-controller

```js:app/javascript/controllers/accordion_controller.js
import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="accordion"
export default class extends Controller {
  static targets = ["revealable", "switch"]
  static classes = ["toggleSwitch"]

  connect() {
  }

  toggle(event) {
    this.#toggleRevealableTargets()
    this.#toggleSwitchTargets()
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

  #toggleSwitchTargets() {
    this.switchTargets.forEach(target => {
      target.classList.toggle(this.toggleSwitchClass)
    })
  }
}
```

* Stimulus Controllerの作り方は[ここ](/tips/how-you-should-create-stimulus-controllers)をご確認ください
* 空の`connect() {}`メソッド定義があります。これは`bin/rails g stimulus [controller名]`をやると自動的に作ってくれるもので私はそのまま残すことが多いです
    * Stimulus controllerを繋げるときは、一歩一歩進めることが大切です。このメソッドの中に`alert('hello')`ってやるとcontrollerがちゃんとHTMLと繋がったことがわかりますので、Stimulusを使う第一歩で私は必ずこの確認をしています
    * StimulusとHTMLの接続は非常に動的で、もちろんIDEが静的解析をしてエラーは吐いてくれることはありません（HTML自身が非常に動的なため）。このため、一歩一歩、動作確認しながらcontrollerやaction, targetを繋げていく姿勢が大切です。これさえやれば、動的でも困ることはありません。
* `static targets = `, `static classes = `を使って、先ほどHTMLで指定した`data-accordion-target="switch"`, `data-accordion-target="revealable"`や`data-accordion-toggle-switch-class`と接続します。この辺りは公式ドキュメントに記載されていますのでご確認ください
* target, class等を接続するとき、kebab-case (例えば"toggle-switch")からcamelCase (例えば"toggleSwitch")への変換をStimulusは自動的にやってくれます。しかし決してわかりやすくはないので、ここも一歩一歩、動作確認しながら正しく繋がっていることを確認した方が良いでしょう。繰り返しますが、こまめに動作確認をすれば動的な環境のプログラミングは快適です。下手にTypeScriptをやっていると、コードを書いてから動作確認をするまでのタイムラグを長くする癖がついてしまいます。この癖があると動的なプログラミングは辛くなります
* 今回はActionは`toggle()`だけです。`data-action="click->accordion#toggle"`によって呼ばれます。
    * 私はActionはなるべく"thin"にします。Ruby on Railsの"thin controller"と同じ発想です。実際にtargetを変更するメソッド（プライベートメソッド）を別に定義して、これを呼び出す形をとるのが好みです

## まとめ --- summary

* アコーディオンを実装する方法としてStimulusを選択した理由を解説しました
* アコーディオンをStimulusで実装する方法を紹介しました
