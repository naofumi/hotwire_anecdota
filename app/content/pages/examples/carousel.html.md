---
title: カルーセル
layout: article
order: 70
published: true
descriptors:
  component_names:
    - Carousel
    - Slide Show
  server_request: false
  state_management:
    - Stimulus Values
  technologies:
    - Stimulus
  demo_urls:
    - ["カルーセルデモ", "/hotels"]
  related_pages:
    - /concepts/stimulus-tips.html.md
    - /concepts/stimulus-core-concept
    - /concepts/why-avoid-rendering-html-in-stimulus
    - /concepts/stimulus-typical-structure
    - /concepts/jquery-issues
---

カルーセルはよく使われるUIウィジェットで広く使われているライブラリも存在します。最近はCSSでもかなり作れるようになっています。しかしここではStimlusによるステート管理の勉強として、自作したカルーセルを紹介します。

下記のようなUIになります。

![carousel.mov](content_images/carousel.mov)

## 考えるポイント --- points-to-consider

* 現在表示されているページをステートとして保持する必要があります。
* StimulusではDOMにステートを持たせることが一般には第一選択肢になります。
  * しかし今回は状態を変更するコントロールが複数あり、また表示が変わる画面要素も複数あります。単純にDOMにステートを持たせるとスパゲッティコードになる恐れがあります。
  * 対策として、一般的には[Mediator Pattern](https://refactoring.guru/ja/design-patterns/mediator)を使用します。Stimulusの[Values](https://stimulus.hotwired.dev/reference/values)を使ってステートを集中管理します。 

## コード --- code

### カルーセルのview --- carousel-view
```erb:app/views/hotels/show.html.erb
<div data-controller="carousel" class="relative">
  <div class="w-full h-[360px]">
    <% @carousel_images.each_with_index do |filename, i| %>
      <div class="aria-[hidden=true]:invisible aria-[hidden=true]:opacity-0 transition-all duration-1000"
           data-carousel-target="slide"
           aria-hidden="<%= i == 0 ? "true" : "false" %>"
      >
        <%= image_tag "hotel_images/#{filename}", class: "absolute w-full h-[360px] object-cover" %>
      </div>
    <% end %>
  </div>
  <%= button_tag type: "button",
                 class: "absolute w-8 h-8 p-1 rounded-full block top-[170px] left-[10px] bg-white opacity-40 hover:opacity-100",
                 data: { action: "click->carousel#previous" } do %>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
    </svg>
  <% end %>
  <%= button_tag type: "button",
                 class: "absolute w-8 h-8 p-1 rounded-full block top-[170px] right-[10px] bg-white opacity-40 hover:opacity-100",
                 data: { action: "click->carousel#next" } do %>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
    </svg>
  <% end %>
  <div class="inline-block absolute bottom-4 left-[50%] -translate-x-1/2">
    <% 0.upto(@carousel_images.size - 1).each do |index| %>
      <%= button_tag "⚫︎",
                     type: :button,
                     aria: {selected: (index == 0 ? "true" : "false")},
                     class: "aria-[selected=true]:opacity-100 opacity-50 text-white",
                     data: { action: "click->carousel#move",
                             carousel_index_param: index,
                             carousel_target: "pagination"
                     }
      %>
    <% end %>
  </div>
</div>
<!-- ... -->
```

* `CarouselController` (Stimulus)を使って、現在の表示ページをステートとして管理ます。`data-controller="carousel"`の箇所でStimulus controllerを繋げています
* `CarouselController` (Stimulus)にイベントを伝えるのに`data-action`を設定します。`data-action="click->carousel#previous"`（左矢印ボタン）, `data-action= "click->carousel#next"`（右矢印ボタン）, `data-action="click->carousel#move"...`（ページネーションボタン）が該当します。
  * `move()`の箇所は`data-carousel-index-param=[index]`もありますので、何番目のボタンがクリックされたかも`move()`メソッドに[伝えています](https://stimulus.hotwired.dev/reference/actions#action-parameters)
* イベントに応答して`CarouselController`は`target`を書き換えます。
  * `data-carousel-target="slide"`の箇所(スライド画像)は`aria-hidden`の属性を`"true"`, `"false"`に切り替えます。
     * Tailwindの`aria-[hidden=true]`擬似CSSセレクタによって表示状態が変わります。
  * `data-carousel-target="pagination"`の箇所(ページネーションボタン)は`aria-selected`の属性を`"true"`, `"false"`に切り替えます。
      * Tailwindの`aria-[select=true]`擬似CSSセレクタを使って表示状態が変わります。

### `CarouselController` Stimulus Controller --- carousel-controller

```js:app/javascript/controllers/carousel_controller.js
import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="carousel"
export default class extends Controller {
  static targets = ["slide", "pagination"]
  static values = {
    currentSlide: {type: Number, default: 0},
    autoplay: {type: Boolean, default: true},
    interval: {type: Number, default: 4000},
  }
  
  connect() {
    if (this.autoplayValue) {
      this.slideInterval = setInterval(() => {
        this.#moveNext()
      }, this.intervalValue)
    }
  }

  disconnect() {
    this.#clearSlideInterval()
  }

  move(event) {
    this.currentSlideValue = event.params.index
    // 手動でスライドを選択した場合は、自動再生を停止します
    this.#clearSlideInterval()
  }

  next() {
    this.#moveNext()
    // 手動でスライドを選択した場合は、自動再生を停止します
    this.#clearSlideInterval()
  }

  previous() {
    this.#movePrevious();
    // 手動でスライドを選択した場合は、自動再生を停止します
    this.#clearSlideInterval()
  }

  currentSlideValueChanged() {
    this.#render()
  }

  get slideCount() {
    return this.slideTargets.length
  }

  #clearSlideInterval() {
    this.autoPlayValue = false
    if (this.slideInterval) {
      clearInterval(this.slideInterval)
    }
  }

  #render() {
    this.#renderSlideTargets();
    this.#renderPaginationTargets();
  }

  #renderPaginationTargets() {
    this.paginationTargets.forEach((target, index) => {
      if (index === this.currentSlideValue) {
        target.ariaSelected = "true"
      } else {
        target.ariaSelected = "false"
      }
    })
  }

  #renderSlideTargets() {
    this.slideTargets.forEach((target, index) => {
      if (index === this.currentSlideValue) {
        target.ariaHidden = "false"
      } else {
        target.ariaHidden = "true"
      }
    })
  }

  #moveNext() {
    if (this.currentSlideValue + 1 < this.slideCount) {
      this.currentSlideValue = this.currentSlideValue + 1
    } else {
      this.currentSlideValue = 0
    }
  }

  #movePrevious() {
    if (this.currentSlideValue - 1 >= 0) {
      this.currentSlideValue = this.currentSlideValue - 1
    } else {
      this.currentSlideValue = this.slideCount - 1
    }
  }
}
```

* `CarouselController` (Stimulus)です。
* `currentSlideValue`ステートをmediatorとした[mediator patternに即した書き方](/concepts/stimulus-typical-structure)をしています。
  * `move()`, `next()`, `previous()`のイベントハンドラは**主に`currentSlideValue`ステートの変更だけ**を行います（副次的に自動再生をオフにする処理も行います）。
  * `currentSlideValue`ステートが変更されると`currentSlideValueChanged()`が自動的に呼び出されます。これは[Stimulus Valuesのコールバック機能](https://stimulus.hotwired.dev/reference/values#change-callbacks)です。
  * `currentSlideValueChanged()`の中から`#render()`が呼び出され、`#renderPaginationTargets()`, `#renderSlideTargets()`でtargetが再描画されます。(具体的には`aria-*`属性だけを変更し、CSSによる表示変更を起こします)
  * 「ボタンが押される」 => 「ステート(Mediator)が変更される」 => 「再描画」が実行されるという流れになります。
