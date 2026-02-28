---
title: フォーム送信成功と後処理
layout: article
order: 0010
published: true
siblings: true
---

Hotwireで作成したモーダル中のフォームからリクエストを送信し、成功するところまでを解説します。下記のビデオのものになります。

![modal.mov](content_images/modal-update.mov "max-w-[500px] mx-auto")
<div class="text-sm font-bold max-w-[500px] mx-auto">
サーバレスポンスに1秒の遅延を入れています
</div>

## 考えるポイント --- points-to-consider

![modal-crud.webp](content_images/modal-crud.webp "max-w-[700px] mx-auto")

![interactive-flow-hotwire.webp](content_images/interactive-flow-hotwire.webp "max-w-[600px] mx-auto")

1. `form`の送信はTurboで行います。レスポンスを返す方法としてはTurbo FramesとTurbo Streamsが考えられますが、今回は裏の画面を更新するだけでなく、トーストも出します。画面の一箇所しか書き換えられないTurbo Framesではなく、複数箇所が更新できるTurbo Streamsを選択します
   1. これ以外にTurbo Driveを使う方法もあります。
      1. Turbo Driveは画面全体を再描画しますので、裏画面を更新し、かつトーストを出すことができます。Morphingを使えば、スクロール位置も維持されます
      2. Turbo Driveが実装としては一番楽になります
      3. ただしモーダルを消すときにアニメーションが出しにくいので今回は採用しません
      4. また（これはTurbo Framesでも同じですが）POST/redirect/GETを使わなければならないため、遅延が大きくなり、レスポンスが悪くなります
   5. 実は「`form`の送信をTurbo Streamsで行う」というのは正確ではありません。なぜならTurbo Streamsで応答するかどうかは`form`送信時には決まらないからです。Turbo Streamsでレスポンスするかどうかはあくまでもサーバ側が決めます。詳しくは[サーバから見たTurbo FramesとTurbo Streamsの違い](/concepts/server-perspective-frames-vs-streams)で紹介しています。したがって、**例えば更新が成功したときはTurbo Driveでredirectして、失敗したときはTurbo Streamsでエラーメッセージを出すなどということも可能です**（今回は双方ともTurbo Streamsで処理していますが）
