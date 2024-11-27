---
title: ドロップダウン
layout: article
order: 30
published: true
---

ここで作るのは次のようなUIです。

![dropdown.mov](content_images/dropdown.mov "mx-auto max-w-[500px]")

[デモはこちら](/components/dropdown_menu)に用意しています。

## 考えるポイント --- points-to-consider

![interactive-flow-hotwire.webp](content_images/interactive-flow-hotwire.webp "mx-auto max-w-[500px]")

1. サーバから非同期でデータをもらう必要はありません
   1. したがってStimulusだけで実装できます
   2. ネイティブでの実装（チェックボックスを使う）も可能ですが、今回は使いません
2. 次はStimulus Controllerの制御範囲を考えます
   1. UI要素は大きく、ボタン（顔のアイコン）と表示されるメニューがあります
   2. 表示されるメニューからマウスが離れるとメニューが消えますが、これも制御対象になります
   3. したがって顔のアイコンとメニュー自身の双方を囲むStimulus Controllerを用意します
3. ステートを変更するActionはマウスのホバー状態のだけで単純です。またまたメニューの表示・非表示の際に`aria-expanded`を変更するべきです。このようなシンプルなケースでは、[Stimulusの`Values`ステート](https://stimulus.hotwired.dev/reference/values)を使わずに、`aria-expanded`だけで十分に管理できそうです。

## コード --- code

### View --- view

```erb:app/views/components/dropdown_menu.html.erb
<% set_breadcrumbs [["DropDown", component_path(:dropdown)]] %>

<%= render 'template',
           title: "DropDown",
           description: "" do %>

  <div class="mx-auto w-48">
    <!-- Profile dropdown -->
    <div class="relative ml-3 w-8"
         data-controller="dropdown"
         data-action="mouseleave->dropdown#hide">
      <button type="button" class="peer relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-target="switch"
              data-action="mouseenter->dropdown#show"
              aria-haspopup="true">
        <span class="absolute -inset-1.5"></span>
        <span class="sr-only">Open user menu</span>
        <%= image_tag("content_images/avatar.webp", class: "h-8 w-8 rounded-full") %>
      </button>

      <!--
        Dropdown menu, show/hide based on menu state.

        Entering: "transition ease-out duration-200"
          From: "transform opacity-0 scale-95"
          To: "transform opacity-100 scale-100"
        Leaving: "transition ease-in duration-75"
          From: "transform opacity-100 scale-100"
          To: "transform opacity-0 scale-95"
      -->
      <div id="user-menu"
           class="absolute left-0 z-10 w-48 origin-top-right rounded-md bg-white
           py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all
           transform opacity-0 collapse scale-95 ease-in duration-75
           peer-aria-[expanded=true]:opacity-100 peer-aria-[expanded=true]:scale-100
           peer-aria-[expanded=true]:visible peer-aria-[expanded=true]:ease-out
           peer-aria-[expanded=true]:duration-200"
           role="menu"
           aria-orientation="vertical"
           aria-labelledby="user-menu-button"
           tabindex="-1">
        <!-- Active: "bg-gray-100", Not Active: "" -->
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300" role="menuitem" tabindex="-1" id="user-menu-item-0">Your
          Profile</a>
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</a>
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign
          out</a>
      </div>
    </div>
  </div>
<% end %>
```

* `data-controller="dropdown"`でStimulus Controllerと繋げています。ボタン（顔の写真があるところ）とメニューを囲むようにStimulus Controllerを繋げます
* Actionは`data-action="mouseenter->dropdown#show"`と`data-action="mouseleave->dropdown#hide"`のところです。`mouseenter`と`mouseleave`イベントに反応してStimulus controllerの`show()`と`hide()`を呼び出しています
* 今回は`aria-expanded="false"`のところをステートとします。これが`"false"`になったり`"true"`になっているのをCSS擬似セレクタが読み取って、メニューを表示・非表示にします
* `peer-aria-[expanded=true]:`となっているところでTailwind CSSが`aria-expanded=`のステートを監視します。これに応じてメニューの表示・非表示を切り替えます

### Stimulus controller --- stimulus

```js:app/javascript/controllers/dropdown_controller.js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="dropdown"
export default class DropdownController extends Controller {
  static targets = ["switch"]

  connect() {
  }

  show(event) {
    this.switchTargets.forEach((target) => target.ariaExpanded = "true")
  }

  hide(event) {
    this.switchTargets.forEach((target) => target.ariaExpanded = "false")
  }
}
```

* DropDownのStimulus Controllerです
* `static targets = ["switch"]`はtargetを指定しています。`switch`はボタン（顔のアイコンがあるもの）に指定してあります
* `show()`, `hide()`のイベントでtargetの`ariaExpanded`の値を切り替えています

## まとめ --- summary

* ドロップダウンメニューをStimulusで作るにあたって以下のことを検討しました
  * Stimulus controllerの制御範囲（どこをカバーするべきか）
  * ステートをどのように持つか（今回は`aria-expanded`属性で十分と判断しました）
