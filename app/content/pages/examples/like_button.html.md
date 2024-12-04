---
title: 「いいね」ボタン
layout: article
order: 110
published: true
---

ここでは「いいね」ボタンの実装を通して、UI/UXを段階的に改善していきます。最終的にはoptimistic UI (楽観的UI)まで実装し、ネイティブアプリのような操作性を実現します。

下記のようなUIになります。


![likes.mov](content_images/likes.mov "max-w-[500px] mx-auto")
<div class="text-sm font-bold max-w-[500px] mx-auto">
サーバレスポンスに1秒の遅延を入れています
</div>

[デモはこちらに用意しています](/todos)。

## 考えるポイント --- points-to-consider

![interactive-flow-hotwire.webp](content_images/interactive-flow-hotwire.webp "max-w-[700px] mx-auto")

1. 「いいね」はサーバと同期する必要があります。したがってTurboを使います。Turboの中にもやり方は複数あります
   1. Turbo Driveを使う方法。「いいね」ボタンを押すたびに画面全体をサーバで再レンダリングして、ブラウザに送ります
   2. Turbo Streamsを使う方法。「いいね」ボタンを押すたびに、該当の行だけを再レンダリングして、ブラウザに送ります
   3. 楽観的UIを使う方法。「いいね」ボタンを押すと、ブラウザのネイティブ機能やJavaScriptを使い、ユーザにフィードバックを与えます。同時にTurboを使ってサーバと同期します
4. 最後の楽観的UI(optimistic UI)はサーバからレスポンスを受け取る前に画面を更新します。「いいね」アイコンの表示はCSS擬似セレクタだけで対応していますが、いいね数の更新はStimulus Controllerを使用しています

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

* Todo一覧の各行を表示する `app/views/todos/_todo.html.erb` partialです
* `render 'like_button', todo:`で「いいね」ボタンを表示しています。今回はmpa, streams, optimisticの３つのバージョンがあります 

### 「いいね」ボタン MPAバージョン --- likes-mpa

```erb:app/views/todos/_like_button.html+mpa.erb
<% todo = local_assigns.fetch(:todo) %>

<%= tag.div class: "flex items-center w-16 aria-busy:opacity-30" do %>
  <%= label_tag nil, class: "group flex cursor-pointer select-none" do %>
    <% if todo.liked_by?(current_user) %>
      <%= button_to todo_likes_path(todo), method: :post do %>
        <%= liked_icon %>
      <% end %>
    <% else %>
      <%= button_to todo_likes_path(todo), method: :post, params: { like: "1" } do %>
        <%= unliked_icon %>
      <% end %>
    <% end %>
    <div>
      : <span><%= todo.likes_count %></span>
    </div>
  <% end %>
<% end %>
```

* `todo.liked_by?(current_user)`のところで「いいね」済みかどうかを確認し、それに応じて異なる「いいね」ボタンを表示しています
* どちらも`todo_likes_path`にPOSTリクエストを送信しています

### Todos::LikesController MPAバージョン --- controller-mpa

```rb:app/controllers/todos/likes_controller.rb
class Todos::LikesController < ApplicationController
   # ...

   def create
      sleep 1

      if params[:like]
         @todo.like_by! current_user
      else
         @todo.unlike_by! current_user
      end

      if request.variant.mpa?
         return redirect_to todos_path
      end
   end

   private

      def set_todo
         @todo = Todo.find(params[:todo_id])
      end
end
```

* `def create`のところが「いいね」ボタンのアクションを受け取るメソッドになります
* MPAからのリクエストの場合は、DBを更新後、`return redirect_to todos_path`をしています。いわゆるPOST/redirect/GETのパターンです
* 通常のMPAやTurbo Driveであれば、redirect後にTodo一覧ページを再描画するとき、スクロール位置がリセットされます（画面の最上部にスクロールします）
   * しかし今回は`app/views/todos/index.html.erb`で`turbo_refreshes_with method: :morph, scroll: :preserve`を設定しているため、Morphingを使った再レンダリングをしています。そのためスクロール位置は維持されます
   * **最もシンプルなPOST/redirect/GETパターンを使いつつ、スクロール位置を含めたブラウザステートを維持したい場合、Morphingは非常に有効です**

### 「いいね」ボタン Turbo Streamsバージョン --- likes-turbo-streams

```erb:app/views/todos/_like_button.html+streams.erb
<% todo = local_assigns.fetch(:todo) %>

<%= tag.div id: dom_id(todo, :like_button),
            class: "flex items-center w-16" do %>
  <%= label_tag nil, class: "group flex cursor-pointer select-none" do %>
    <% if todo.liked_by?(current_user) %>
      <%= button_to todo_likes_path(todo), method: :post do %>
        <%= liked_icon %>
      <% end %>
    <% else %>
      <%= button_to todo_likes_path(todo), method: :post, params: { like: "1" } do %>
        <%= unliked_icon %>
      <% end %>
    <% end %>
    <div>
      : <span><%= todo.likes_count %></span>
    </div>
  <% end %>
<% end %>
```

