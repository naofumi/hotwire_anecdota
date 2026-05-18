---
title: リアルタイム検索
section: Tips
layout: article
order: 50
published: true
descriptors:
  component_names:
    - Live Search
    - Realtime Search
  server_request: true
  state_management: []
  technologies:
    - Turbo Frames
    - Stimulus
  demo_urls:
    - ["デモ", "/customers"]
  related_pages:
    - /concepts/turbo-or-stimulus
    - /concepts/turbo-network-lag
    - /concepts/why-is-hotwire-fast

---

ここで作成するのはリアルタイム検索です。下記のビデオをご覧ください。

![realtime-search.mov](content_images/realtime-search.mov "mx-auto max-w-[600px]")

## 考えるポイント --- points-to-consider

* サーバとの非同期通信
   * 必要。
   * サーバ通信は`<input type="search">`タグの`input`イベントに応答して行います。少し特殊なのでStimulus controllerを用意します。
* TurboFrames/TurboStreams
   * 画面の１箇所のみを更新するため、TurboFramesで十分です。[^framesvsstreams]
* ステート管理
   * 不要。[^state]
* サーバへのリクエストの送り方
   * `<form>`タグに`requestSubmit()`を送る[^request]
  
[^request]: サーバにリクエストを送る際、JavaScriptからTurboFramesやTurboStreamsを使うことも可能です。またもちろん`fetch()`を使うこともできます。しかしHotwireはネイティブな感覚を重視しますので、`<form>`を普通にsubmitするように記述します。 

[^framesvsstreams]: TurboFramesとTurboStreamsのいずれを使用するかの判断基準は別途解説します。
[^state]: Reactの場合は最低限でもサーバから送信されたJSON APIのデータをステートに保管しなければなりません。  
      これはReactが任意のタイミングでコンポーネントを再レンダリングするためで、Hotwireでは不要になります。

## コード --- code

### 検索結果の表示 view --- search-results-view

```erb:app/views/customers/index.html.erb
<% content_for :title, "Customers" %>

<div class="max-w-lg mx-auto">
  <div class="mb-16">
    <h1 class="text-4xl text-center">Customers</h1>
  </div>

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

  <%= turbo_frame_tag "customers", target: "_top" do %>
    <table class="table table-striped w-full">
      <thead>
      <tr class="border-b-2 border-gray-900">
        <th class="p-2 text-left">Name</th>
        <th class="p-2 text-left">JP Name</th>
        <th></th>
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
          <td class="p-2">
            <%= link_to edit_customer_path(customer) do %>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
              </svg>
            <% end %>
          </td>
        </tr>
      <% end %>
      </tbody>
    </table>
  <% end %>
</div>
```

* 検索窓は`form_with`の中の`search_field_tag`で実装しています。HTMLの`<form>`タグを`<input type="search">`に相当します。
    * `data-controller="autosubmit"`属性で`AutosubmitController`(Stimulus)に接続します。
    * `data-autosubmit-wait-value="300"`属性ではリアルタイム検索をするときのdebounceの待ち時間を設定しています。
    * `data-turbo-frame="customers"`属性により、サーバから送られてきたHTMLは`<turbo-frame id="customers">`で指定されたTurbo Frameのところに入れように指示しています。
* `search_field_tag`(`<input type="search">`)には`data-action="input->autosubmit#submitWithDebounce"`属性がついています。
    * `input`イベントに対して、`AutosubmitController`(Stimulus)の`submitWithDebounce()`メソッドが呼ばれます。
* `search_field_tag`(`<input type="search">`)には`class="group-aria-busy:bg-[url('/Rolling@1x-1.4s-200px-200px.svg')]"`がついています。
   * これはpending UI(待ちUI)を表示するのに使用します。TurboFrameは自動的に通信中の`<frame>`に`aria-busy`属性をつけますので、CSS擬似セレクタで検出しています。
* `turbo_frame_tag "customers"`(`<turbo-frame id="customers>`)は、サーバから送られて来たHTMLが挿入される箇所です。

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
    clearTimeout(this.timeoutId)
    this.timeoutId = setTimeout(() => this.submit(), this.waitValue)
  }
}
```

* `submit()`は、`AutosubmitController`(Stimulus)が接続されたHTML要素の`form`に対して、`requestSubmit()`を呼ぶだけです。
* リアルタイム検索を行いますので、サーバに負荷をかけすぎないように[debounce処理](https://developer.mozilla.org/ja/docs/Glossary/Debounce)をしています。
* `submitWithDebounce()`は`submit()`にdebounce処理を追加したものです。

## メモ --- memo

* 今回はTurboが`<form>`要素に自動的に追加してくれる`aria-busy`属性を使い、CSSだけでpending UI (待ちUI)を実装しました。
* このほかにもHotwireは`<input>`タグに`data-turbo-submits-with`などでpending UI（待ちUI）を簡単に追加できたり、何もしなくても`disabled`属性が自動的についたりなど、[一般的な処理を最初から付けてくれいます](https://turbo.hotwired.dev/reference/attributes)。これもRailsの[Omakaseの発想](https://rubyonrails.org/doctrine#omakase)と言えるでしょう。
* 一方でReactはこのような仕組みを用意せず、各自で機能を追加する形になっています。

