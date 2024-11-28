---
title: 引き出し
layout: article
order: 80
published: true
---

引き出し(drawer)はよく使われるUIです。ページ遷移をせずに詳細を表示するのに使います。モーダルと似ていますが、モーダルは一般に情報を少しだけ見せ、パッと閉じるものが多いのに対して、引き出しは情報が多く、データ更新ができるものも多いです。

![drawer.mov](content_images/drawer.mov "mx-auto max-w-[500px]")

[デモはこちらにあります](/hotels)。

##考えるポイント --- points-to-consider

1. サーバから非同期でデータを受け取ります
   1. Turboを使用します
2. Turboの前後にStimulusを使用するか
   1. 引き出しの開閉はアニメーションを使いますので、Stimulusで制御します
3. Stimulusの制御範囲
   1. 引き出しを表示させるアクションは、引き出しとは離れた場所にあるタブです
   2. また引き出しを閉じる時、タブの選択状態を変える必要があります。このとき、表示状態だけでなく、`aria-selected`属性も変更する必要がありますので、CSS擬似セレクタだけでは不十分です
   3. タブ↔︎引き出し が双方向に連携する必要がありますので、Stimulusはこの双方を制御範囲とする必要があります
4. Stimulusのステート
   1. 引き出しの開閉および何番目のタブが選択されたがステートになります（今回はタブは１つしか使用しませんが、複数のタブから引き出しを制御する想定でいます
   2. ステートの変更はタブボタンの他、引き出しの閉じるボタンから制御します
   3. ステートによって、タブと引き出しの双方の表示が変わります。さらに引き出しはコンテンツだけでなく、背景も表示させます
   4. ２つのアクションから、２つのステートを制御し、３つの項目の表示が変更されます
   5. 比較的複雑ですので、[StimulusのValuesステート](https://stimulus.hotwired.dev/reference/values)でまとめることにします。表示の変更はなるべくCSS擬似セレクタで制御します

なお、本来であれば[モーダル表示で解説しているポイント](/examples/modal/modal-show-with-animation#points-to-consider)もすべて検討する必要がありますが、今回は省略しています。実装する場合は[モーダルの解説](/examples/modal/modal-show-with-animation#points-to-consider)もご確認ください。

## コード --- code

### レイアウト --- layout

```erb:app/views/layouts/hotel_base.html.erb
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

* レイアウトのERBテンプレートです。引き出しはモーダルと同様、HTMLのbody近くに作ることが一般的ですので、レイアウトの中に作っています。
* `<div data-controller="slide-drawer" ...>`の箇所で`SlideDrawerController` Stimulus controllerと接続しています。初期状態では引き出しは閉じていますので、`data-slide-drawer-shown-value="false"`でStimulusのValuesステートを記述しています
* `<div id="slide-drawer">`の箇所が引き出しのコードです。ここに記載しているのは引き出しの「枠」であり、中身は`<%= turbo_frame_tag :slide_drawer %>`の箇所に入ってきます
* `button_tag`は「閉じる」ボタンで、`data: { action: "click->slide-drawer#hide" }`がアクションになります。クリックすると`SlideDrawerController`の`hide()`メソッドを呼びます。
* 最後の`<div ... data-action="click->slide-drawer#hide:prevent">`の箇所は引き出しの背景の黒い幕です。ここをクリックしたときに引き出しを閉じる必要がありますので、`SlideDrawerController`の`hide()`メソッドを呼ぶようにしています
* 引き出しや背景の黒い幕の表示・非表示は`aria-hidden`属性をCSS擬似セレクタで監視して実現しています

### タブボタンがある画面 --- page-with-tab-buttons

```erb:app/views/hotels/show.html.erb
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
* `data-action="click->slide-drawer#show"`となっているところがタブボタンのActionで、これをクリックすると`SlideDrawerController`の`show()`メソッドが呼ばれ、引き出すが表示されます
* 同時に引き出しのコンテンツをサーバにリクエストする必要があります。今回は`<a>`タグに`data-turbo-frame="slide_drawer"`属性をつけていますので、クリックすると自動的にTurbo Framesでリクエストが送信され、`<turbo-frame id="slide_drawer">`にレスポンスが挿入されます
* このタブボタンはCSS擬似セレクタで表示を変えるだけでなく、`aria-selected`属性も変更する必要があります（アクセシビリティの要件）。そのため`data-slide-drawer-target="tab"`として、`SlideDrawerController`からtargetとして制御できるようにしなければなりません
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
* `#render()`でValuesステートに応じて、実際にDOMを変更します。眼にみえる表示状態はCSS擬似セレクタで十分に制御できますので、ここでは`aria-*`属性のみを変更します

## まとめ --- summary

* 引き出しUIをTurboとStimulusを組み合わせて実装しました
* 複雑には見えないのですが、それでも複数のアクション、表示変更箇所、`aria-*`属性設定箇所があり、気をつけないと複雑になりがちです
* [Stimulus Controllerの構造](/concepts/stimulus-typical-structure)にしたがい、データのフローを型にハメました。そのため、処理の流れがわかりやすくなっています
* 表示の変更だけであればCSS擬似セレクタで対応できます。ただしアクセシビリティのために`aria-*`属性を変更する場合は、Stimulusの`target`を使って、JavaScriptでDOM操作をすることになります
