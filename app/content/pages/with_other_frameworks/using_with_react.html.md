---
title: Reactと一緒に使う
section: With Other Frameworks
layout: article
order: 010
published: true
---

## MPAの中にReactを埋め込む

HotwireやMPAのページの中にReactを埋め込むのは簡単です。[Reactの公式サイトによると](https://ja.react.dev/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)、**Facebookも長らくこの使い方がメインでした**。GitHubも同様です。**GitHubの場合はTurbo中心で作られてページの中の一部分をReactで実装しています**。

**Apple StoreもMPAページの中にReactを埋め込んで使っています**。ブラウザ側だけで製品のオプションを選択して、価格を表示しています。このような複雑なステートをフロンド側だけで管理するために使っているようです。なおAppleウェブサイトの他のページは、ほとんどがMPAになっています。必要なところだけReactを使っています。

一般的なページ、特にマーケティング的なページは、Reactの必要がありません。MPAでも十分ですし、ウェブデザイナーはMPAの方に馴染んでいることも多いでしょう。ほとんどのページをMPAで作り、複雑なステート管理が必要なところだけをReactで書くのは賢明な選択です。

![apple-store.webp](content_images/apple-store.webp "max-w-[500px] mx-auto")

## 実例の紹介 --- examples

本サイトでは何箇所かでHotwireのページの中にReactを埋め込んでいます。以下紹介します。

### サイドパネルの例 --- sidepanel-example

下記のUIを実装する例です。[デモ](/users)で実際に触っていただくこともできます。「variantを選択」のところで「react」を選択してください。

![side-panel-hotwire.mov](content_images/side-panel-hotwire.mov "mx-auto max-w-[500px]")

```erb:app/views/users/index.html+react.erb
<% provide :head, javascript_include_tag("application_react_users", "data-turbo-track": "reload") %>
<% set_breadcrumbs [["Users", users_path]] %>

<% content_for :title, "Users" %>

<div id="root"></div>
```

* `javascript_include_tag("application_react_users"...`では`application_react_users.js`を読み込みます。これがReactアプリの本体です
* Reactアプリを埋め込む先の`<div id="root">`をセットしています

```jsx
import {createRoot} from "react-dom/client"
import React, {useEffect, useState} from "react"

document.addEventListener("turbo:load", () => {
  const root = createRoot(document.getElementById("root"))

  root.render(<UsersIndex />);
});

function UsersIndex() {
  const [users, setUsers] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetch("/users", {
      headers: {Accept: "application/json"},
    }).then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  return (
    <div className="grid grid-cols-2 gap-x-2">
    {/*  ... ページの内容はここ ... */}
    </div>
  )
}
```

* `turbo:load`イベントに応答して、先ほどの`<div id="root">`の箇所に`UsersIndex`コンポーネントを埋め込んでいます。`turbo:load`は画面遷移が完了した時に呼び出される、Turboのカスタムイベントです
* なお通常は`turbo:load`ではなく`DOMContentLoaded`イベントを使います。しかしHotwireはSPAですので、ページをリロードしないページ遷移をします。ページをリロードした時にだけ発火される`DOMContentLoaded`よりも、TurboでSPA的にページ遷移しても発火する`turbo:load`を使うのはこのためです

### Apple Store模写の例 --- apple-store

Apple Storeを模写した例です。[デモ](/react/iphone)はこちらに用意しています。

```erb:app/views/react/iphone.html.erb
<!DOCTYPE html>
<html>
<head>
  <!-- ... -->
  <%= stylesheet_link_tag "application", "data-turbo-track": "reload" %>
  <%= javascript_include_tag "react_iphone", "data-turbo-track": "reload", type: "module" %>
</head>

<body>
<div class="container container-lg mx-auto px-4 pt-16">
  <div class="mx-auto min-w-[1028px] lg:max-w-5xl">
    <div id="root"></div>
  </div>
</div>
</body>

<% if @catalog_data %>
  <script type="application/json" id="catalog-data">
    <% @catalog_data[:images].transform_values! { image_path(_1) } %>
    <%= @catalog_data.to_json.html_safe %>
  </script>
<% end %>
</html>
```

* `javascript_include_tag "react_iphone"`でReactアプリの本体の`react_iphone.jsx`を読み込んでいます
* Reactアプリを埋め込む先の`<div id="root"></div>`を設置しています
* `<script type="application/json" id="catalog-data">`の箇所ではカタログのデータ（オプションごとの価格など）をJSON形式に変換し、記載しています。これはカタログデータを読み込むためのブラウザからサーバへのリクエストを減らすためで、こうするとページロードの遅延を減らせます

```jsx:app/javascript/react_iphone.jsx

// ...

document.addEventListener("turbo:load", () => {
  const dataJSON = document.getElementById('catalog-data').textContent
  const data = JSON.parse(dataJSON)

  const root = createRoot(document.getElementById("root"))
  root.render(<IPhoneShow catalogData={data}/>);
});

function IPhoneShow({catalogData}) {
  // ...
}
```

* ページの読み込みが完了すると`turbo:load`イベントが発火します。そして以下のことを実行します
* 上記の`<script type="application/json" id="catalog-data">`にあったJSONのデータを読み込み、`data`オブジェクトにセットします
* `IPhoneShow`コンポーネントに`data`をprops(`catalogData`)として渡し、これを`<div id="root">`の箇所に埋め込みます

## まとめ --- summary

* HotwireをReactと一緒に使うことは問題なくできます
  * 通常はReactを読み込むイベントを`DOMContentLoaded`ではなく`turbo:load`にします。ただし事情により`turbo:load`が使えない場合は、そのページでそもそもTurboを読み込まないか、もしくはこのページに遷移するときは`data-turbo="false"`属性を使うなどすると良いと思います
* `<script type="application/json" ...>...</script>`にデータを埋め込み、ERBからReactにデータを渡せます。Reactがサーバにデータをリクエストする回数が減らせますので、ページロードの高速化に繋がります
    * 同じようなことはStimulusの`values`を使ってエレガントに実現できます
