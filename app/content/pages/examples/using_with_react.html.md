---
title: Reactと一緒に使う
section: With Other Frameworks
layout: article
order: 100
published: true
---

## MPA/ERBの中にReactを埋め込む --- embed-react-in-an-mpa

HotwireやMPA/ERBのページの中にReactを埋め込むのは簡単です。[Reactの公式サイトによると](https://ja.react.dev/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)、**Facebookも長らくこの使い方がメインでした**。GitHubも最近はReactのページを増やしていますが、やり方としては**Turbo中心で作られたページの中の一部分でReactを使っています**。

また**Apple StoreもMPAページの中にReactを埋め込んでいます**。世界のどの会社よりもUI/UXを重視するAppleウェブサイトも、ほぼ全てがMPAになっていて必要なところだけReactを使っています。

![apple-store.webp](content_images/apple-store.webp)

## Apple Store模写の例 --- apple-store

下記はApple Storeを模写した例です。Reactの埋め込み方は完全に同じにはしていませんが、同じ効果があるような方法を使用しています。

[模写の詳しい解説はこちら](/examples/store/store-react-state)を確認してください。また[デモはこちら](/react/iphone)に用意しています。

```erb:app/views/react/iphone.html.erb
<%= provide :head, javascript_include_tag("react_iphone", "data-turbo-track": "reload", type: "module") %>
<div class="container container-lg mx-auto px-4 pt-16">
  <div class="mx-auto min-w-[1028px] lg:max-w-5xl">
    <div id="root"></div>
  </div>
</div>
<% if @catalog_data %>
  <script type="application/json" id="catalog-data">
    <%= @catalog_data.tap { it[:images].transform_values! { image_path(it) } }
                     .to_json
                     .html_safe %>
  </script>
<% end %>
```

* `javascript_include_tag "react_iphone"`でReactアプリの本体の`react_iphone.jsx`を読み込んでいます
* Reactアプリは`<div id="root"></div>`に埋め込まれます。
* `<script type="application/json" id="catalog-data">`の箇所ではカタログのデータ（オプションごとの価格など）をJSON形式に変換し、記載しています
   * 一般的には`@catalog_data`をJSONとして出力するJSON APIを用意し、Reactコンポーネントから`fetch()`で読み込みます。しかしこの方法ではデータを画面に表示されるまでに無駄な遅延が発生し、UI/UXが劣化します。
   * ここではUI/UX劣化を避けるために、最初のHTMLページにJSONデータを埋め込んでいます。
     * これはNext.jsがSSRのHydrationで使う手法とほぼ同じです。
     * Inertia.jsも同じ方法を使います。
   * 残念ながらこの方法を使わないでReactをMPA/ERBに埋め込んでいる例が非常に多くあります。これらはみなUI/UXが不必要に劣化してしまっています。

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

* ページの読み込みが完了すると`turbo:load`イベントが発火し、以下の処理が行われます。なお`turbo:load`はTurboが用意しているカスタムイベントで、Turboを使用しない場合は`DOMContentLoaded`イベントを使うのが一般的です 
* 上記の`<script type="application/json" id="catalog-data">`にあったJSONのデータを読み込み、`data`オブジェクトにセットします
* `IPhoneShow`コンポーネントに`data`をprops(`catalogData`)として渡し、これを`<div id="root">`の箇所に埋め込みます

## まとめ --- summary

* HotwireをReactと一緒に使うことは簡単にできます
* `<script type="application/json" ...>...</script>`にデータを埋め込めばERBからReactにデータを渡せます。ダイナミックなコンテンツであっても、無駄なリクエストを送信せずに、優れたUI/UXを保つことができます。

![Rails 8でReactを動かしてアセットパイプラインを勉強する](https://www.youtube.com/watch?v=J2jLG7FtUu4)
