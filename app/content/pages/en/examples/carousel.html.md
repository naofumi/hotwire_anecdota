---
title: カルーセル
layout: article
order: 70
published: true
---

カルーセルはよく使われるUIウィジェットで広く使われているライブラリも存在します。しかし自作できるのであれば、細かい設定方法に悩む必要もなくなり、却って使いやすくなることも珍しくありません。ここではStimlusで自作したカルーセルを紹介します。

下記のようなUIになります。

![carousel.mov](content_images/carousel.mov)

[デモはこちら](/hotels)からご覧ください。

## 考えるポイント --- points-to-consider

1. サーバから非同期でデータを受け取る必要はありません
   1. Stimulusだけで実装します
2. Stimlusの制御範囲を考えます
   1. ボタン等はすべてカルーセルの枠の中に収まっています。Stimulusの範囲はカルーセルの枠だけで良いでしょう
3. ステートは、現在表示されている画像の番号です
   1. ステートが更新されたら、表示されている画像および"⚫︎"のページネーションのボタンが更新される必要があります。ページネーションボタンについては、現在表示されている番号がハイライトされる必要があります
   2. 画像は３種類の方法で更新されます。１つはタイマーによる自動切り替え、２つ目は左右の矢印ボタンによる前・後への移動、３つ目はページネーションボタンによる任意の画像への移動です
   3. ステート更新は３つのActionによって引き起こされ、さらに２つの画面要素に影響を与えます。この場合は更新処理が複雑になりやすいので、[Values](https://stimulus.hotwired.dev/reference/values)を使ってステートを集中管理をした方が良いです

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

* `data-controller="carousel"`のところでStimulus controllerを繋げています
* イベントをStimulus Controllerに伝えるのは`data-action`を設定している箇所です。`data-action="click->carousel#previous"`（左矢印ボタン）, `data-action= "click->carousel#next"`（右矢印ボタン）, `data-action="click->carousel#move"...`（ページネーションボタン）の箇所です。それぞれ`carousel` controllerの`previous()`, `next()`, `move()`を呼び出します。`move()`のところは`data-carousel-index-param=[index]`がありますので、何番目のボタンがクリックされたかも`move()`メソッドに[伝えています](https://stimulus.hotwired.dev/reference/actions#action-parameters)
* イベントに呼応してControllerが書き換えるのは`target`となっている箇所です。`data-carousel-target="slide"`は画像を指し示すものです。これを使って選択されている画像を表示し、他を非表示にする必要があります。`data-carousel-target="pagination"`のところはページネーションボタンです。現在選択されているものだけをハイライトするために使います
* `slide`の箇所、および`pagination`の箇所は、それぞれ`aria-[hidden=true]` `aria-[selected=true]`の擬似CSSセレクタを使用して、　表示状態を制御します（`aria-*`属性はStimulus controllerから設定します）

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

* carouselのStimulus controllerです。イベントを受け取るアクションの数、表示を変更する箇所の数が多いためにコード量が増えていますが、各メソッドはとても短く、ロジックはシンプルです
* `static targets =`のところは、Controllerで処理した結果を画面に反映するためのtargetの指定です。上述した画像を表示するところ("slide")、およびページネーションをするところ("pagination")がtargetになります
* `static values =`はこのStimulus controllerのステートです
    * `currentSlide`は現在選択されている画像の番号です
    * `autoplay`は自動再生をするかどうかのブール値です
    * `interval`は自動再生する際の時間間隔です
    * なおこれらの値はHTML要素の`data-carousel-*-value`などで外部から指定することもできます。つまりサーバでERBを生成するときに`data-carousel-*-value`を設定すれば、Stimulus controllerの初期値を任意に設定できるわけです。**またStimulus controllerの外から別のJavaScriptなどで変えることもできます。実際開発者用コンソールからこの値を変更すれば、瞬時に反映されます。**
* `connect()`はStimulus controllerが接続されたときに呼び出されるものです。ここでは自動再生をするために`setInterval()`を使っています
* `disconnect()`はStimulus controllerが消える時（例えば接続されているHTML要素が消える時など）に呼び出されます。先ほどの`setInterval()`をclearしています
* `move()`, `next()`, `previous()`はそれぞれイベントハンドラです。HTMLに記載したActionから呼び出されます。それぞれ`currentSlideValue`ステートを更新し、さらに自動再生をオフにする処理をしています。
* `currentSlideValueChanged()`は`currentSlideValue`ステートが変更された時に自動的に呼ばれるコールバックです。ここで`#render()`を呼び、Stimulus controllerが管理するtargetを再描画します。これは[Stimulus Controllerの構造](/concepts/stimulus-typical-structure)で紹介している構造と同じです
* `#renderPaginationTargets()`, `#renderSlideTargets()`は実際にtargetを再描画しているところです。`currentSlideValue`ステートに応じて、`aria-*`属性を指定しています

## まとめ --- summary

* Stimulusを使ってカルーセルを自作しました
* ３つのActionと２つの画面要素の書き換えが必要ですので、Valuesステートを使って集中管理した方がスッキリします。これはReactでも使われている考え方で、[Stimulus Controllerの構造](/concepts/stimulus-typical-structure)で解説しています
* Stimulus Controllerの`#render()`では、ActionによってValuesステートから`aria-*`属性を更新します。そしてCSS擬似セレクタで`aria-*`を画面表示に反映させています
* Valuesは`data-*-values`としてHTML要素の属性になっています。これを変更すれば、リアルタイムでStimulus controllerのステートを変更できますので、バックエンドのERBからカスタマイズしたり、他のライブラリと接続する時に便利です
