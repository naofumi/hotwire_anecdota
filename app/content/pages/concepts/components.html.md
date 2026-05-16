---
title: コンポーネント(UI部品)の考え方
layout: article
order: 170
published: true
---

## React的なコンポーネントが全てではない --- react-components-are-not-the-only-way

Reactのコンポーネントは、JavaScript関数を使ってUIを部品の組み合わせとして考える商法です。ただし**数多くある手法の中の一つでしかありません**。他にも部品化の手法はありますし、Reactの手法が特別に優れているわけでもありません。

NativeのHTML, CSS, JavaScriptにもUIを部品化する手法があります。またHotwireはReactと異なりますので、Reactの部品化手法に縛られる必要はありません。どちらかというとnativeな方法がより適していると思います。

## Native HTML, CSS, JavaScriptの部品化手法 --- componentize-with-native 

Nativeな部品化手法では、HTML, CSS, JavaScriptをそれぞれ組み合わせます。

```html
<!-- シンプルなボタン部品 -->
<button class="btn btn--primary">Welcome</button>

<!-- 異なるデザインを変更したボタン部品 -->
<button class="btn btn--secondary">Welcome</button>

<!-- デザインをそのままにリンクとしての動作を持つようにしたボタン部品 -->
<a href="/welcome" class="btn btn--secondary">Welcome</a>

<!-- クリック時にalertが出るようにしたボタン部品 -->
<button data-js-alert="Warning!!" class="btn btn--primary">Welcome</button>
<script>
  document.querySelector("button[data-js-alert]")
          .addEventListener("click", () => { alert(this.dataset.jsAlert) })
</script>

<!-- クリック時にalertが出し、かつデザインを変更したボタン部品 -->
<button data-js-alert="Warning!!" class="btn btn--danger">Welcome</button>
```

上記では`<button>`, `<a>`の各タグ、`btn`, `btn-primary`, `btn-secondary`, `btn-warning`のクラス名、あるいは`<script>`タグの中のJavaScriptがそれぞれ部品として機能し、自在に組み合わせられているのがわかります。

## Hotwire/ERBの部品化手法 --- modularize-with-hotwire

ERBのモジュール化手法として Ruby on Railsがデフォルトで持っているview helper, partialsはもちろん使います。

ただしReactにしばしばあるような細かいコンポーネント化を目指して、例えばボタンの一つ一つをhelperにする必要はありません。またViewComponentのようなライブラリを使う必要もありません。

例えば下記のような button helper を作るのは必ずしも必要ありません。

```ruby:buttons_helper.rb
BUTTON_TYPES = {
  primary: "bg-blue-500",
  secondary: "bg-gray-500",
  danger: "bg-red-500",
}.freeze

def button(text, type)
  tag.button text, class: BUTTON_TYPES.fetch(type)
end
```

```erb:button.html.erb
<%= button "Welcome", :primary %>
```

代わりに下記のように書けば十分です。注目していただきたいのは、**CSSだけでコンポーネントの役割を果たしていることです**。

```css:buttons.css
.btn { ... }
.btn--primary {
  background-color: #3B82F6; 
}
.btn--secondary { 
  background-color: #6B7280; 
}
.btn--danger {
  background-color: #EF4444; 
}
```

```erb:button.html.erb
<%= button "Welcome", class: "btn btn--primary" %>
```

さらに動作をつけるのであれば下記のように、Stimulus controllerをHTMLに追加すれば良いのです。なお重要なポイントとして、この`alertable_controller`部品はどこでも使えるようになります。ボタンとは関係のないところでも使えます。これがStimulusの大きな特徴で、**Reactよりも直感的に再利用がしやすいです**。

```javascript:alertable_controller.js
import {Controller} from "@hotwired/stimulus"

export default class extends Controller {
  static values = { message: String }
  
  alertable() {
    alert(this.messageValue)
  }
}
```

```erb:button.html.erb
<%= button "Welcome", 
           class: "btn btn--primary", 
           data: { controller: "alertable", 
                   action: "click->alertable#alert",
                   alertable_message_value: "Warning!!" } %>
```

## Reactコンポーネントの特徴と弱点 --- react-components-features-and-weaknesses

NativeなHTMLは単方向のツリー構造のなります。`<html>`タグの子として`<head>`、`<body>`タグがあり、`<body>`タグの下に`<main>`タグ、さらに下に`<article>`, `<section>`、さらに`<h1>`, `<h2>`, `<a>`や`<button>`などを繋げていきます。Reactのコンポーネントもこれと同じように単方向のツリー構造になっています。

![DOM-model](content_images/DOM-model.webp "mx-auto max-w-[400px]")
https://commons.wikimedia.org/wiki/File:DOM-model.svg

シンプルな構造はツリーとして整理できます。しかし現実の世の中では、ツリーとは無関係に情報やUIを整理する必要があります。例えばプライマリーカラーを`<h1>`文字色でも使い、`<button>`でも使うこともあるでしょう。また`<button>`と同じデザインの`<a>`タグを作る必要も出てきます。こうなるとツリー構造でUIを整理するのではなく、むしろ構造にとらわれずに横断的にUIを調整しなければなりません。

NativeなCSSやJavaScript、さらにこれを整理するために生まれた[BEM命名規則](https://qiita.com/takahirocook/items/01fd723b934e3b38cbbc)などは、UIデザインの多様性をうまく横断的に整理するのに役立ちます。上に示したように、BEMをうまく使うことで柔軟性の高いUI部品を組み立てることができます。

この辺りの話はプログラムコードの整理方法にも共通します。例えば単一継承のオブジェクト指向を指向したJava、横断的な機能追加方法として`include`等のmix-inを採用したRuby。またシンプルなツリー構造を持つReactのコンポーネント構造に対して、横断的に機能を追加する`use*`などのフック。多様性に対応するために、単純なツリー構造と横断的な横串を組み合わせています。

## まとめ --- conclusion

* Hotwireを使ってUIを部品化する際、Reactのようなコンポーネントを意識する必要はありません。むしろnativeなHTML, CSS, JavaScriptを活かした方法が良いでしょう
* Railsでview helperやViewComponentを駆使して、Reactコンポーネント様の構造を無理に再現する必要はありません。実際にやってみるとすぐに複雑化します。それよりはCSSをBEM的に使う方がスッキリする場合が多いと思います
* HotwireのようにHTML, CSS, JavaScriptを分けてしまった方がさまざまな組み合わせが容易に作れ、再利用性が高いとも言えます