2. `form`送信のpending UI（待ちUI）は、Ruby on Railsが昔からデフォルトで提供している機能を使います（UJS: Unobtrusive JavaScript）。Hotwireでも同じ機能が引き継がれています
   1. Turboは[`form`のsubmitterを自動的にdisabledにします](https://turbo.hotwired.dev/reference/attributes#automatically-added-attributes) [^disabled]
   2. 上記のdisabledをCSSで検知し、ボタンの彩度を落とします 
   3. ボタンの名前を変更します（「更新する」から「更新中...」へ）
3. `form`送信が成功した場合に限り、モーダルを閉じます
   1. `form`送信結果を受け取り、JavaScriptでモーダルを閉じる必要がありますので、Stimulusを使います
   2. `form`送信が失敗した場合の処理は別途解説します
4. `form`送信が成功した場合はTurbo Streamsを使って、裏画面の書き換えを行います
   1. トーストを表示します
   2. 背景画面のデータを更新します

[^disabled]: 私はRails出身ということもあり、`form`送信時にdisabledにするのは二重送信防止策として一般的だと思いましたが、Next.jsなどではやっておらず、MDNなどでも言及していないようです。ただし実際に試してみるとNext.jsは二重送信をしてしまいますし、二重送信対策としてのdisabledはウェブ上でも広く推奨されています。なるべくならばやった方が間違いないでしょう

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
   * しかし今回は[モーダル表示のpending UI](/examples/modal/modal-show-with-animation#modal-frame)でも同様にpending UI（待ちUI）を出しています
   * モーダル表示時のpending UIは表示したくないので、上記の`form`が`<turbo-frame id="modal-dialog__frame">`と敢えて紐づかいないようにしています。そのために`"_top"`を指定しています
* 一番下の`<button>`(キャンセル)のところは、クリックしたら`ModalDialogController`の`hide()`を呼ぶようにしています。モーダルを非表示にするものです
* `form.submit`のところは「更新する」ボタンです。これに`data-turbo-submits-with`属性がついていて、"更新中..."となっています。これはTurboが用意してくれているoptimistic UI (楽観的UI)です。ボタンをクリックして`form`を送信すると、ボタンの名前が自動的に"更新中..."に切り替わってくれます
   * さらにTurboはボタンを自動的に`disabled`にもしてくれますので、`form`の二重送信防止になります
   * 加えて`form`を送信中は、Turboが`form`要素に`aria-busy`属性を自動でつけてくれます。これをCSS擬似セレクタで検知して、待ちUI (pending UI)を追加することもできます

[^form-events]: リクエストが成功したかどうかはサーバが決定することです。そしてこれをブラウザに表示しなければなりませんが、どのようにメッセージを伝播するべきかは難しい問題です。Hotwireの場合は大きく２つの選択肢があります。１つ目はレスポンスのbodyであるTurbo Streamを使うことです。この場合はサーバが「モーダルのHTML要素を変えろ！」と指示します。２つ目はレスポンスのstatusで200系や400系を返し、ブラウザ側でstatusを読み取り、ブラウザ側が自ら「モーダルを消すぞ！」と判断する形です。開発者によって、どのやり方を選択するかが異なります。なお、ReactだとJSON APIしかないので、必然的に後者の形になります。私はモーダルの表示・非表示はあくまでもブラウザが管理することであり、なるべくならサーバは関わるべきではないと思っていますので、後者を採用しています。

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
  * RailsでMPAやTurbo Driveで`update`をするときは、`flash`を使うことがほとんどです。一方、ここでは`flash.now`を使っています。`flash`はリダイレクト後にトーストを表示するときに使いますので、「次回のリクエスト」で使いたい時に使用します
  * それに対して`flash.now`は「現在のリクエスト」が対象です。すぐに使いたい時に使います
  * POST/Redirect/GETのパターンを使う時はredirectを挟むので`flash`を、今回のようにPOSTに対して直接レスポンスを返している場合は`flash.now`と使い分ける形になります
  * なお[トーストを表示する方法](/examples/toast)については、別途解説しています
* 今はまず正常系だけ見ていますので、Turbo StreamのERBテンプレートでは、`if ... else`の`else`の方だけみます
  * Turbo Streamの`turbo_stream.replace dom_id(@todo)`でデータが更新された行を`replace`で置換しています。背景画面である`app/views/todos/index.html.erb`では、各行を`app/views/todos/_todo.html.erb` partialでレンダリングしていますが、ここでは`@todo`に該当する行だけを置換しています
  * Turbo Streamの`turbo_stream.replace "global-notification"`ではトーストを表示します。トーストの内容は`global_notification` partialからとっています。なおトーストをよく使用するのであれば、丸ごとhelperにしてしまった方が便利かもしれません（下の`global_notification_stream` helperのコードを参照）

```rb:app/helpers/global_notification_helper.rb
module GlobalNotificationHelper
  def global_notification_stream
    turbo_stream.replace "global-notification" do
      render "global_notification"
    end
  end
end
```

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
  * トーストの内容も一緒にTurbo Streamsで更新しました
* 同時に`turbo:submit-end`のイベントを検知して、モーダルを非表示にしました。特にレスポンスが成功した時だけ非表示にするようにしています。バリデーションエラーの時はモーダルを表示したままにしました
* これに加えて、`form`を`disable`して二重送信防止をしたり、軽いpending UIも実装しました

高いレベルのUI/UXを実現するためには、細かいことをたくさん実施する必要があります。その分、どうしても処理が複雑になることは避けられません。ただしHotwireを使うと、その一つ一つが少ないコードで実現できますので、UI/UXが複雑になってもうまく対応できます。
