---
title: リアルタイム検索
section: Tips
layout: article
order: 50
published: true
---

ここで作成するのはリアルタイム検索です。下記のようなUIです。

[デモはこちら](/customers)に用意しています。

![realtime-search.mov](content_images/realtime-search.mov "mx-auto max-w-[600px]")

## 考えるポイント --- points-to-consider

![interactive-flow-hotwire.webp](content_images/interactive-flow-hotwire.webp "mx-auto max-w-[500px]")

1. データはサーバから非同期で受け取る必要があります
   1. Hotwireではサーバとの非同期通信は必ずTurboを使います。Turbo Drive, Turbo Frames, Turbo Streamsのどれを使うかだけ、選択する必要があります
   3. **Turbo Drive, Turbo Frames, Turbo Streamsの選択基準は、画面のどこを更新し、どこはステートを更新せずに維持したいかになります**
      1. 今回は検索結果の箇所を更新しつつ、検索窓のステートを維持する必要があります。検索窓のステートを維持しないと、入力中にフォーカスがずれたり、日本語入力がうまくいかなかったりするためです
      2. ステートを維持したい箇所があること、かつ更新する箇所が１つにまとめられることからTurbo Framesを選択します
         1. 更新する箇所が複数の場合はTurbo Streamsを検討します
         2. Turbo Drive + Morphingという選択肢もありますが、今回は省略します
2. Turboだけでイベントハンドリングできるか、それともStimulusで前後の機能追加する必要があるかを考えます
   1. 今回は`<a>`タグや`<form>`タグのネイティブな動作だけでは不十分です。検索窓（`<input>`タグ）の`input`イベントを捉えないとリアルタイム検索に検索してくれません
   2. したがってStimulusで`<input>`タグの`input`イベントを捉える処理を書く必要があります
3. Stimulusを使うと決めたら、次はステートを持つか否かを考えます。今回のStimulus controllerは`<input>`タグの`input`イベントを受け取り、そのまま`<form>`タグのsubmitをするだけですので、ステートを持つ必要はありません
4. Stimulus controllerの制御範囲を考えます。今回のStimulus controllerは、Turboがデータ送信する際のことは一切制御しません。あくまでも`<form>`タグのsubmitまでが責務です。したがって制御範囲は`<form>`タグだけで十分であり、検索結果を制御する必要はありません
5. 最後に、Turboを使う場合はネットワークの遅延を意識する必要があります
   1. アプリの性質上、ネットワーク遅延は大きそうかどうか（海外の人も使うか、モバイルで使うか、あるいはイベント会場で使うかなど）
   2. 遅延が発生しそうならば、pending UI（待ちUI）を用意します

## コード --- code

### 検索結果の表示 view --- search-results-view

```erb:app/views/customers/index.html.erb
<% content_for :title, "Customers" %>

<div class="max-w-lg mx-auto">
  <div class="mb-16">
    <h1 class="text-4xl text-center">Customers</h1>
  </div>

  <%= render "search" %>

  <%= turbo_frame_tag "customers" do %>
    <table class="table table-striped w-full">
      <thead>
      <tr class="border-b-2 border-gray-900">
        <th class="p-2 text-left">Name</th>
        <th class="p-2 text-left">JP Name</th>
      </tr>
      </thead>
      <tbody>
      <% @customers.each do |customer| %>
        <tr class="group border-t border-gray-400 [:first-child]:border-none">
          <td class="p-2">
            <%= customer.name %>
          </td>
          <td class="p-2">
            <%= customer.jp_name %>
          </td>
        </tr>
      <% end %>
      </tbody>
    </table>
  <% end %>
</div>
```

* 検索窓は`search` partialで分けています
* `<turbo-frame id="customers>`を設置しています
    * 更新されるたび、変更されるのはこのTurbo Frameの範囲だけです
    * 画面の他の箇所はそのままです。検索窓のカーソル位置、入力されている文字等、そのままです

### 検索窓 --- search-input

```erb:app/views/customers/_search.html.erb
<div class="max-w-72 mx-auto mb-10">
  <%= form_with url: customers_path,
                method: :get,
                class: "group",
                data: {controller: "autosubmit",
                       autosubmit_wait_value: 300,
                       turbo_frame: "customers"} do  %>
  <div class="mt-2">
    <%= search_field_tag :query, params[:query],
                         class: "group-aria-busy:bg-[url('/Rolling@1x-1.4s-200px-200px.svg')] bg-contain bg-no-repeat bg-[left_0_top_0] block w-full rounded-full border-0 pr-4 pl-10 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm/6",
                         placeholder: "検索",
                         data: { action: "input->autosubmit#submitWithDebounce" }
    %>
  </div>
    <% end %>
</div>
```

