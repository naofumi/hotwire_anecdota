---
title: サイドパネル
section: Components
layout: section
order: 005
published: true
---

## 実装例

ここで作成するUIは下記のものです。[実際に動くデモ](/users)もご覧ください

![side-panel-hotwire.mov](content_images/side-panel-hotwire.mov "max-w-[500px] mx-auto")

## ポイント

* サーバからUserProfile情報を取得して、サイドパネルに表示します
    * これはTurboを使います。Turbo Streamsも使えますが、一般にTurbo Framesが第一選択肢になります。
* 表の行をクリックした時のイベントハンドラを用意
    * `a`タグは通常は自分の先祖要素のうち、一番近い`turbo-frame`と結びつきます。しかし今回は別のところにある`turbo-frame`なので、`a`タグに[`data-turbo-frame`属性](https://turbo.hotwired.dev/handbook/frames#targeting-navigation-into-or-out-of-a-frame)をつけます

なお、比較対象としてjQueryやReactを使った例も紹介しますが、詳しくは解説しません。Hotwire, jQuery, Reactのバージョン(variant)を切り替える方法は[foo](/foo)をご覧ください。

## コード --- code

### 1. 表示するサイドパネルの中身を用意します

```erb:app/views/users/user_profiles/show.html+hotwire.erb
<turbo-frame id="user-profile">
  <%# ... %>
  <%# 表示する内容はこの中 %>
  <%# ... %>
</turbo-frame>
```

* Hotwireで開発する時の順番として、サーバが返すHTMLを最初に作るのはよくやります。まずここから開始するのが良いでしょう
* この断片は`id="user-profile"`の`<turbo-frame>`に挿入されますので、同じ`id`の`<turbo-frame>`で囲みます

```ruby:app/controllers/users/user_profiles_controller.rb 
class Users::UserProfilesController < ApplicationController
  # ...
  
  # GET /user/1/user_profile or /user/1/user_profile.json
  def show
    @user_profile = @user.user_profile

    render layout: false # Hotwireでは不要。jQuery版でのみ必要
  end
  
  # ...
end
```

* サイドパネルのHTMLを返すエンドポイントです。ごく普通のものです

### 2. サイドパネルが挿入される箇所の準備

```erb:app/views/users/index.html+hotwire.erb
  <turbo-frame class="border rounded shadow" id="user-profile">
  </turbo-frame>
```

* `<turbo-frame>`の`id`属性で、サーバからのレスポンスが挿入される箇所を指定します

### 3. 表の行をクリックした時のイベントハンドラを用意

```erb:app/views/users/_user.html+hotwire.erb
<tr>
  <td class="relative">
    <%= link_to user_user_profile_path(user), data: {turbo_frame: "user-profile"} do %>
      <span class="absolute inset-0"></span>
      <%= user.user_profile.name %>
    <% end %>
  </td>
  <td class="relative">
    <%= link_to user_user_profile_path(user), data: {turbo_frame: "user-profile"} do %>
      <span class="absolute inset-0"></span>
      <%= user.email %>
    <% end %>
  </td>
</tr>
```

* Turboでサーバと通信をする場合、イベントを受け取るのはなるべく`<a>`や`<form>`を使います
* `data: {turbo_frame: "user-profile"}`はレンダリングされると`data-turbo-frame="user-profile"`になりますが、これはTurboでサーバからのレスポンスを受け取った時に、「2. サイドパネルが挿入される箇所」の`<turbo-frame="user-panel">`に挿入してくださいという指示になります
* HTML`<table>`の中で行を丸ごと囲む`<a>`タグは作れませんので、`<a>`タグを２列分用意したり、`span absolute inset`のパターンを使用しています

## Reactで書いた例 --- react


## jQueryで書いた例
