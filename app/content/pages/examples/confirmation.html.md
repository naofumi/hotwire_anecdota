---
title: フォーム確認画面実装時の注意
layout: article
order: 500
published: false
descriptors:
  component_names:
    - Confirmation Page
  server_request: true
  state_management:
    - なし
  technologies:
    - MPA
  demo_urls:
    - ["デモ", "/reservations"]
---

フォームを送信する前に確認画面を出すことはよくあります。ここでは隠れたフォームを使った確認画面の実装方法と、Hotwireを使用する場合の注意点について解説します。

## コード --- code

```erb:app/views/reservations/_form.html.erb
<%= form_with(model: reservation, id: "reservation_form") do |form| %>
  <% if reservation.errors.any? %>
    <div style="color: red">
      <h2><%= pluralize(reservation.errors.count, "error") %> prohibited this reservation from being saved:</h2>

      <ul>
        <% reservation.errors.each do |error| %>
          <li><%= error.full_message %></li>
        <% end %>
      </ul>
    </div>
  <% end %>

  <div class="mt-4">
    <%= form.label :guest_name, class: "form-label" %>
    <%= form.text_field :guest_name, class: "text-field" %>
  </div>

  ...
 
  <div class="mt-8">
    <%= form.submit class: "btn-primary" %>
  </div>
<% end %>
```

* これはフォームを送信するフォームのpartialです。`form.submit`が「登録する」ボタンを表示します。
* 情報を入力して「登録する」ボタンをクリックすると、`ReservationsController#create`アクションが呼び出されます（下記）。

```ruby:app/controllers/reservations_controller.rb
  def create
    @reservation = Reservation.new(reservation_params)

    if params[:confirmed]
      respond_to do |format|
        if @reservation.save
          format.html { redirect_to @reservation, notice: "Reservation was successfully created." }
          format.json { render :show, status: :created, location: @reservation }
        else
          format.html { render :new, status: :unprocessable_content }
          format.json { render json: @reservation.errors, status: :unprocessable_content }
        end
      end
    else
      render :confirm, status: :unprocessable_content
    end
  end
```

* フォームが送信されると、ここの`ReservationsController#create`が呼び出されますが、`params[:confirmed]`が空ですので、`render :confirm, status: :unprocessable_content`が呼び出されます。ここで`status: :ok`を使っていないことをご確認ください。**Hotwireでは`status: :unprocessable_content`が重要なポイントです。下記で解説しています。**
* 下記の`confirm.html.erb`がレンダリングされます。

```erb:app/views/reservations/confirm.html.erb
...
<div class="max-w-lg mx-auto">
  <div class="mb-16">
    <h1 class="text-4xl text-center">Confirm reservation</h1>
  </div>
  <div class="hidden">
    <%= render "form", reservation: @reservation %>
  </div>

  <div class="actions-row">
    <%= button_tag "Back", name: "review", form: "reservation_form", class: "btn-outline-primary" %>
    <%= button_tag "Confirm", name: "confirmed", form: "reservation_form", class: "btn-outline-primary" %>
  </div>

  <div class="mt-8">
    <%= render "reservation", reservation: @reservation %>
  </div>
</div>
```

* 確認画面です。
* 先ほど送信されたフォームのステートを保存するために、`<%= render "form", reservation: @reservation %>`でフォームを再描画しています。ただし`<div class="hidden">`を使うことでフォームを隠しています。（通常は`<input type="hidden">`を使ってフォームのステートを保持しますが、今回は`form`を再利用するためにCSSで隠しています）
* `button_tag "Confirm", name: "confirmed"...`で"Confirm"ボタンを表示しています。
* "Confirm"ボタンを押すと先ほどの`ReservationsController#create`が再び呼び出されますが、今回は`params[:confirmed]`がtruthyになりますので、`@reservation`が保存されます。


## Turbo Drive/FramesとPOST/PATCHからstatus 200遷移時の問題

Turbo Drive/Framesで非GET methodのformを送信する際、[Status 200系を返すと無視されます](https://turbo.hotwired.dev/handbook/drive#redirecting-after-a-form-submission)。Turbo Drive/Framesで**非GET methodを送信した場合、下記の２つのレスポンスだけが可能です**。なおTurbo Streamsはこれと異なり、Status 200系を返せます。

* 非GETを送信 => 成功 => Status 300系でredirect => GETの結果を表示する
* 非GETを送信 => バリデーション失敗 => Status 400系のresponse => responseのbodyを表示する

理由はURLの考え方によります。例えば`/reservations/new`のURLで新規作成ページを表示し、POST `/reservations`を送信し、それに対してstatus 200のレスポンスが返ってきた場合、URLを`/reservations/new`のままにしておくわけにもいかないし、`/reservations`に遷移させるわけにもいきません。そうしてしまうのブラウザのリロード時に違うページが表示されてしまいます。Turbo Drive/Framesはstatus 200のページが正しくリロードできることにこだわっていますので(キャッシュの動作にも悪影響が出る可能性があります)、非GET methodのform送信からのstatus 200レスポンスを許容していないのです。

> The reason Turbo doesn’t allow regular rendering on 200’s from POST requests is that browsers have built-in behavior for dealing with reloads on POST visits where they present a “Are you sure you want to submit this form again?” dialogue that Turbo can’t replicate. Instead, Turbo will stay on the current URL upon a form submission that tries to render, rather than change it to the form action, since a reload would then issue a GET against that action URL, which may not even exist.

このため、確認画面を表示するには下記の方法を使います。

* POST/PATCHを送信 => バリデーション成功 => Status 400系のresponse => responseのbody(確認画面)を表示する
* 非GETを送信 => バリデーション失敗 => Status 400系のresponse => responseのbody(エラー画面)を表示する

なお確認画面を表示する方法は他にもあります。例えば**フォームのステートを一時的にsessionやデータベースに保存する場合は上記が当てはまらない可能性がありますので、適宜判断していただくことになります**。
