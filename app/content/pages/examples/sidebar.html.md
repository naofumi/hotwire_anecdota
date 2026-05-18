---
title: サイドバーメニュー
layout: article
order: 60
published: true
descriptors:
  component_names:
    - Sidebar
    - Side Navigation
  server_request: true
  state_management:
    - data-turbo-permanent
  technologies:
    - Turbo
  demo_urls:
    - ["デモ", "/components/sidebar"]
---

作りたいの下記のUIです。

![sidebar.mov](content_images/sidebar.mov)

## 考えるポイント --- points-to-consider

* ページ遷移をしてもサイドバーのステートが維持される必要があります。
  * "Teams"をクリックすると"Engineering"のリンクが表示されますが、**ページ遷移をしてもこのステートが維持されています**。
* **ステートを維持する**方法は大きく２つ考えることができます。
  * **データを維持し、そこから毎回HTMLをレンダーする方法:**
     * Reactの場合は**どのサブメニューが開いているか**をステート(データ)として保持します。 ページにまたがりますので、ステートは`{openedSubmenuID: [string]}`などの形で、ルータよりも上位階層のプロバイダなどに保持するでしょう。
     * MPAの場合はcookieなどにこのステート(データ)を保持し、サーバでレンダリングするだびに読み出すでしょう。
  * **DOMを丸ごと維持し、以降はレンダリングしない方法:** 
     * Turboの場合は**サブメニューが開いている状態のDOM丸ごと**をステートとして保持して対応します。

## TurboでDOMを丸ごと維持する方法 --- how-to-preserve-dom

* **サーバ画面の一部だけを切り貼りする方法:** 
  * Turbo FramesやTurbo Streamsで行います。切り出されたところだけが変更されますので、それ以外のDOMのステートはそのままです。
* **上書きされない領域を宣言する方法:**
  * `data-turbo-permanent`がこれに該当します。`data-turbo-permanent`で指定されたところは、`id`が一致している限り、サーバレスポンスに上書きされなくなります。
  * `data-turbo-permanent`はTurbo Driveに関わりますので、Turbo Streamsには効きません。`data-turbo-permanent`で宣言された領域をあとでTurbo Streamsで書き換えることは可能です。この辺りは[Cookpad社が実例を紹介しています](https://techlife.cookpad.com/entry/2024/11/13/130000)。

## コード --- code

### Viewのメインページ --- main-view

```erb:app/content/pages/examples/sidebar.html.md
<div class="flex">
  <%= render 'sidebar' %>
  <div class="flex-grow">
    <%= image_tag "component_images/demo-dashboard.webp", class: "w-full" %>
  </div>
</div>
```

```erb:app/views/components/sidebar_other_page.html.erb
<div class="flex">
  <%= render 'sidebar' %>
  <div class="flex-grow">
    <%= image_tag "component_images/demo-engineering-team.webp", class: "w-full" %>
  </div>
</div>
```

* 今回は上記の画面を２つだけ用意しています。
* サイドバーは`render "sidebar"`で共通です。下記のパーシャルを使っています。

### `sidebar`パーシャル --- sidebar-partial

```erb:app/views/components/_sidebar.html.erb
<div data-turbo-permanent id="sidebar" data-controller="sidebar">
  <div class="h-full w-40 flex shrink-0 flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            <li>
              <%= link_to "Dashboard", component_path(:sidebar),
                          aria: {current: "page"},
                          data: { action: "click->sidebar#setCurrent" },
                          class: "block rounded-md aria-[current=page]:bg-gray-50 py-2 pl-10 pr-2 text-sm/6 text-gray-700" %>
            </li>
            <li>
              <div>
                <button type="button" class="group peer flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold text-gray-700 hover:bg-gray-50"
                        data-action="click->sidebar#toggle"
                        aria-controls="sub-menu-teams"
                        aria-expanded="false">
                  <svg class="size-5 shrink-0 text-gray-400 group-aria-expanded:rotate-90 group-aria-expanded:text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                    <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                  </svg>
                  Teams
                </button>
                <!-- Expandable link section, show/hide based on state. -->
                <ul class="mt-1 px-2 hidden peer-aria-expanded:block" id="sub-menu-teams">
                  <li>
                    <%= link_to "Engineering", component_path(:sidebar_other_page),
                                aria: {current: "false"},
                                data: { action: "click->sidebar#setCurrent" },
                                class: "block rounded-md py-2 pl-9 pr-2 text-sm/6 text-gray-700 hover:bg-gray-50 aria-[current=page]:bg-gray-50" %>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</div>
```

* 一番上部で `data-turbo-permanent id="sidebar"`を設定しています。これによってサイドバーのDOMは固定されて、[Turbo Driveで新しいページを読み込んでも、新しいHTMLで上書きされません](https://turbo.hotwired.dev/handbook/building#persisting-elements-across-page-loads)。なお`id`が必須になります
* サイドバーのサブメニューの開閉は`SidebarController` (Stimulus: 下記)で実装しています。そのために`data-controller="sidebar"`でStimulus Controllerに接続しています。
* メニューのリンクをクリックすると`aria-current="true"`となります。これは`data-action="click->sidebar#setCurrent"` (ERBでは`data: { action: "click->sidebar#setCurrent" }`)によって、`SidebarController`の`#setCurrent`の中で行われています。
* サブメニューの開閉は`data-action="click->sidebar#toggle"`で行います。`SidebarController`の`#toggle`で`aria-expanded`属性が`"true"`もしくは`"false"`になり、Tailwindの`hidden peer-aria-expanded:block`によりサブメニュー開閉の表示が制御されます。

### Stimulus controller --- stimulus-controller

```js:app/javascript/controllers/sidebar_controller.js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="sidebar"
export default class extends Controller {
  connect() {
  }

  toggle(event) {
    const button = event.currentTarget
    button.ariaExpanded = button.ariaExpanded === "true" ? "false" : "true"
  }

  setCurrent(event) {
    this.#resetAriaCurrent()
    const link = event.currentTarget
    link.ariaCurrent = "page"
  }

  #resetAriaCurrent() {
    this.element
      .querySelectorAll("[aria-current]")
      .forEach(e => e.ariaCurrent = "false")
  }
}
```

## まとめ --- summary

* **Turboでは領域を定めて、そこのDOMを丸ごと維持できます**。非常に簡単です。
* **Reactは少なくともコンセプトレベルでは毎回全てを再評価します**。そして差分だけを変更します。常にページ全体がスコープです。それに対して**Turboは画面を領域ごとに分割・独立させて考えます**。
