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
    - /concepts/stimulus-core-concept
    - /concepts/why-avoid-rendering-html-in-stimulus
    - /concepts/stimulus-typical-structure
    - /concepts/jquery-issues
---

引き出し(drawer)はよく使われるUIです。ページ遷移をせずに詳細を表示するのに使います。モーダルと同様、裏の画面のステートを維持したい場合に使用します。

今回の特徴として、引き出しのステートだけでなく、離れたところにある開閉トリガーボタンとのステートの共有方法を考えます。Reactの場合は[コンポーネント間で state を共有する](https://ja.react.dev/learn/sharing-state-between-components)問題として紹介されているものです。

![drawer.mov](content_images/drawer.mov "mx-auto mt-8")

##考えるポイント --- points-to-consider

* サーバとの非同期通信
  * 引き出しの中身を表示するのに使用する。Turboを使用します。
* 引き出しの開閉の切り替え
  * Stimulusで行います。
  * 引き出しの開閉状態だけでなく、開閉トリガーボタンの選択状態も同期させます。つまり**画面の離れた２箇所（引き出しと開閉ボタン）を同期させる必要があります**。
* 引き出し開閉状態のステート（下図）
  * Stimulus版ではStimulusのValuesを使用します。引き出しと開閉トリガーボタンでステートを共有するために、各要素を内包するだけの**広い範囲をカバーするStimulus controller**を使用します。
  * Zustand版でもStimulusのValuesを使用します。ただし引き出しと開閉トリガーボタンを別controllerで管理するため、**２つのStimulus Controller間でstateを共有する必要があります**。そのために別途Zustandのstateと同期させます。

![StimlusとZustandの組み合わせ](content_images/stimulus-zustand.webp "mx-auto mt-8")

なお今回のデモではアクセシビリティ等の考慮はあまり行っていません。

## コード（Stimulus版） --- code-stimlus-values

### レイアウト（Stimulus版） --- layout

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
         data-action="click->slide-drawer#hide:prevent">
    </div>
  </div>
</div>
</body>
</html>
```

* 一番上の`<div data-controller="slide-drawer" ...>`の箇所で`SlideDrawerController` Stimulus controllerと接続しています。初期状態では引き出しは閉じていますので、`data-slide-drawer-shown-value="false"`としています。ここを"true"にすれば初期状態を開いた状態にできます。
* `<%= yeild %>`の箇所はタブボタン（開閉トリガーのボタン）がある画面(メイン画面)が挿入されます(下記)。
* `<div id="slide-drawer">`は引き出しのコードです。ここに記載しているのは引き出しの「枠」であり、引き出しの中身はサーバから取得され、`<turbo-frame_tag id="slide_drawer">`に挿入されます。
* `button_tag`は「閉じる」ボタンで、`data-action="click->slide-drawer#hide"`により、クリックすると`SlideDrawerController`の`hide()`メソッドを呼びます。
* 最後の`<div ... data-action="click->slide-drawer#hide:prevent">`の箇所は引き出しの背景の黒い幕です。ここをクリックしたときに引き出しを閉じる必要がありますので、`SlideDrawerController`の`hide()`メソッドを呼ぶようにしています
* 引き出しおよびや背景の黒い幕の表示・非表示は`aria-hidden`属性をCSS擬似セレクタで監視して実現しています（初期設定は`aria-hidden="true"`）

### タブボタンがある画面（Stimulus版） --- page-with-tab-buttons

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

### 引き出しの中身（Stimulus版） --- drawer-contents

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

### Stimulus Controller（Stimulus版） --- stimulus-controller

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
* `showValueChanged()`は、[Valuesステートが変更された時に自動的に呼ばれるコールバック](https://stimulus.hotwired.dev/reference/values#change-callbacks)です。ここでは`#render()`メソッドを呼び出します。
* `#render()`でValuesステートに応じて、実際にDOMを変更します。眼にみえる表示状態はCSS擬似セレクタですでに制御されていますので、ここでは`aria-*`属性のみを変更すれば十分です。

## まとめ(Stimulus版) --- summary-stimulus

* TurboとStimulusを組み合わせて引き出しUIを実装しました。
* 複数のアクション、表示変更箇所、`aria-*`属性設定箇所があるため、気をつけないとコードは複雑になりがちです。
* [Stimulus Controllerの構造](/concepts/stimulus-typical-structure)にしたがい、データのフローを型にはめています。そのため、処理の流れがわかりやすくなっています。
* 表示の変更については、多くの場合、CSS擬似セレクタだけで対応できます。ただしアクセシビリティのために`aria-*`属性を変更する場合は、Stimulusの`target`を使って、JavaScriptでDOM操作をすることになります。








## コード(Zustand版) --- code-zustand

### レイアウト(Zustand版) --- zustand-layout

```erb:app/views/layouts/hotel_base.html+zustand.erb
<!DOCTYPE html>
<html>
<!-- ... -->
<body>
<div class="w-full min-w-[768px]">
    <nav class="flex h-16">
      <!-- ... -->
    </nav>
    <div><%= content_for(:breadcrumbs) %></div>
    <%= yield %>
  </div>

<div data-controller="slide-drawer-zustand" data-slide-drawer-zustand-shown-value="false">
    <div class="peer transition-all duration-500 ease-out fixed h-full w-[768px] z-20 bg-white top-0 right-0 overflow-auto
                aria-hidden:translate-x-[768px]"
         aria-hidden="true"
         data-slide-drawer-zustand-target="drawer">
      <%= button_tag type: :button,
                     data: { action: "click->slide-drawer-zustand#hide" },
                     class: "absolute top-2 right-2 h-14 w-14 p-1 bg-gray-500 text-white hover:bg-gray-400 active:bg-gray-600 cursor-pointer" do %>
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
         data-action="click->slide-drawer-zustand#hide:prevent">
    </div>
  </div>
</body>
</html>
```

* Stimulus版とほとんど同じです。接続先のStimulus controllerが`SlideDrawerController`ではなく、`SlideDrawerZustandController`だという点だけが異なります。

### タブボタンがある画面(Zustand版) --- zustand-page-with-tab-buttons

```erb
:app/views/hotels/show.html+zustand.erb
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
                data: { controller: "slide-drawer-trigger",
                        action: "click->slide-drawer-trigger#show",
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

* Stimulus版とほとんど同じです。接続先のStimulus controllerが`SlideDrawerController`ではなく、`SlideDrawerTriggerController`だという点だけが異なります。
* Stimlus版では`SlideDrawerController`が１つだけあったのが、`SlideDrawerZustandController`と`SlideDrawerTriggerController`の２つになったのが違いです。

### 引き出しの中身（Zustand版） --- zustand-contents

* 全く同じものなので割愛します。

### Zustand Store (Zustand版) --- zustand-store

```ts:app/javascript/stores/slide_drawer_store.ts
import { createStore } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";

type SlideDrawerState = {
  drawers: {
    [key: string]: { opened: boolean }
  }
  opened: (key: string) => boolean
  open: (key: string) => void
  close: (key: string) => void
};

export const slideDrawerStore = createStore<SlideDrawerState>()(
  subscribeWithSelector(
    (set, get) => ({
      drawers: {},
      opened: (key) => get().drawers[key]?.opened ?? false,
      open: (key) => set(s => ({ drawers: { ...s.drawers, [key]: { opened: true } } })),
      close: (key) => set(s => ({ drawers: { ...s.drawers, [key]: { opened: false } } })),
    }),
  )
);
```

* グローバルステートを管理するZustandのstoreです。

### Stimulus Controllers（Zustand版） --- zustand-stimulus-controllers

```js:app/javascript/controllers/slide_drawer_zustand_controller.js
import { Controller } from "@hotwired/stimulus"
import { slideDrawerStore } from "../stores/slide_drawer_store"

// Connects to data-controller="slide-drawer"
export default class extends Controller {
  static values = {
    shown: {type: Boolean, default: false},
    selectedTab: {type: Number, default: 0},
  }
  static targets = ["drawer"]

  connect() {
    this.storeKey = "hotel-slide-drawer"
    this.#setState()
    this.#render()

    this.unsubscribe = slideDrawerStore.subscribe(
      (s) => ({ drawerState: s.drawers[this.storeKey] }),
      (state) => {
        this.#render()
      }
    )
  }

  disconnect() {
    this.unsubscribe && this.unsubscribe()
  }

  show(event) {
    slideDrawerStore.getState().open(this.storeKey)
  }

  hide() {
    slideDrawerStore.getState().close(this.storeKey)
  }

  #setState() {
    if (this.shownValue === true) {
      slideDrawerStore.getState().open(this.storeKey)
    } else {
      slideDrawerStore.getState().close(this.storeKey)
    }
  }

  #render() {
    if (slideDrawerStore.getState().opened(this.storeKey)) {
      document.body.style.overflow = "hidden"
      this.drawerTarget.ariaHidden = false
    } else {
      document.body.style.overflow = "auto"
      this.drawerTarget.ariaHidden = true
    }
  }
}
```

* 引き出しを制御するStimulus controllerです。
* `connect()`時にZustand storeに接続し、ステートの変更にsubscribeしています。
   * ステートの変更があれば`#render()`を呼び出します。 
