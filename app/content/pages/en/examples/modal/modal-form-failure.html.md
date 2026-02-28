---
title: フォーム送信バリデーション失敗
layout: article
order: 0030
published: true
siblings: true
---

Hotwireで作成したモーダルでフォームを送信し、サーバサイドバリデーションが失敗した時の処理を紹介します。下記のビデオのものになります。

![modal.mov](content_images/modal-failure.mov "max-w-[500px] mx-auto")
<div class="text-sm font-bold max-w-[500px] mx-auto">
サーバレスポンスに1秒の遅延を入れています
</div>

## 考えるポイント --- points-to-consider

![modal-crud.webp](content_images/modal-crud.webp "max-w-[500px] mx-auto")

![interactive-flow-hotwire.webp](content_images/interactive-flow-hotwire.webp "max-w-[600px] mx-auto")

1. フォーム送信までの処理は[フォーム送信成功の項](/examples/modal/modal-form-success-and-hide)で解説した通りです
2. `form`送信が失敗した場合は以下の処理をします
   1. `form`は表示したままにします
   2. モーダルの中にエラーを表示します。これはTurbo Streamsを使い、モーダルの中身をエラー内容を含むページで置き換える形で行います

## コード --- code

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
  <!-- ... -->
<% end %>
```

* `update`のActionでリクエストを受け取り、レスポンスを返します。今回はバリエーションが失敗していますので、`format.turbo_stream { render status: :unprocessable_content}`の方の処理を行います
* ブラウザに送信されるレスポンスは、statusが`:unprocessable_content`(422)とbodyが`app/views/todos/update.turbo_stream.erb`に記載のTurbo Streamsになります
* Turbo StreamのERBテンプレートは異常系が走りますので、`if ... else`の`if`の方だけみます
  * `app/views/todos/_form.html.erb` partialがレンダリングされます。これは通常のRailsのバリデーションエラー処理と同じで、入力フォームに`@todo.errors`の内容を重ねて表示します
  * 上記のpartialが`turbo_stream.replace "todo-form"`に囲まれていますので、`id="todo-form"`で指定されたHTML要素（モーダルの中に表示されて`form`）を置換するように画面が更新されます

```js:app/javascript/controllers/modal_dialog_controller.js
import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="modal-dialog"
export default class extends Controller {
  // ...
  
  hide(event) {
    this.shownValue = false
  }

  hideOnSuccess(event) {
    if (!event.detail.success) return

    this.hide(event)
  }
  // ...
}
```

*  [フォーム送信成功と後処理](/examples/modal/modal-form-success-and-hide#code-to-hide-modal)では、`form`送信が成功するとモーダルが自動的に閉じました。今回も`form`送信後に`turbo:submit-end``ModalDialog#hideOnSuccess()`が実行されますが、`event.detail.success`がfalseなので、モーダルは表示されたままになります

## まとめ --- summary

* 成功・失敗に応じたUI/UXの出し分けは、サーバ側から制御が可能です
   * statusを変えたり異なるTurbo Streamを返したりすることで、サーバ側からブラウザの表示を制御します
   * 他にもredirectやTurbo Drive/Framesでレスポンスして出し分ける方法もあります（今回は紹介していませんが）
* 今回はStatusの違いを読み取り、UI/UXを出し分けるのはStimulus controllerの中でやりました
   * これをTurbo Streamsでやる方法もあります
 
サーバサイドバリデーションをする場合は、レスポンスに応じてブラウザ側のUIを出し分ける必要があります。Hotwireの場合はそのロジックを完全にサーバに持たせる方法と、一部分をブラウザに任せる方法があります。UI/UXの要件や設計方針に応じて選択します。
