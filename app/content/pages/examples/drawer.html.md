---
title: 引き出し
layout: article
order: 80
published: true
descriptors:
  component_names:
    - Drawer
  server_request: true
  state_management:
    - Stimulus values
    - コンポーネント間でstateを共有する
  technologies:
    - Stimulus
    - Turbo
    - Zustand
  demo_urls:
    - ["Stimulus Values版", "/hotels/970654821?variant=stimulus_values"]
    - ["Zustand版", "/hotels/970654821?variant=zustand"]
  related_pages:
    - /concepts/stimulus-tips.html.md
---

引き出し(drawer)はよく使われるUIです。ページ遷移をせずに詳細を表示するのに使います。モーダルと同様、裏の画面のステートを維持したい場合に使用します。

今回の特徴として、引き出しのステートだけでなく、離れたところにある開閉トリガーボタンとのステートの共有方法を考えます。Reactの場合は[コンポーネント間で state を共有する](https://ja.react.dev/learn/sharing-state-between-components)問題として紹介されているものです。

![drawer.mov](content_images/drawer.mov "mx-auto mt-8")

##考えるポイント --- points-to-consider

* サーバとの非同期通信
  * 引き出しの中身を表示するのに使用する。Turboを使用します。
* 引き出しの開閉の切り替え
  * Stimulusで行います。
  * 引き出しの開閉状態だけでなく、開閉トリガーボタンの選択状態も同期させます。
* 引き出し開閉状態のステート
  * Stimulus版ではStimulusのValuesを使用します。引き出しと開閉トリガーボタンでステートを共有するために、各要素を内包するだけの広い範囲をカバーするStimulus controllerを使用します。
  * Zustand版でもStimulusのValuesを使用します。ただし引き出しと開閉トリガーボタンを別controllerで管理するため、Stimulus Controller間でstateを共有する必要があります。そのために別途Zustandのstateと同期させます。

![StimlusとZustandの組み合わせ](content_images/stimulus-zustand.webp "mx-auto mt-8")

なお今回のデモではアクセシビリティ等の考慮はあまり行っていません。

## コード（Stimulus版） --- code-stimlus-values

### レイアウト --- layout

```erb:app/views/layouts/hotel_base.html+stimlus_values.erb
<!DOCTYPE html>
<html>
<!-- ... -->
<body>
<div data-controller="slide-drawer"
     data-slide-drawer-shown-value="false"
     class="group/slide-drawer"
>
  <div class="w-full min-w-[768px]">
    <nav class="flex h-16">
      <!-- ... -->
    </nav>
    <div><%= content_for(:breadcrumbs) %></div>
    <%= yield %>
  </div>

  <div id="slide-drawer">
    <div class="peer transition-all duration-500 ease-out fixed h-full w-[768px] z-20 bg-white top-0 right-0 overflow-auto
                aria-hidden:translate-x-[768px]"
         aria-hidden="true"
         data-slide-drawer-target="drawer">
      <%= button_tag type: :button,
                     data: { action: "click->slide-drawer#hide" },
                     class: "absolute top-2 right-2 h-14 w-14 p-1 bg-gray-500 text-white hover:bg-gray-400 active:bg-gray-600" do %>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
        </svg>
      <% end %>
      <%= turbo_frame_tag :slide_drawer %>
    </div>
    <div class="transition-all duration-500 fixed h-full w-full z-19 bg-black opacity-50 top-0 left-0
                peer-aria-hidden:opacity-0
                peer-aria-hidden:invisible "
         aria-hidden="true"
         data-slide-drawer-target="backdrop"
         data-action="click->slide-drawer#hide:prevent">
    </div>
  </div>
</div>
</body>
</html>
```

* 一番上の`<div data-controller="slide-drawer" ...>`の箇所で`SlideDrawerController` Stimulus controllerと接続しています。初期状態では引き出しは閉じていますので、`data-slide-drawer-shown-value="false"`として初期状態を設定しています。ここを"true"にすれば初期状態を開いた状態にできます。
* `<%= yeild %>`の箇所はタブボタンがある画面(メイン画面)が挿入されます(下記)。
* `<div id="slide-drawer">`は引き出しのコードです。ここに記載しているのは引き出しの「枠」であり、引き出しの中身は`turbo-frame_tag id="slide_drawer">`の挿入されます
* `button_tag`は「閉じる」ボタンで、`data-action="click->slide-drawer#hide"`により、クリックすると`SlideDrawerController`の`hide()`メソッドを呼びます。
* 最後の`<div ... data-action="click->slide-drawer#hide:prevent">`の箇所は引き出しの背景の黒い幕です。ここをクリックしたときに引き出しを閉じる必要がありますので、`SlideDrawerController`の`hide()`メソッドを呼ぶようにしています
* 引き出しおよびや背景の黒い幕の表示・非表示は`aria-hidden`属性をCSS擬似セレクタで監視して実現しています（初期設定は`aria-hidden="true"`）

### タブボタンがある画面 --- page-with-tab-buttons

```erb:app/views/hotels/show+stimulus_values.html.erb
<div data-controller="carousel" class="relative">
  <!-- ... -->
</div>
<div role="tablist"
     class="flex flex-row shadow-md border">
  <%= link_to "部屋・プラン", "",
              data: { slide_drawer_target: "tab" },
              aria: { selected: true },
      class: "px-4 inline-block py-4 h-16 text-lg aria-selected:border-b-4 aria-selected:border-blue-500" %>
  <%= link_to "宿の紹介", hotel_features_path(@hotel),
              data: { action: "click->slide-drawer#show",
                      slide_drawer_target: "tab",
                      aria: { selected: false },
                      turbo_frame: :slide_drawer },
              class: "px-4 inline-block py-4 h-16 text-lg aria-selected:border-b-4 aria-selected:border-blue-500" %>
  <!-- ... -->
  <%= link_to "---", "",
              data: { slide_drawer_target: "tab" },
              aria: { selected: false },
              class: "px-4 inline-block py-4 h-16 text-lg aria-selected:border-b-4 aria-selected:border-blue-500" %>
</div>

<main class="mt-8 container mx-auto">
  <!-- ... -->
</main>
```

* タブボタンがある画面です（一番最初に表示される画面）
* `data-action="click->slide-drawer#show"`をクリックすると`SlideDrawerController`の`show()`メソッドが呼ばれ、引き出しが表示されます。
* 同時に引き出しのコンテンツをサーバにリクエストする必要があります。`<a>`タグに`data-turbo-frame="slide_drawer"`属性をつけていますので、クリックすると自動的にTurbo Framesでリクエストが送信され、`<turbo-frame id="slide_drawer">`にレスポンスが挿入されます
* タブボタンは`aria-selected`属性(ERBでは`aria: { selected: true/false }`と記載)も変更する必要があります（アクセシビリティの要件）。そのため`data-slide-drawer-target="tab"`として、`SlideDrawerController`からtargetとして制御できるようにしなければなりません
* タブボタンが選択されているときは下に青い線を引いていますが、これは`aria-selected`をCSS擬似セレクタで監視することによって実装しています

### 引き出しの中身 --- drawer-contents

```erb:app/views/hotels/features/index.html.erb
<%= turbo_frame_tag :slide_drawer do %>
  <section class="max-w-[768px] ">
    <header class="h-16 py-1 px-4 flex justify-between items-center">
      <h2 class="text-3xl font-bold">宿の紹介</h2>
    </header>
    <div class="px-4">
      <nav class="mt-8 h-16 bg-gray-100 flex justify-between items-center">
        <%= link_to "トピックス", hotel_features_path(@hotel), class: "text-center py-5 flex-1 h-full block px-4 border-blue-500 border-b-4" %>
        <%= link_to "お部屋", room_hotel_features_path(@hotel), class: "text-center py-5 flex-1 h-full block px-4" %>
        <!-- ... -->
      </nav>
      <!-- ... -->
    </div>
  </section>
<% end %>
```

* 引き出しの中のコードです
* `<turbo-frame id="slide_drawer">`に囲まれていますので、これが上記のTurbo Framesに挿入されます
* 「トピックス」「お部屋」へのリンクがありますが、これは`<turbo-frame id="slide_drawer">`に囲まれていますので、デフォルトではここのTurbo Frameの中だけを置換します（つまりページ全体をナビゲーションするのではなく、Turbo Frameの中だけをナビゲーションします）

### Stimulus Controller --- stimulus-controller

```js:app/javascript/controllers/slide_drawer_controller.js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="slide-drawer"
export default class extends Controller {
  static values = {
    shown: {type: Boolean, default: false},
    selectedTab: {type: Number, default: 0},
  };
  static targets = ["drawer", "tab"]

  connect() {
  }

  show(event) {
    this.shownValue = true
    this.selectedTabValue = this.tabTargets.indexOf(event.currentTarget)
  }

  hide() {
    this.shownValue = false
    this.selectedTabValue = 0
  }

  shownValueChanged() {
    this.#render()
  }

  #render() {
    if (this.shownValue) {
      document.body.style.overflow = "hidden"
      this.drawerTarget.ariaHidden = false
    } else {
      document.body.style.overflow = "auto"
      this.drawerTarget.ariaHidden = true
    }
    this.tabTargets.forEach((target, i) => {
      target.ariaSelected = (i === this.selectedTabValue)
    })
  }
}
```

* 引き出しを制御するStimulus Controllerです
* Stimulus Valuesステートを定義しています。`shown`は引き出しの開閉状態、`selectedTab`は何番目のタブボタンが選択されているかを保管しています
* `targets`を定義しています。引き出しの"drawer"とタブボタンの"tab"を指定しています
   * 画面表示を切り替えるだけであれば、CSS擬似セレクタを使ってStimulus Valuesステートを監視すれば十分です（`data-slide-drawer-shown-value`）
   * しかし`aria-*`属性を変更するには、JavaScriptでDOMを書き換える必要があります。このために`targets`を使用しています
* `show()`, `hide()`はタブボタンや「閉じる」ボタン、背景の黒い幕をクリックしたときに引き出しを開閉するアクションです。アクションの中ではValuesステートだけを変更して、ここではDOM操作を行いません
* `showValueChanged()`は、Valuesステートが変更された時に自動的に呼ばれるコールバックです。ここでは`#render()`メソッドを呼び出します。
* `#render()`でValuesステートに応じて、実際にDOMを変更します。眼にみえる表示状態はCSS擬似セレクタですでに制御されていますので、ここでは`aria-*`属性のみを変更すれば十分です。

## まとめ(Stimulus版) --- summary-stimulus

* TurboとStimulusを組み合わせて引き出しUIを実装しました。
* 複数のアクション、表示変更箇所、`aria-*`属性設定箇所があるため、気をつけないとコードは複雑になりがちです。
* [Stimulus Controllerの構造](/concepts/stimulus-typical-structure)にしたがい、データのフローを型にはめています。そのため、処理の流れがわかりやすくなっています。
* 表示の変更については、多くの場合、CSS擬似セレクタだけで対応できます。ただしアクセシビリティのために`aria-*`属性を変更する場合は、Stimulusの`target`を使って、JavaScriptでDOM操作をすることになります。

## コンポーネント間のstate共有 --- sharing-state-between-components

* Reactでは、画面の離れた箇所でstateを共有する場合は、[コンポーネント間で state を共有する](https://ja.react.dev/learn/sharing-state-between-components)ことを考えなければなりません。一般にはコンポーネント階層上の共通の祖先にstateを持たせることになります。
    * 共通の祖先が離れてしまっている場合は、prop drilling (propsバケツリレー)をするか、`useContext()`もしくはグローバルステートを使用することになります。
* 一方でStimulus Controllerには親子関係の概念がありません。階層に従って整理するのではなく、ジョーカー的に任意の箇所に`data-*-controller`を貼り付けてcontrollerをDOMにくっつけます。
    * 親子関係がありませんので、親子コンポーネントや姉妹コンポーネントを用意することはしません。
        * ステートを１つのStimulus controllerに持たせ、影響されるものを全てそのcontrollerに直接制御させます(targetなどで)。多くの場合、これが一番強力でシンプルです。
    * 分割してController間で通信したい場合は下記の多種の方法があります。
      * [Stimulus Values](https://stimulus.hotwired.dev/reference/values)はHTML要素のdata属性なので、他のStimulus controllerが付属しているHTML要素の`HTMLElement.dataset`を読み書きすればステートを共有できます。
      * [Custom Event](https://stimulus.hotwired.dev/reference/controllers#cross-controller-coordination-with-events)を使うと、controller間でイベントおよびその`detail`をやり取りできます。
      * [Stimulus Outlets](https://stimulus.hotwired.dev/reference/outlets)を使うと、他のStimulus controllerの属性やメソッドに全てアクセスできます。複数の小さいcontrollerに分割したい時などは便利です。
      * [Zustand](https://zustand-demo.pmnd.rs/)などのグローバルステートを使うと、複数の小さいcontrollerに分割しつつステートを共有し、pub/subで密結合を避けることができます。