* 各イベントハンドラ(action)では、Zustand storeのselectorを使ってステートを更新しています。

```js:app/javascript/controllers/slide_drawer_trigger_controller.js
import { Controller } from "@hotwired/stimulus"
import { slideDrawerStore } from "../stores/slide_drawer_store"

// Connects to data-controller="slide-drawer-trigger"
export default class extends Controller {
  connect() {
    this.storeKey = "hotel-slide-drawer"
    this.unsubscribe = slideDrawerStore.subscribe(
      (s) => ({ drawerState: s.drawers[this.storeKey] }),
      (state) => {
        this.#render()
      }
    )
  }

  disconnect() {
    this.unsubscribe && this.unsubscribe()
  }

  show() {
    slideDrawerStore.getState().open(this.storeKey)
  }

  #render() {
    const isOpened = slideDrawerStore.getState().opened(this.storeKey)
    const allTabs = Array.from(this.element.parentElement.children)
    const openedTab = isOpened ? this.element : allTabs[0]

    allTabs.forEach(e => {
      e.ariaSelected = (e === openedTab) ? 'true' : 'false'
    })
  }
}
```

* トリガーボタンを制御するStimulus controllerです。
* `connect()`時にZustand storeに接続し、ステートの変更にsubscribeしています。
    * ステートの変更があれば`#render()`を呼び出します。
