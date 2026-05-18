---
title: 「いいね」ボタン (Optimistic)
layout: article
order: 30
published: true
show_siblings: true
descriptors:
  parent: /examples/like_button
  server_request: true
  technologies:
    - Turbo Streams
    - Stimulus
  related_pages:
    - /concepts/post-redirect-get
    - /concepts/server-perspective-frames-vs-streams
  demo_urls:
    - ["Optimistic UIによるデモ", "/todos?variant=optimistic"]
---

## Optimistic UI版の特徴

- サーバとのデータ通信方法はTurbo Streams版と同じにしています。ただしTurbo Streamsを使う必要性はなく、Turbo Drive版とも問題なく組み合わせることができます。
- Optimistic(楽観的)UIは、Turbo Streamsのリクエストを送信するのと同時に、サーバのリクエストを待つことなく画面表示を変更するだけです。今回は下記の２つの方法でこれを行なっています。
   - HTMLの`<input type="checkbox">`(チェックボックス)を使用します。**HTMLの`input`要素はもともとOptimistic UIであり、UI操作の結果を直ちに画面に反映させます**[^optimistic-elements]。チェックボックスのステートをCSS擬似セレクタで読み取り、表示を変えます。
   - Stimulus controller `TodoLikesController`を使用して、「いいね」の数をJavaScriptで更新します。
   - なお、チェックボックスを使用せずに楽観的UIをStimulus controllerで実装することも可能ですが、今回は紹介しません。

[^optimistic-elements]: ウェブブラウザはネットワークが極めて貧弱だった1990年代中旬に誕生しました。当時は１秒間に数キロバイトしか転送できなかったため、楽観的UI以外は考えられませんでした。`<input>`や`<select>`はこの頃からありましたので、楽観的UIです。

## コード --- code

### Todoの各行 --- todo-rows
```erb:app/views/todos/_todo.html.erb
<% highlight = local_assigns.fetch(:highlight, false) %>

<tr class="group p-2" id="<%= dom_id(todo) %>">
  <td class="<%= 'highlight-on-appear' if highlight %> p-2 border-gray-400 border-t group-[:first-child]:border-none">
    <div class="flex">
      <div class="flex grow items-center">
        <%= render 'like_button', todo: %>
        <%= todo.title %>
        <!-- ... -->
      </div>
        <!-- ... -->
    </div>
  </td>
</tr>
```

* ここはTurbo Drive版、Turbo Streams版とも全く同じです。

### 「いいね」ボタン Optimisticバージョン --- likes-optimistic

```erb:app/views/todos/_like_button.html+optimistic.erb
<% todo = local_assigns.fetch(:todo) %>

<%= form_with id: dom_id(todo, :like_button),
              url: todo_likes_path(todo), method: :post,
              class: "flex items-center w-16 aria-busy:opacity-30",
              data: { controller: "todo-likes",
                      action: "submit->todo-likes#optimistic" } do %>
  <%= label_tag nil, id: dom_id(todo, :like_button), class: "group flex cursor-pointer select-none" do %>
    <%= check_box_tag :like, "1",
                      todo.liked_by?(current_user),
                      class: "opacity-0 w-0",
                      data: { action: "change->todo-likes#submit",
                              todo_likes_target: "checkbox" } %>
    <div class="hidden group-has-[:checked]:block">
      <%= liked_icon %>
    </div>
    <div class="block group-has-[:checked]:hidden">
      <%= unliked_icon %>
    </div>
  <% end %>
  <div>
    : <span data-todo-likes-target="count"><%= todo.likes_count %></span>
  </div>
<% end %>
```

* 楽観的UIの要件は下記のようになります
    * クリックされたらすぐに「いいね」ボタンの表示を変えます。<span class="font-bold text-red-600">赤塗り</span>のものから<span class="font-bold">白塗り</span>のものに変えます
    * クリックされたらすぐに「いいね」数を１つ増やしたり減らしたりします
    * クリックされたらすぐにPending UI(待ちUI)として、Turboリクエストを出すと同時にボタン全体を半透明にします。
* 上記のTurbo Streamsを拡張するやり方もありますが、**今回はブラウザネイティブなチェックボックスを使って楽観的UIを実現します**
    * ブラウザネイティブのチェックボックスは、何もしなくてもoptimistic UI（楽観UI）になっています。つまりサーバ通信しなくても、ブラウザ側だけで表示を変えてくれます
    * さらにチェックボックスのステート（`checked`属性）はCSS擬似セレクタで読み取れますので、周辺の表示も楽観的に変えられます（`group-has-[:checked]:block/hidden`の箇所）
    * ただし今回の楽観的UIでは「いいね」数も変えないといけません。これはCSS擬似セレクタでは無理なので、Stimulusを使います
        * `data-action="submit->todo-likes#optimistic`で行います
* Pending UI（待ちUI）はTurboの通信中は`<form>`に`aria-busy`が自動的につくのを利用して、`aria-busy:opacity-30`で行います。
* 上記のTurbo Streamsの場合では`<form>`の中に配置された`<button>`を使用しましたので、クリックイベントを受け取り、サーバにリクエストを投げるのはブラウザネイティブな機能でやってくれました
    * 今回はチェックボックスを使用しますので、クリックイベントからサーバにリクエストを投げるところはブラウザネイティブにはやってくれません。Stimulusを使います。`data-action="change->todo-likes#submit`で`form`の自動送信を行います
* 大きく言うと、楽観的UIはブラウザのチェックボックスを利用して簡略化できましたが、`<form>` `<button>`を使わなくしたためにデータの送信にStimulusが必要になりました。 また「いいね」数の楽観的な更新はStimulusを使う必要があります

```js:app/javascript/controllers/todo_likes_controller.js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="todo-likes"
export default class extends Controller {
  static targets = ["count", "checkbox"]

  connect() {
  }

  optimistic(event) {
    let count = this.countTarget.textContent
    if (this.checkboxTarget.checked) {
      count++
    } else {
      count--
    }
    this.countTarget.textContent = count
  }

  submit(event) {
    event.currentTarget.form.requestSubmit()
  }
}
```

* TodoLikesController(Stimulus Controller)です
* `targets`の`count`は「いいね」数を表示する場所、`checkbox`は「いいね」したかどうかのステートを保持するチェックボックスです
* Actionは`submit`と`optimistic`の２つがあります
    * `submit`はチェックボックスのステートが変更されたら`form`を自動送信するものです（チェックがついたり、消えたりした時）
    * `optimistic`は"count" targetの値を楽観的に更新するものです