* 検索窓のpartialです
* `data-controller="autosubmit"`属性のところで`autosubmit` Stimulus Controllerと接続しています
    * その際`data-autosubmit-wait-value="300"`属性ではリアルタイム検索をするときのdebounceの待ち時間を設定しています 
* また`data-turbo-frame="customers"`属性により、サーバからのレスポンスは`<turbo-frame id="customers">` Turbo Frameのところに入れように指示しています
* `search_field_tag`は検索窓の`<input type="search">`を作りますが、そこには`data-action="input->autosubmit#submitWithDebounce"`属性がついています
   * この`input`タグの`input`イベントを受け取ると、`autosubmit` Stimulus Controllerの`submitWithDebounce()`が呼ばれる仕組みになっています
* Turboはリクエスト送信中に、該当する`<form>`属性および`<turbo-frame>`に`aria-busy`属性を自動的につけます
    * `group-aria-busy:bg-[url('/Rolling@1x-1.4s-200px-200px.svg')]`のところで`aria-busy`をCSS擬似セレクタによって検出し、pending UI（待ちUI）を表示しています

### Autosubmit Stimulus Controller --- autosubmit-controller

```js:app/javascript/controllers/autosubmit_controller.js
import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="autosubmit"
export default class extends Controller {
  static values = {wait: {type: Number, default: 300}}

  connect() {
    this.form = this.element
    this.timeoutId = null
  }

  submit() {
    this.form.requestSubmit()
  }

  submitWithDebounce() {
    console.log("submitWithDebounce")
    clearTimeout(this.timeoutId)
    this.timeoutId = setTimeout(() => this.submit(), this.waitValue)
  }
}
```

* 自動的にformを送信するためのStimulus controllerです
* リアルタイム検索を行いますので、サーバに負荷をかけすぎないように[debounce処理](https://developer.mozilla.org/ja/docs/Glossary/Debounce)をしています
* `static values =`ではdebounce処理の待ち時間(wait)を設定しています。デフォルトは300msですが、HTML属性の`data-autosubmit-wait-value="..."`を設定すれば自由に変えられます
* `submit()`がメインの処理です。やっていることはformに対して`requestSubmit()`を呼んでいるだけです
* `submitWithDebounce()`は`submit()`にdebounce処理を追加したものです

## まとめ --- summary

![interactive-flow-hotwire.webp](content_images/interactive-flow-hotwire.webp "max-w-[600px] mx-auto")

* 今回はStimulus経由でTurboを実行している形をとっています。一番下の<span class="text-green-600">緑</span>のルートです
   * Turboは`<a>`タグのクリックや`<form>`内の`<button>`押下には反応します。しかし今回は`input`イベントに応答しますのでStimulusを使わなければなりません
* Turbo Drive, Turbo Frames, Turbo Streamsの選択については、下記を考慮してTurbo Framesを選択しています
    * 画面の一部についてはステートを維持しなければならないこと（`<input>`タグのフォーカス）
    * 更新する箇所が一つにまとめられること
    * ステートを維持する必要がない場合はTurbo Driveで十分なことが多くなります。また複数箇所を独立に更新する必要がある場合はTurbo Streamsを使います。ただしMorphingも使えますので、各選択肢が使えるシチュエーションはかなり重複してきます
* 今回のStimulus Controllerが非常にシンプルだったこともあり、再利用性が高いことが最初からわかります。Controllerの命名を`realtime-search`のようにせず、最初から`autosubmit`にしていますが、これは再利用性が予見できたためです。検索以外の用途でも使えるような名前にしています
    * ただし最初から再利用できそうだと確信できるのは比較的稀だと私は感じています。[通常はあまり再利用性を考えず](/opinions/reusability)、後で気づいたら検討するぐらいで良いと思います

## メモ --- memo

Next.jsはversion 15になって、非同期通信で[クライアントサイドナビゲーションをする`<Form>`コンポーネント](https://nextjs.org/blog/next-15#form-component)を用意しました。一方でHotwireは当初から`<form>`でGETリクエストをするようにできており、前身の[UJS (Unobtrusive JavaScript)の頃](https://railsguides.jp/v6.1/working_with_javascript_in_rails.html#組み込みヘルパー)からこの機能を用意しています。

Hotwireは`<input>`タグに`data-turbo-submits-with`などでpending UI（待ちUI）をつけられたり、`disabled`属性が自動的についたり、さらに`<form>`要素に自動的に`aria-busy`がついたりするなど、自動でやってくれる範囲が広いです。React/Next.jsであれば新しい`<Form>`要素を使う上に、`useFormStatus()`等を使う必要があります。

さすがに[Basecampプロジェクト管理システム](https://basecamp.com)や[Hey電子メールシステム](https://www.hey.com)で育っただけあって、Next.jsと比較した場合、CRUD周りの機能にはHotwireに一日の長があると言えそうです。



