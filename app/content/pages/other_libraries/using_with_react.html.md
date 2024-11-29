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

## Apple Store模写の例 --- apple-store

Apple Storeを模写した例です。[デモ](/react/iphone)はこちらに用意しています。

```erb:app/views/react/iphone.html.erb
<%= provide :head, javascript_include_tag("react_iphone", "data-turbo-track": "reload", type: "module") %>
<div class="container container-lg mx-auto px-4 pt-16">
  <div class="mx-auto min-w-[1028px] lg:max-w-5xl">
    <div id="root"></div>
  </div>
</div>
<% if @catalog_data %>
  <script type="application/json" id="catalog-data">
    <% @catalog_data[:images].transform_values! { image_path(_1) } %>
    <%= @catalog_data.to_json.html_safe %>
  </script>
<% end %>
```

* `javascript_include_tag "react_iphone"`でReactアプリの本体の`react_iphone.jsx`を読み込んでいます
* Reactアプリを埋め込む先の`<div id="root"></div>`を設置しています
* `<script type="application/json" id="catalog-data">`の箇所ではカタログのデータ（オプションごとの価格など）をJSON形式に変換し、記載しています
   * これはカタログデータを読み込むためのブラウザからサーバへのリクエストを減らすためで、こうするとページロードの遅延を減らせます
   * より一般的なのは`@catalog_data`をJSONとして出力するJSON APIを用意し、Reactページを読み込んだら`fetch()`で読み込むことです。しかしこれは無駄なリクエストが発生しますので、遅延が大きくなります

```jsx:app/javascript/react_iphone.jsx
import React from "react";
import {createRoot} from "react-dom/client";
import {IPhoneShow} from "./react/components/IPhoneShow"

document.addEventListener("turbo:load", () => {
  const dataJSON = document.getElementById('catalog-data').textContent
  const data = JSON.parse(dataJSON)

  const root = createRoot(document.getElementById("root"))
  root.render(<IPhoneShow catalogData={data}/>);
});

```

* ページの読み込みが完了すると`turbo:load`イベントが発火します。そして以下のことを実行します
   * `turbo:load`はTurboが用意しているカスタムイベントです。Turboを使用しない場合は`DOMContentLoaded`イベントを使うのが一般的です 
* 上記の`<script type="application/json" id="catalog-data">`にあったJSONのデータを読み込み、`data`オブジェクトにセットします
* `IPhoneShow`コンポーネントに`data`をprops(`catalogData`)として渡し、これを`<div id="root">`の箇所に埋め込みます

## まとめ --- summary

* HotwireをReactと一緒に使うことは問題なくできます
* `<script type="application/json" ...>...</script>`にデータを埋め込めばERBからReactにデータを渡せます。ダイナミックなコンテンツであっても、無駄なリクエストを送信せずに、Next.jsのSSRと同等の早さでページを表示できます
