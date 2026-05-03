---
title: 「いいね」ボタン (Turbo Drive)
layout: article
order: 10
published: true
show_siblings: true
descriptors:
  parent: /examples/like_button
  server_request: true
  technologies:
    - Turbo Drive
    - Turbo Morphing
  demo_urls:
    - ["Turbo Driveによるデモ", "/todos?variant=drive"]
---

## Turbo Drive版の特徴

- コードは最もシンプルです。
- ページ全体を再描画します。
   - 通常は再描画によりページのUIステート(スクロール位置など)がリフレッシュされます。
   - しかしMorphingを使うと、Reactの差分アルゴリズムと類似の処理が行われ、UIステートを残しつつ変更箇所だけを修正できます。
- 更新系はPOST/Redirect/GETパターンに従うため、更新されたデータを受けとるまでにサーバに２回リクエストを飛ばします。
- Optimistic(楽観的)UIを使用していないことに加え、POST/Redirect/GETをしないといけないので、「いいね」ボタンを押してから実際に画面に反映されるまでに時間がかかります。

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
* `render 'like_button', todo:`で「いいね」ボタンを表示しています。

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

* `todo.liked_by?(current_user)`のところで「いいね」済みかどうかを確認し、それに応じて「いいね」ボタンの表示を切り替えています。
* 「いいね」ボタンは`todo_likes_path`にPOSTリクエストを送信します。

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

      if request.variant.drive?
         return redirect_to todos_path
      end
   end

   private

      def set_todo
         @todo = Todo.find(params[:todo_id])
      end
end
```

* `create`メソッドで「いいね」ボタンのアクションを実行します。
* Turbo Driveを使用している場合は、DBを更新後、`return redirect_to todos_path`をします。いわゆる[POST/redirect/GETのパターン](/concepts/post-redirect-get)です
* 通常のTurbo Driveであれば、redirect後にTodo一覧ページを再描画するとき、スクロール位置がリセットされます（画面の最上部にスクロールします）
    * しかし今回は[`app/views/todos/index.html.erb`](https://github.com/naofumi/hotwire_anecdota/tree/master/app/views/todos/index.html.erb)で`turbo_refreshes_with method: :morph, scroll: :preserve`を設定しているため、Morphingを使った再レンダリングをしています。そのためスクロール位置は維持されます
    * **最もシンプルなPOST/redirect/GETパターンを使いつつ、スクロール位置を含めたブラウザステートを維持したい場合、Morphingは非常に有効です**
