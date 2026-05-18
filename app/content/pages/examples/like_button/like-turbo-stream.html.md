---
title: 「いいね」ボタン (Turbo Stream)
layout: article
order: 20
published: true
show_siblings: true
descriptors:
  parent: /examples/like_button
  server_request: true
  technologies:
    - Turbo Streams
  related_pages:
    - /concepts/post-redirect-get
    - /concepts/server-perspective-frames-vs-streams
  demo_urls:
    - ["Turbo Streamsによるデモ", "/todos?variant=stream"]
---

## Turbo Stream版の特徴

- 同期的に変更させたい場所だけを再描画します。
    - 再描画箇所以外のUIステート(スクロール位置など)は維持されます。
- 更新系でもPOST/Redirect/GETパターンに従う必要がなく、POSTからダイレクトにTurbo Streamsのレスポンスを返します。サーバに１回りクエストを飛ばすだけで十分です。
- Optimistic(楽観的)UIを使用していないので、「いいね」ボタンを押してから実際に画面に反映されるまでに時間がかかります。

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

* Turbo Driveの場合と全く同じです。
* Todo一覧の各行を表示する `app/views/todos/_todo.html.erb` partialです
* `render 'like_button', todo:`で「いいね」ボタンを表示しています。

### 「いいね」ボタン Turbo Streamsバージョン --- likes-turbo-streams

```erb:app/views/todos/_like_button.html+streams.erb
<% todo = local_assigns.fetch(:todo) %>

<%= tag.div id: dom_id(todo, :like_button),
            class: "flex items-center w-16" do %>
  <%= label_tag nil, class: "group flex cursor-pointer select-none" do %>
    <% if todo.liked_by?(current_user) %>
      <%= button_to todo_likes_path(todo), method: :post, class: "cursor-pointer" do %>
        <%= liked_icon %>
      <% end %>
    <% else %>
      <%= button_to todo_likes_path(todo), method: :post, params: { like: "1" }, class: "cursor-pointer" do %>
        <%= unliked_icon %>
      <% end %>
    <% end %>
    <div>
      : <span><%= todo.likes_count %></span>
    </div>
  <% end %>
<% end %>
```

* Turbo Driveの場合とほとんど変わりません
    * 唯一 `tag.div id: dom_id(todo, :like_button)`のところでIDをつけています。
    * IDをつけるのは、Turbo Streamsで置換する際の目印をつけるためです。
    * [サーバから見たTurbo FramesとTurbo Streamsの違い](/concepts/server-perspective-frames-vs-streams)でも解説している通り、リクエストを出す時は通常のTurbo DriveとTurbo Streamでは何も変わりません。Turbo Driveで応答するかTurbo Streamsで応答するかは、すべてサーバ側で決定されます。

### Todos::LikesController Turbo Streamsバージョン --- todo-rows-turbo-streams

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

コントローラは[Turbo Driveのもの](/examples/like_button/like-turbo-drive#controller-mpa)と同じです。ただし`request.variant.drive?`はfalseを返しますので、`app/views/todos/likes/create.turbo_stream.erb`（下記）をテンプレートとしたレスポンスを返します。

### Turbo Streamsレスポンス --- response-turbo-streams

```erb:app/views/todos/likes/create.turbo_stream.erb
<%= turbo_stream.replace dom_id(@todo, :like_button) do %>
  <%= render partial: "todos/like_button", locals: { todo: @todo } %>
<% end %>
```

* `app/views/todos/likes/create.turbo_stream.erb`では "todos/like_button"のpartialを返します。今回は"streams"のvariantを使いますので、`app/views/todos/_like_button.html+streams.erb`を返します
