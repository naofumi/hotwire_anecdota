---
title: フォーム送信成功でモーダルを隠す
layout: article
order: 0010
published: true
---

モーダルの中から`form`を送信し、送信中はpending UIを表示します。また成功したらトーストを表示し、表示中のデータを更新し、さらにモーダルが自動的に閉じるようにします。

## 考えるポイント --- points-to-consider

![interactive-flow-hotwire.webp](content_images/interactive-flow-hotwire.webp "max-w-[600px] mx-auto")

1. `form`の送信はTurboで行います。レスポンスを返す方法としてはTurbo FramesとTurbo Streamsが考えられますが、今回はredirectせずにトーストを出したりもしたいため、画面の一箇所しか書き換えられないTurbo Framesではなく、Turbo Streamsを選択します
2. `form`送信が成功した場合に限り、モーダルを閉じます
   1. `form`送信結果を受け取り、JavaScriptを起動する必要があります。これはStimulusで行います
   2. `form`送信が失敗した場合の処理は別途解説します

## コード --- code

### フォーム --- code-for-form

```erb:app/views/todos/_form.html.erb
<%= form_with(
      model: todo, id: 'todo-form',
      data: { action: "turbo:submit-end->modal-dialog#hideOnSuccess" },
    ) do |form| %>
  <% if todo.errors.any? %>
    <div class="text-red-600">
      <ul>
        <% todo.errors.each do |error| %>
          <li><%= error.full_message %></li>
        <% end %>
      </ul>
    </div>
  <% end %>

  <div>
    <%= form.label :title, class: "block text-sm/6 font-semibold text-gray-900" %>
    <div class="mt-2.5">
    <%= form.text_field :title, data: {action: "keydown.enter->modal-dialog#void:prevent"},
    class: "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm/6"%>
    </div>
  </div>

  <div class="mt-8 flex justify-between">
    <button type="button" class="btn-outline-primary" data-action="click->modal-dialog#hide">
      キャンセル
    </button>
    <%= form.submit class: "btn-primary" %>
  </div>
<% end %>
```

* モーダルの中に表示されている`<form>`の箇所です
* `data: { action: "turbo:submit-end->modal-dialog#hideOnSuccess" }`のところは、`<form>`の送信後にStimulus `ModalDialogController`の`hideOnSuccess()`メソッドを呼ぶという指示です
   * [Turboは多数のカスタムイベントを発火します](https://turbo.hotwired.dev/reference/events#turbo%3Asubmit-end)。`<form>`送信後は`turbo:submit-end`を発火しますので、これを利用します
   * `turbo:submit-end`は失敗した時も発火しますので、`hideOnSuccess()`メソッドではレスポンスが`success`であったことを確認した上でモーダルを隠す処理をします
   * Reactでは`fetch`をawaitしてリクエスト送信後の処理を記述します。それに対してHotwireはこのようにイベント中心の記述をします
* 一番下の`<button>`(キャンセル)のところは、クリックしたら`ModalDialogController`の`hide()`を呼ぶようにしています

### Railsコントローラ --- rails-controller

```rb:app/controllers/todos_controller.rb
class TodosController < ApplicationController
  # ...

  def update
    respond_to do |format|
      if @todo.update(todo_params)
        flash.now.notice = "Todo was successfully updated."
        format.turbo_stream
      else
        format.turbo_stream { render status: :unprocessable_content}
      end
    end
  end

  # ...
  
  private
  
  # ...

    # Only allow a list of trusted parameters through.
    def todo_params
      params.require(:todo).permit(:title)
    end
end
```

```erb:app/views/todos/update.turbo_stream.erb
<% if @todo.errors.any? %>
  <%= turbo_stream.replace "todo-form" do %>
    <%= render "form", todo: @todo %>
  <% end %>
<% else %>
  <%= turbo_stream.replace dom_id(@todo) do %>
    <%= render @todo, highlight: true %>
  <% end %>

  <%= turbo_stream.replace "global-notification" do %>
    <%= render "global_notification" %>
  <% end %>
<% end %>
```

* `update`のActionでリクエストを受け取り、レスポンスを返します
* ここでは`flash.now`にトーストのメッセージをセットし、Turbo Streamのレスポンスを返しています
  * 通常は`flash`を使うところを、ここでは`flash.now`を使っています。`flash`はリダイレクト後にトーストを表示するときに使いますので、「次回のリクエスト」に内容を表示するためのものです
  * それに対して`flash.now`は「現在のリクエスト」を対象にします
  * POST/Redirect/GETのパターンを使う時は`flash`を、今回のようにPOSTに対して直接レスポンスを返している場合は`flash.now`を使い分ける形になります
* 今はまず正常系だけ見ていますので、Turbo StreamのERBテンプレートでは、`if ... else`の`else`の方だけみます
  * `turbo_stream.replace dom_id(@todo)`でデータが更新された行を`replace`で置換しています
  * `turbo_stream.replace "global-notification"`ではトーストを表示する箇所を指定しています。そこに`global_notification` partialを挿入しています。このpartialは`flash`の内容に基づいて、トーストを表示します

### モーダルを隠す --- code-to-hide-modal

```js:app/javascript/controllers/modal_dialog_controller.js
import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="modal-dialog"
export default class extends Controller {
  static values = {
    shown: {type: Boolean, default: false},
    page: String
  }

  // ...

  hide(event) {
    this.shownValue = false
  }

  // ...

  hideOnSuccess(event) {
    if (!event.detail.success) {
      return
    }

    this.hide(event)
  }
  // ...
}
```

* 上述した通り、`turbo:submit-end`イベントに対して`hideOnSuccess(event)`メソッドを実行させるように`<form>`の`data-action`属性を記述しました
* `hideOnSuccess(event)`メソッドはステータスが`success`だったかどうかを確認し、そうだった場合は`hide(event)`メソッドを呼び出してモーダルを表示します
  * 失敗だった場合はエラーメッセージを表示しますので、モーダルはそのまま開いておきます 

## まとめ --- summary

* フォーム送信をRailsのcontrollerで受け取り、成功した場合にレスポンスを返すところをやりました
  * Turbo Streamsでモーダルの裏の画面の更新をしました
  * トーストの内容も一緒にTurbo Streamsに載せました
* モーダルを閉じる操作は`turbo:submit-end`のイベントを検知して、Stimulus controllerの中で行いました。アニメーション付きでモーダルを閉じました

解説は長くなりましたが、
