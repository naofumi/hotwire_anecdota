---
title: コンポーネントの考え方
layout: article
order: 500
---

## React的なコンポーネントが全てではない --- react-components-are-not-the-only-way

Reactのコンポーネントは、JavaScript関数を使ってフロントエンド部品を構成するモジュール化の手法です。ただし**数多くある手法の中の一つでしかありません**。他にもモジュール化の手法はありますし、Reactの手法が特に良いわけでもありません。

NativeのHTML, CSS, JavaScriptにもモジュール化の手法があります。そしてHotwireに適したフロントエンドのモジュール化は、Reactの考え方に縛られず、HTML, CSS, JavaScriptのnativeが方法をより活用することではないかと思います。

## Native HTML, CSS, JavaScriptのモジュール化手法 --- modularize-with-native 

Nativeなモジュール化手法では、HTML, CSS, JavaScriptをそれぞれ組み合わせます。

```html
<!-- シンプルなボタン -->
<button class="btn btn--primary">Welcome</button>

<!-- 異なるデザインを変更したボタン -->
<button class="btn btn--secondary">Welcome</button>

<!-- デザインをそのままにリンクとしての動作を持つようにしたボタン -->
<a href="/welcome" class="btn btn--secondary">Welcome</a>

<!-- クリック時にalertが出るようにしたボタン -->
<button data-js-alert="Warning!!" class="btn btn--primary">Welcome</button>
<script>
  document.querySelector("button[data-js-alert]")
          .addEventListener("click", () => { alert(this.dataset.jsAlert) })
</script>

<!-- クリック時にalertが出し、かつデザインを変更したボタン -->
<button data-js-alert="Warning!!" class="btn btn--danger">Welcome</button>
```

上記では`<button>`, `<a>`の各タグ、`btn`, `btn-primary`, `btn-secondary`, `btn-warning`のクラス名、あるいは`<script>`タグの中のJavaScriptがそれぞれモジュールとして機能し、自在に組み合わせられているのがわかります。

## Hotwireのモジュール化手法 --- modularize-with-hotwire

Hotwireのモジュール化手法として Ruby on Railsがデフォルトで持っているview helper, partialsはもちろん使います。ただしReactにしばしばあるような細かいコンポーネント化を目指して、例えばボタンの一つ一つをhelperにする必要はありません。またViewComponentのようなライブラリを使う必要もありません。

例えば下記のような button helper を作るのは不要です。

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

さらにStimulusで動作をつけるのであれば下記のように、JavaScriptを制御する属性をHTMLに追加すれば良いのです。なお重要なポイントとして、この`alertable_controller`はどこでも使えるようになります。ボタンとは関係のないところでも使えます。これがStimulusの大きな特徴で、**Reactよりも直感的に再利用がしやすいです**。

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

* Hotwireでモジュール化する際、Reactのようなコンポーネントを意識する必要はありません。むしろnativeなHTML, CSS, JavaScriptを活かした方法が良いでしょう
* Railsでview helperやViewComponentを駆使して、無理にReactのコンポーネントを再現する必要はありません。実際にやってみるとすぐに複雑化します。それよりはnativeな方法の方がスッキリする場合が多いと思います
* HotwireのようにHTML, CSS, JavaScriptを分けてしまった方がさまざまな組み合わせが容易に作れ、再利用性が高いとも言えます