* 上記のMPAの場合とほとんど変わりません
   * 唯一 `tag.div id: dom_id(todo, :like_button)`のところでIDをつけています
   * IDをつけるのは、Turbo Streamsで置換する際の目印をつけるためです
   * [サーバから見たTurbo FramesとTurbo Streamsの違い](/concepts/server-perspective-frames-vs-streams)でも解説している通り、リクエストを出す時は通常のTurbo DriveとTurbo Streamでは何も変わりません。Turbo Driveで応答するかTurbo Streamsで応答するかは、すべてサーバ側で決定されます

コントローラは上述のものと同じです。ただし`request.variant.mpa?`はfalseを返しますので、`app/views/todos/likes/create.turbo_stream.erb`をテンプレートとしたレスポンスを返します。

```erb
<%= turbo_stream.replace dom_id(@todo, :like_button) do %>
  <%= render partial: "todos/like_button", locals: { todo: @todo } %>
<% end %>
```

* `app/views/todos/likes/create.turbo_stream.erb`では "todos/like_button"のpartialを返します。今回は"streams"のvariantを使いますので、`app/views/todos/_like_button.html+streams.erb`を返します

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
   * クリックされたらすぐに「いいね」ボタンを変えます。<span class="font-bold text-red-600">赤塗り</span>のものから<span class="font-bold">白塗り</span>のものに変えます
   * クリックされたらすぐに「いいね」数を１つ増やしたり減らしたりします
   * クリックされたらすぐにPending UI(待ちUI)として、Turboリクエストを出すと同時にボタン全体を半透明にします
* 上記のTurbo Streamsを拡張するやり方もありますが、**今回はブラウザネイティブなチェックボックスを使った簡略化を同時に行います**
   * ブラウザネイティブのチェックボックスは、何もしなくてもoptimistic UI（楽観UI）になっています。つまりサーバ通信しなくても、ブラウザ側だけで表示を変えてくれます 
   * さらにチェックボックスのステート（`checked`属性）はCSS擬似セレクタで読み取れますので、周辺の表示も楽観的に変えられます（`group-has-[:checked]:block/hidden`の箇所）
   * ただし今回の楽観的UIでは「いいね」数も変えないといけません。これはCSS擬似セレクタでは無理なので、Stimulusを使います
     * `data-action="submit->todo-likes#optimistic`で行います
* Pending UI（待ちUI）は通信中は`<form>`に`aria-busy`が自動的につくのを利用して、`aria-busy:opacity-30`で行います。 
* 上記のTurbo Streamsの場合は`<button>`を使用しましたので、クリックイベントを受け取り、サーバにリクエストを投げるのはブラウザネイティブな機能でやってくれました
   * 今回はチェックボックスを使用しますので、クリックイベントからサーバにリクエストを投げるところはブラウザネイティブにはやってくれません。Stimulusを使います。`data-action="change->todo-likes#submit`で`form`の自動送信を行います
* 大きく言うと、楽観的UIはブラウザのチェックボックスを利用して簡略化できましたが、`<button>`を使わなくしたためにデータの送信にStimulusが必要になりました。 また「いいね」数の楽観的な更新はStimulusを使う必要があります

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

* TodoLikesController Stimulus Controllerです
* `targets`の`count`は「いいね」数を表示する場所、`checkbox`は「いいね」したかどうかのステートを保持するチェックボックスです
* Actionは`submit`と`optimistic`の２つがあります
   * `submit`はチェックボックスのステートが変更されたら`form`を自動送信するものです（チェックがついたり、消えたりした時）
   * `optimistic`は"count" targetの値を楽観的に更新するものです

## まとめ --- summary

* Turbo Drive + Morphingの場合は、Rails controller側はredirectするだけですので一番簡単です。スクロール位置も維持されますので、ネットワークが速ければ問題のないUIです。ただし遅延があると、ユーザにフィードバックがなく、もたつくUI/UXになってしまいます。POST/redirect/GETで２回サーバ通信を行うので、尚更です
* Turbo Streamsを使った場合はPOST/redirect/GETを使わないで済むため、１回のサーバ通信で済みます
* 楽観的UI(optimistic UI)をつけるのがUI/UX的には一番良いです。フィードバックは瞬時に得られ、かつ通信中であることも伝わります。追加で書くJavaScriptは増えますが、大きな負担はありません
* 今回は楽観的UIでチェックボックスを使いましたが、StimulusのValuesステートを使ったり、あるいはCSSセレクタではなく、直接的に「いいね」ボタンを変更するやり方もできます。ただしなるべくならばネイティブのHTML要素の性質を使った方がアクセシビリティ的にも有利ですので（キーボードでの操作など）、一般的にはこちらをお勧めします

このようにちょっとした楽観的UI(optimistic UI)もHotwireで簡単に実装できます。もちろんやることは増えますが、特別に苦労するものではありません。UI/UX効果は大きいので、ポイントポイントではおすすめです。