* 各イベントハンドラ(action)では、Zustand storeのselectorを使ってステートを更新しています。

## まとめ(Zustand版) --- summary-zustand

* Turbo、Stimulus、Zustandを組み合わせて引き出しUIを実装しました。
* 上述のStimulus版では、`SlideDrawerController`の制御範囲が大きかったため、`SlideDrawerZustandController`と`SlideDrawerTriggerController`に分けました。
   * 今回程度のStimulus ControllerだとZustandと接続するためのボイラープレートが相対的に多く、負担が大きい印象でした。Controller単体が大きい場合は有効かもしれません。












## 離れたDOM要素間のstate共有 --- sharing-state-between-separated-elements

* Reactでは、画面の離れた箇所でstateを共有する場合は、[コンポーネント間で state を共有する](https://ja.react.dev/learn/sharing-state-between-components)ことを考えなければなりません。一般にはコンポーネントの共通祖先にstateを持たせることになります。
    * 共通の祖先が離れてしまっている場合は、prop drilling (propsバケツリレー)をするか、`useContext()`もしくはグローバルステートを使用することになります。
* 一方で**Stimulus Controllerには親子関係の概念がありません**。階層に従って整理するのではなく、ジョーカー的に任意の箇所に`data-*-controller`を貼り付けてcontrollerをDOMにくっつけます。
    * 親子関係がありませんので、先祖コンポーネントにstateを持たせる発想はありません。
        * １つのStimulus controllerに持たせ、影響されるものを全て直接制御させます。**多くの場合、これが一番強力かつシンプルです**。
    * Controllerを分割して、stateを共有したい場合は多種の方法があります。
      * [Stimulus Values](https://stimulus.hotwired.dev/reference/values)はHTML要素のdata属性なので、他のStimulus controllerが付属しているHTML要素の`HTMLElement.dataset`を読み書きすればステートを共有できます。
      * [Custom Event](https://stimulus.hotwired.dev/reference/controllers#cross-controller-coordination-with-events)を使うと、controller間でイベントおよびその`detail`をやり取りできます。
      * [Stimulus Outlets](https://stimulus.hotwired.dev/reference/outlets)を使うと、他のStimulus controllerの属性やメソッドに全てアクセスできます。複数の小さいcontrollerに分割したい時などは便利です。
      * [Zustand](https://zustand-demo.pmnd.rs/)などのグローバルステートライブラリを使うと、複数の小さいcontrollerに分割しつつステートを共有し、pub/subで密結合を避けることができます。
* Stimulusでは１つのDOM要素に複数の小さいcontrollerを繋げることができますし、DOM階層に関係なく任意の要素にアクセスできます。このため、大きくて凝集度の低いcontrollerは簡単に避けられます。またprop drillingの心配もありません。これはReactとの大きな違いです。**Stimulusでは安心して制御範囲が大きいcontrollerを作っても問題ありません**。一方でControllerを分割するときの選択肢も複数あります。
