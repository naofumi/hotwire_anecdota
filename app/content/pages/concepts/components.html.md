---
title: コンポーネント(UI部品)の考え方
layout: article
order: 40
published: true
---

## コンポーネントとは何か？ --- what-are-components

Reactなどの「モダン」フロントエンドでは、[コンポーネント](https://ja.react.dev/learn/your-first-component)を使います。コンポーネントはクラスまたは関数であり、引数(props)を渡すことで中身を変更したり、表示をカスタマイズできます。クラスまたは関数のため、任意に呼び出すことが可能であり、コンポーネントを組み合わせてより複雑なUIを組み立てられます。

Rails ERBは[partialsとhelper](/concepts/partial-helper-components)を使います。同様に関数を組み合わせて複雑なUIを組み立てることができます。またRailsでは[ViewComponent](https://viewcomponent.org/)や[Phlex](https://www.phlex.fun/)を使ってviewのコンポーネント化を行うこともできます。どれもReactコンポーネントと似た考え方で、クラスや関数に引数を渡すことで表示内容を変更したり、表示をカスタマイズします。PHPも関数や`require`で同じことを実現してきました。

しかしviewを部品化する方法はこれだけではありません。例えば[BEMはCSSの命名規則を通してviewを再利用可能な部品に分解します](https://getbem.com/)。クラスや関数を使うのではなく、CSSの継承やコンポジションを活かしながら、命名規則を設けることでコンポーネントに整理していると言えます。

Reactの場合は全面的にコンポーネントを利用する傾向が強く、これをサポートするツールも数多くあります。Hotwireの場合はそれぞれのアプローチを組み合わせながら、適材適所で活用するのが良いと思います。

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

次に同じことをHotwire/ERBでやってみます。

## Hotwire/ERBの部品化手法 --- modularize-with-hotwire

ERBのモジュール化手法として Ruby on Railsがデフォルトで持っているview helper, partialsはもちろん使います。

ただしReactにしばしばあるような細かいコンポーネント化を目指して、例えばボタンの一つ一つをhelperにする必要はありません。またViewComponentのようなライブラリを使う必要も普通はありません。

例えば下記のような button helper を作ることもできますが、必ずしも必要ありません。

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

さらに動作をつけるためには下記のように、Stimulus controllerをHTMLに追加します。なお重要なポイントとして、この`alertable_controller`部品はどこでも使えるようになります。ボタンとは関係のないところでも使えます。これがStimulusの大きな特徴で、**Reactよりも再利用がしやすいです**。

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

## まとめ --- conclusion

* Hotwireを使ってUIを部品化する際、Reactのようなコンポーネントを意識する必要はありません。NativeなHTML, CSS, JavaScriptで十分だったり、むしろnativeの方が良いケースもあるでしょう。
* Railsでview helperやViewComponentを駆使して、Reactコンポーネント様の構造を無理に再現する必要はありません。それよりはCSSをBEM的に使う方がスッキリする場合も多いと思います。
* もちろんERBのpartial, helperやViewComponent, Phlexを使えばよりReactに近いコンポーネントを作ることができます。ケースバイケースで判断することになります。
