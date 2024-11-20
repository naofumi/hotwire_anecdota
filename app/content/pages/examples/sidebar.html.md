---
title: サイドバーメニュー
layout: article
order: 005
published: true
---

作りたいの下記のUIです。
[デモはこちら](/examples/sidebar)にあります。

![sidebar-menu.webp](content_images/sidebar-menu.webp "max-w-[500px] mx-auto")

## 要件 --- requirements

* サイドバーメニューをクリックしてページ遷移ができること
* "Teams"のところは最初は隠れていて、矢印をクリックすると展開されること
* 新しい"Engineering"のページに遷移しても"Teams"のサブメニューは開いたままであること
* "Engineering"のページで再読み込みしたときに、"Teams"サブメニューが閉じてしまっても問題ない（本当は開いた状態にしたいのですが）

## 考えるポイント

1. メニューの項目をクリックすると、ページは遷移します。データはサーバにありますので、Turboを使うことになります
2. Turbo Drive, Turbo Frames, Turbo Streamsのいずれかを使うことになりますが、非常に多くのページでこのサイドバーメニューを使うことになりそうです。Turbo FramesやTurbo Streamsを使いますのません。Reactの、以降のすべてのページにTurbo FramesやTurbo Streamsの対応を入れないといけません。できればMPAと全く同じ感覚で使えるTurbo Driveを使えると良いです
3. Clickに反応してページ遷移をすれば良いので、各メニュー項目は`a`タグで十分です。これで自動的にTurbo Driveで画面遷移します。そしてここではStimulusを使う必要はありません（別のところでは使います）
4. "Teams"のサブメニューの矢印をクリックすると"Engineering"のリンクが表示されます。この動きはサーバとの通信が必要ありません
   1. サーバとの通信がありませんので、Stimulusを使うことになります
   2. Actionは矢印のクリック１つ、そして表示の変更は矢印の向きの変更と"Engineering"のリンクが見えるようになることです。この程度であればCSSで十分に対応できそうです
   3. ステートは`aria-expanded`を使えばアクセシビリティと一石二鳥になりますので、HTML`aria-expanded`属性でステートを持つようにします

一般的なRailsの開発であればこれでうまくいきます。

ただしそのためには遷移先のページ（今回は"Engineering"のページ）でもサイドバーメニューが表示され、かつ"Teams"サブメニューが展開されて状態になっていること、さらに"Engineering"のリンクが選択状態になっていること（背景が灰色になっていること）が必要です。**今までのMPAであればこれはERBで処理しますが、意外と大変でメンテナンス上心配です。非常に多くのページのあるサイトであれば、多少UI/UXを犠牲にしたとしてもサイドバーのことはあまり考えたくないはずです。**

## 追加：サイドバーのステートを維持する --- preserving-sidebar-state

これを解決する方法としてサイドバーのステートを維持することが考えられます。"Dashboard"ページから"Engineering"のページに遷移する際、サイドバーを再レンダリングせず、元の状態（"Teams"サブメニューが開いた状態）を維持してくれれば良いのです。

そうすれば"Engineering"ページのERBで、サイドバーの開閉状態ロジックを用意しなくてもよくなります。ただし現在選択されたリンクを示す灰色のバックグラウンドだけは対応しなければなりません。

