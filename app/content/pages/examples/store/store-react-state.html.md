---
title: ステートをReactに持たせる
layout: article
order: 30
published: true
siblings: true
---

## 概略 --- introduction

ここではReactを使います。ステートをReactに持たせます。

[デモはこちら](/react/iphone)に用意しています。

* ReactをHotwireのページに埋め込む必要があります。これはGitHubでも行われていることですので、一般的です。方法は[「Reactと一緒に使う」](/other_libraries/using_with_react)で紹介しています
* 各オプションごとの製品価格および製品オプションの初期値をReactにあらかじめ渡す必要があります。これも[「Reactと一緒に使う」](/other_libraries/using_with_react)で紹介しています
* オプションが選択されるとReactでイベントハンドラが呼び出され、イベントハンドラの中で`useState`で作成されたステートを更新します
* Reactはステートが変更されると再レンダリングが自動的に行われます。ページ全体が再レンダリングされて、変更が反映されます

Reactはステートを中心とした情報の流れを強制しています。**イベントハンドラ ==> ステート ==> 再レンダリング**と情報が流れます。

## コード --- code

### Reactの読み込みとデータの受け渡し --- react-load-and-data-transfer

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

* `javascript_include_tag "react_iphone"`でReactで書かれたコードを読み込みます。後述しますが、Reactは`<div id="root"></div>`の箇所に挿入されます
* 製品オプションごとの価格などをReactに渡す必要があります。これは`<script type="application/json" id="catalog-data">`で行います。`@catalog_data`としてコントローラから渡されたデータを、この中にJSON形式で書き込みます
   * `image_path()`で`@catalog_data`を処理しているところは、[Railsがアセットのフィンガープリントをするため](https://railsguides.jp/asset_pipeline.html#フィンガープリントと注意点)です


### Reactコードの接続とデータの読み込み --- react-code

```jsx:app/javascript/react_iphone.jsx
// ...

document.addEventListener("turbo:load", () => {
  const dataJSON = document.getElementById('catalog-data').textContent
  const data = JSON.parse(dataJSON)

  const root = createRoot(document.getElementById("root"))
  root.render(<IPhoneShow catalogData={data}/>);
});
```

* Reactを接続するために、`turbo:load`のイベントを待ちます。HotwireはSPAなので、`DOMContentLoaded`が発火するとは限りません。Turboのページ遷移の時に発火する`turbo:load`を使う方が無難です
* HTMLから`#catalog-data`要素のデータを読み込み、JSONをparseして、propsとして`IPhoneShow`コンポーネントに渡しています。これはオプションごとの価格情報などを含むデータです
* `root.render()`でReactコンポーネントの初回レンダリングをしています

### ページの表示 --- display-page

```jsx:app/javascript/react/components/IPhoneShow.jsx
import React, {useState} from "react"
import IPhone from "./models/IPhone"
import IphoneOption from "./react/components/IphoneOption"
import IphoneColorOption from "./react/components/IphoneColorOption"

export function IPhoneShow({catalogData}) {
  const [iPhoneState, setIphoneState] = useState(
    {model: null, color: null, ram: null}
  )
  const [colorText, setColorText] = useState("Color – Natural Titanium")

  const iPhone = new IPhone(iPhoneState, catalogData)

  function handleOptionChange(name, value) {
    setIphoneState({...iPhoneState, [name]: value})
  }

  function handleColorChange(color) {
    setIphoneState({...iPhoneState, color})
  }

  function handleSetColorText(selectedColor) {
    setColorText(catalogData.colors[selectedColor].full_name)
  }

  function handleResetColorText() {
    setColorText(iPhone.fullColorName())
  }

  function itemPricing(model, ram) {
    const pricing = iPhone.pricingFor(model, ram)
    return [`From \$${pricing.lump.toFixed(2)}`, `or \$${pricing.monthly.toFixed(2)}/mo.`, "for 24 mo."]
  }

  return (<>
     ...
    </>
  )
}
```

* Apple Storeページのコンポーネントです
* 選択された製品オプションを`iPhoneState`のステートに保持します
* カラー選択のところのテキストを`colorText`のステートに保持します。これはホバー時に表示するだけの内容なので、製品オプションのステートとは別に保持します
* ビジネスロジックを収めた`Iphone`クラスのインスタンスを作成します。これは**Stimulusで使用したモデルをそのまま再利用しています**
* `handleOptionChange`, `handleColorChange`の関数はオプション選択イベントを処理するイベントハンドラです。`iPhoneState`を更新します
* `handleResetColorText`はホバー時のカラーテキストを更新するものです

## まとめ --- summary

* [Hotwireでステートをサーバに持たせた例](/examples/store/store-server-state)と構造としてはよく似ています
    * イベントハンドラの中で`iphoneState`ステートに保存し、IPhoneオブジェクトでロジックを処理して、コンポーネントを再レンダリングしています
    * Reactはステートを更新すると自動的に再レンダリングします。そのため、Stimulusで必要だった`#render*`のメソッドが不要になります
* Stimulus Controller版では`#render*`メソッドを使ってステートをDOMに反映させました。一方でReactの場合は`IphoneShow`コンポーネント(`app/javascript/react/components/IPhoneShow.jsx`)のJSXの中にロジックが埋め込まれています
    * テンプレートの中にロジックを埋め込むのはRails ERBと同じやり方です。（つまり[ステートをサーバに持たせた例](/examples/store/store-server-state)と同じです）。なお、今回は解説を省略しました
    * テンプレートの中にロジックを埋め込むことは賛否両論ありますが、HTMLとロジックの関係がわかりやすいと思います
