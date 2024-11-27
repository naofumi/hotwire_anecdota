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

1. データはサーバから非同期で受け取る必要があります
   1. Hotwireではサーバとの非同期通信は必ずTurboを使います。Turbo Drive, Turbo Frames, Turbo Streamsのどれを使うかだけ、選択する必要があります
   3. **Turbo Drive, Turbo Frames, Turbo Streamsの選択基準は、画面のどこを更新し、どこはステートを更新せずに維持したいかになります**
      1. 今回は検索結果の箇所を更新しつつ、検索窓のステートを維持する必要があります。検索窓のステートを維持しないと、入力中にフォーカスがずれたり、日本語入力がうまくいかなかったりします
      2. ステートを維持したい箇所があること、かつ更新する箇所が１つにまとめられることからTurbo Framesを選択します
2. Turboだけでイベントハンドリングできるか、それともStimulusで機能追加する必要があるかを考えます
   1. 今回は`<a>`タグや`<form>`タグのネイティブな動作だけでは不十分です。検索窓（`<input>`タグ）の`input`イベントを捉えないとリアルタイム検索に検索してくれません
   2. したがってStimulusで`<input>`タグの`input`イベントを捉える処理を書く必要があります
3. Stimulusを使うと決めたら、次はステートを持つか否かを考えます。今回のStimulus controllerは`<input>`タグの`input`イベントを受け取り、そのまま`<form>`タグのsubmitをするだけですので、ステートを持つ必要はありません
4. 最後のStimulus controllerの制御範囲を考えます。今回のStimulus controllerは、Turboがデータ送信する際のことは一切制御しません。あくまでも`<form>`タグのsubmitまでが責務です。したがって制御範囲は`<form>`タグだけで十分であり、検索結果を制御する必要はありません

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
* `turbo_frame_tag "customers"`を設置しています
    * 更新されるたび、変更されるのはこのTurbo Frameの範囲だけに絞ることができるようになります

### 検索窓 --- search-input

```erb:app/views/customers/_search.html.erb
<div class="max-w-72 mx-auto mb-10">
  <%= form_with url: customers_path,
                method: :get,
                data: {controller: "autosubmit",
                       autosubmit_wait_value: 300,
                       turbo_frame: "customers"} do  %>
  <div class="mt-2">
    <%= search_field_tag :query, params[:query],
                         class: "block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm/6",
                         placeholder: "検索",
                         data: { action: "input->autosubmit#submitWithDebounce" }
    %>
  </div>
    <% end %>
</div>
```

* 検索窓のpartialです
* `data: {controller: "autosubmit"}`のところで`autosubmit` Stimulus Controllerと接続しています
    * その際`autosubmit_wait_value: 300`でリアルタイム検索をするときのdebounceの待ち時間を設定しています 
* また`turbo_frame: "customers"`により、サーバからのレスポンスはTurbo Frameの`id="customers"`のところに入れように指示しています
* `search_field_tag`は検索窓の`<input type="search">`を作りますが、そこには`data: { action: "input->autosubmit#submitWithDebounce"`が属性としてついています
   * この`input`タグの`input`イベントを受け取ると、`autosubmit` Stimulus Controllerの`submitWithDebounce()`が呼ばれる仕組みになっています

### Autosubmit Stimulus Controller --- autosubmit-controller

```js:app/javascript/controllers/autosubmit_controller.js
import {Controller} from "@hotwired/stimulus"
import {debounce} from "../utilities/utilities"

// Connects to data-controller="autosubmit"
export default class extends Controller {
  static values = {wait: {type: Number, default: 300}}

  connect() {
  }

  submit() {
    this.element.form.requestSubmit()
  }

  submitWithDebounce() {
    debounce(() => this.submit(), this.waitValue)()
  }
}
```

* 自動的にformを送信するためのStimulus controllerです
* リアルタイム検索を行いますので、サーバに負荷をかけすぎないように[debounce処理](https://developer.mozilla.org/ja/docs/Glossary/Debounce)をしています。そのための関数`debounce`を使っていますが、これは`app/javascript/utilities/utilities.js`に配置しています。今回は解説しません。
* `static values =`ではdebounce処理の待ち時間(wait)を設定しています。デフォルトは300msですが、HTML属性の`data-autosubmit-wait-value="..."`を設定すれば自由に変えられます
* `submit()`がメインの処理です。単にformに対して`requestSubmit()`を読んでいるだけです
* `submitWithDebounce()`はdebounce処理を施した`submit()`を実行するものです

## まとめ --- summary

![interactive-flow-hotwire.webp](content_images/interactive-flow-hotwire.webp "max-w-[600px] mx-auto")

* 今回はStimulus経由でTurboを実行している形をとっています。一番下の<span class="text-green-600">緑</span>のルートです
   * Turboは`<a>`タグのクリックや`<form>`内の`<button>`押下には反応しますが、それ以外のイベントに呼応するときはStimulusを使います
* Turbo Drive, Turbo Frames, Turbo Streamsの選択については、下記を考慮してTurbo Framesを選択しています
    * 画面の一部についてはステートを維持しなければならないこと（`<input>`タグのフォーカス）
    * 更新する箇所が一つにまとめられること
    * ステートを維持する必要がない場合はTurbo Driveで十分なことが多くなります。また複数箇所を独立に更新する必要がある場合はTurbo Streamsを使います。ただしMorphingも使えますので、各選択肢が使えるシチュエーションはかなり重なります
* 今回のStimulus Controllerが非常にシンプルだったこともあり、これはかなり再利用性が高いことが最初からわかります。今回はcontrollerの命名を`realtime-search`のようにせず、最初から`autosubmit`にしていますが、これはそのためです。検索以外の用途でも使えるような名前にしています
    * ただし最初から再利用できそうだと確信できるのは比較的稀だと私は感じています。通常はあまり再利用性を考えず、後で気づいたら検討するぐらいで良いと思います
