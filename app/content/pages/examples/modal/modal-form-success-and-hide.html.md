---
title: フォーム送信成功でモーダルを隠す
layout: article
order: 0010
published: true
---

Hotwireで作成したモーダルでフォームの送信成功するところまでを解説します。下記のビデオのものになります。

![modal.mov](content_images/modal-update.mov "max-w-[500px] mx-auto")
<div class="text-sm font-bold max-w-[500px] mx-auto">
サーバレスポンスに1秒の遅延を入れています
</div>

## 考えるポイント --- points-to-consider

やらなければならないことをリストアップすると、 a) モーダルの中から`form`を送信し、 b) フォームをdisableします。また送信中は c) formをdisabledにするとともに、軽めのpending UI（処理中のUI）を表示し、 d) 例えばボタンの名前を「更新中...」に変更します。また成功レスポンスがサーバから返ってきたら e) トーストを表示し、 f) 表示中のデータを更新し、さらに g) モーダルが自動的に閉じるようにします。

基本的なCRUDではあるものの、結構やることがたくさんあります。しかもこれは正常系だけです。異常系については別途紹介します。

![interactive-flow-hotwire.webp](content_images/interactive-flow-hotwire.webp "max-w-[600px] mx-auto")

1. `form`の送信はTurboで行います。レスポンスを返す方法としてはTurbo FramesとTurbo Streamsが考えられますが、今回はredirectせずにトーストを出したりもしたいため、画面の一箇所しか書き換えられないTurbo Framesではなく、複数箇所が更新できるTurbo Streamsを選択します
2. `form`送信のpending UI（処理中のUI）は、Ruby on RailsがUJS (Unobtrusive JavaScript)で提供している古い機能としてデフォルトで提供されています。Hotwireでも引き継がれていますので、これを使います
   1. Turboは[`form`のsubmitterを自動的にdisabledにします](https://turbo.hotwired.dev/reference/attributes#automatically-added-attributes) [^disabled]
   2. 上記のdisabledをCSSで検知し、ボタンの彩度を落とします 
   3. ボタンの名前を変更します（「更新する」から「更新中...」へ）
3. `form`送信が成功した場合に限り、モーダルを閉じます
   1. `form`送信結果を受け取り、JavaScriptを起動する必要があります。これはStimulusで行います
   2. `form`送信が失敗した場合の処理は別途解説します
4. `form`送信が成功した場合はTurbo Streamsを使い、下記の画面書き換えを行います
   1. トーストを表示します
   2. 背景画面のデータを更新します 

[^disabled]: 私はRails出身ということもあり、`form`送信時にdisabledにするのは二重送信防止策として一般的だと思いましたが、Next.jsなどではやっておらず、MDNなどでも言及していないようでした。ただし二重送信対策としては依然として一般的なようです。

## コード --- code

### フォーム --- code-for-form

```erb:app/views/todos/_form.html.erb
<%= form_with(
      model: todo, id: 'todo-form',
      data: {
        action: "turbo:submit-end->modal-dialog#hideOnSuccess",
        turbo_frame: "_top",
      },
    ) do |form| %>
  <!-- ... -->
  
  <div>
    <%= form.label :title, class: "block text-sm/6 font-semibold text-gray-900" %>
    <div class="mt-2.5">
      <%= form.text_field :title,
                          class: "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm/6" %>
    </div>
  </div>

  <div class="mt-8 flex justify-between">
    <button type="button" class="btn-outline-primary" data-action="click->modal-dialog#hide">キャンセル</button>
    <%= form.submit class: "btn-primary", data: {turbo_submits_with: "更新中..."} %>
  </div>
<% end %>
```

* モーダルの中に表示されている`<form>`の箇所です
* `data-action="turbo:submit-end->modal-dialog#hideOnSuccess"`のところは、`<form>`のレスポンス受信後にStimulus `ModalDialogController`の`hideOnSuccess()`メソッドを呼ぶという指示です
   * [Turboのform送信はカスタムイベントを発火します](https://turbo.hotwired.dev/reference/events#turbo%3Asubmit-end)。今回は`<form>`のレスポンスを受信後に発火される`turbo:submit-end`を利用します[^form-events]
   * `hideOnSuccess()`メソッドはレスポンスステータスを確認し、`success`の場合にモーダルを非表示します
* `form`の`data-turbo-frame="_top"`の箇所はpending UI（待ちUI）の関係で使っています
   * Turboで`form`を送信すると、`form`自身、およびそれが関連する`turbo-frame`に`aria-busy="true"` 属性が自動的に付与されます
   * しかし今回は[モーダル表示のpending UI](/examples/modal/modal-show-with-animation#modal-frame)でも同様にpending UIを出しています
   * モーダル表示のpending UIは表示したくないので、上記の`form`が`<turbo-frame id="modal-dialog__frame">`と敢えて紐づかいないようにしています。そのために`"_top"`を指定しています
* 一番下の`<button>`(キャンセル)のところは、クリックしたら`ModalDialogController`の`hide()`を呼ぶようにしています。モーダルを非表示にするものです

[^form-events]: リクエストが成功したかどうかはサーバが決定することです。そしてこれをブラウザに表示しなければなりませんが、どのようにメッセージを伝播するべきかは難しい問題です。Hotwireの場合は大きく２つの選択肢があります。１つ目はレスポンスのbodyであるTurbo Streamを使うことです。この場合は成功・失敗をブラウザに伝えるのではなく、「モーダルのHTML要素を変えろ！」みたいな指示で、ブラウザに一切考えさせない指示の仕方です。２つ目はレスポンスのstatusで200系や400系を返すやり方です。ブラウザ側でstatusを読み取り、ブラウザ側が自ら「モーダルを消すぞ！」と判断する形になります。開発者によって、どのやり方を選択するかが異なります。なお、ReactだとJSON APIしかないので、必然的に後者の形になります。私はモーダルの表示・非表示はあくまでもブラウザの管轄であり、なるべくならサーバは関わるべきではないと思っていますので、ここでは後者を採用しています。

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
  <!-- ... -->
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
  * 通常は`flash`を使うところを、ここでは`flash.now`を使っています。`flash`はリダイレクト後にトーストを表示するときに使いますので、「次回のリクエスト」で使いたい時に使用します
  * それに対して`flash.now`は「現在のリクエスト」が対象です。すぐに使いたい時に使います
  * POST/Redirect/GETのパターンを使う時はredirectを挟むので`flash`を、今回のようにPOSTに対して直接レスポンスを返している場合は`flash.now`と使い分ける形になります
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
* `hideOnSuccess(event)`メソッドはステータスが`success`だったかどうかを確認し、そうだった場合は`hide(event)`メソッドを呼び出してモーダルを隠します
  * 失敗だった場合、モーダルはそのまま開いておきます（もう一度ユーザに入力し直してもらいたいため） 

## まとめ --- summary

* フォーム送信をRailsのcontrollerで受け取り、成功した場合にレスポンスを返すところをやりました
  * Turbo Streamsでモーダルの裏の画面の更新をしました
  * トーストの内容も一緒にTurbo Streamsに載せました
* モーダルを閉じる操作は`turbo:submit-end`のイベントを検知して、Stimulus controllerの中で行いました。アニメーション付きでモーダルを閉じました

解説は長くなりましたが、