1. サイドバーのステートを維持する方法はTurboの用意されています
   1. [`data-turbo-permanent`](https://turbo.hotwired.dev/handbook/building#persisting-elements-across-page-loads)を使用します
   2. これは通常のページ遷移と[Morphingを使った場合](https://turbo.hotwired.dev/handbook/page_refreshes.html#exclude-sections-from-morphing)の２通りありますが、Morphingはページリフレッシュの時だけに使用しますので、今回は該当しません
   3. こうすれば"Dashboard"から"Engineering"のページに遷移しても、サイドバーは以前のままになります
2. 選択されたリンクを灰色にする処理
   1. 従来のRailsの方法であれば"Dashboard"か"Engineering"のページかを判定した上でERB（やview helper）にロジックを用意します
   2. 今回はそれが使えませんので、Stimulusでリンクを灰色にします
   3. サーバ通信は発生しませんので、Turboを使用しません。Stimulusだけを使用します
   4. アクションはリンクをクリックするの１つだけで、表示の変更も背景を灰色にするだけです
   5. これならStimulus用のステートを別個に管理する必要はなく、ariaかCSSのいずれかのHTML属性で管理すれば十分です
   6. `aria-current`というものが今回の用途にぴったりですので、ステートはCSSではなくaria属性でStimulusのステートを持たせます（この方がデザイン変更に強くなります）

## コード --- code

説明は長くなりましたが、コードは比較的シンプルです。以下に解説します。

### Viewのメインページ --- main-view

```erb:app/content/pages/examples/sidebar.html.md
<div class="flex">
  <%= render 'sidebar' %>
  <div class="flex-grow">
    <%= image_tag "component_images/demo-dashboard", class: "w-full" %>
  </div>
</div>
```

```erb:app/views/components/sidebar_other_page.html.erb
<div class="flex">
  <%= render 'sidebar' %>
  <div class="flex-grow">
    <%= image_tag "component_images/demo-engineering-team", class: "w-full" %>
  </div>
</div>
```

* 画面が２つあります。ただし内容は画像なので、非常にシンプルです。
* サイドバーは`sidebar`パーシャルで表示しています。全く同じものを表示していることが確認できると思います。

### `sidebar`パーシャル

```erb:app/views/components/_sidebar.html.erb
<div data-turbo-permanent id="sidebar" data-controller="sidebar">
  <div class="h-full w-40 flex shrink-0 flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            <li>
              <!-- Current: "bg-gray-50", Default: "hover:bg-gray-50" -->
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
                  <!-- Expanded: "rotate-90 text-gray-500", Collapsed: "text-gray-400" -->
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

* サイドバーの部分になります
* 一番上部で `data-turbo-permanent id="sidebar"`を設定しています。上述した通り、これによってサイドバーのHTML要素は固定されて、Turbo Driveで新しいページを読み込んでも、新しいHTMLで上書きされません。なお`id`が必須になります
* 同じところに`data-controller="sidebar"`があります。これで`sidebar` Stimulus controllerに接続されます
* サイドバーに対するアクションのメインはリンクのクリックです
   * 各リンクは普通の`a`タグですので、Turbo Driveによるページ遷移をします
   * これに加えて`data: { action: "click->sidebar#setCurrent" }`があります。`sidebar` Stimulus controllerの`setCurrent()`メソッドが呼ばれます
   * 各リンクが選択されているかどうかのステートを保持するため（またアクセシビリティのため）、リックには`aria: {current: "page|false"}`をつけています
* もう一つのアクションは"Teams"のボタンをクリックするとその下のサブメニューが開くところです
   * `button`タグのとこに`data-action="click->sidebar#toggle"`をつけます。`sidebar` Stimulus controllerの`toggle()`メソッドが呼び出されます
   * またサブメニューの開閉状態のステートは`aria-expanded`に持ちますので、`aria-expanded="false"`をつけています

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

* SidebarのStimulus Controllerです
* このControllerは２つのActionを受け取ります
  * `toggle(event)`はサブメニュー開閉ボタンをトグルするものです。表示を変更するターゲットとなるHTML要素は自分自身（`data-action`を持ったHTML要素自身）ですので、`event.currentTarget`で取得できます。通常使っているStimulus targets（`static targets`で指定するもの）は不要となっています。またこのHTML要素の`aria-expanded`を適宜設定しています
  * `setCurrent(event)`は選択されたリンクの背景を灰色にするものです。先に`this.#resetAriaCurrent()`で今まで選択されていたものをクリアしたのち、`data-action`を受けたHTML要素（`event.currentTarget`で取得）で`aria-current="page"`を設定しています

## まとめ --- summary

* ステートを維持するサイドバーをTurboとStimulusで作成しました
* Turboでのステート維持は`data-turbo-permanent`で可能です
* どのページでどのリンクを選択状態（背景が灰色）にするかや、どのサブメニューを開閉するかのロジックが不要になりますので、ページ数が増えてもメンテナンスが楽です
* またサイドバーの状態はStimulusだけで更新されて、サーバのレスポンスを待ちませんので、レスポンスがもたつきません。楽観的UI (Optimistic UI)の一つです。
* 現在の実装の欠点は、"Engineering"のページで画面をリロードした時、メニューの選択状態やサブメニューの開閉状態が正しくないことです。これについては通常のRails + ERBと同じように、サーバ側でレンダリングするときにロジックを持たせる必要があります

![interactive-flow-hotwire.webp](content_images/interactive-flow-hotwire.webp)

* なお今回は`a`タグをクリックしたと同時にTurbo Driveが自動的に動いていますが、同時にTurboに繋がらない
独立のStimulusも使っています。したがって２番目の<span class="text-green-600">緑</span>の経路と、３番目の<span class="text-blue-600">青</span>の経路を使った感じになっています


HotwireのTurboでもブラウザのステートを柔軟に扱わなければならないケースがあります。１つはTurbo FramesやTurbo Streamsを使い、ステートを変更したくない箇所を迂回する方法です。もう一つは今回のように`data-turbo-permanent`を使って、**ステートを変更しない「島」**を設定する方法です。また今回は該当しませんでしたが、Morphingを使うこともできます。個々のケースで最良のものを選択します。
