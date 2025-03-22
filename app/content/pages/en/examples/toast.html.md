---
title: トースト
layout: article
order: 90
published: true
---

トーストは`<form>`リクエストの送信後に表示して、成功したことをユーザに伝えるのが主な目的です。

ここで作るのは下記のようなUIです。

![toast.mov](content_images/toast.mov "mx-auto max-w-[500px]")

[デモはこちら](/todos)に用意しています。

## 考えるポイント --- thinking-points

1. `<form>`送信後のレスポンスとして、Turbo DriveもしくはTurbo Streamsにより、トーストのHTMLがDOMに挿入されるものとします
   1. 挿入時にアニメーションとともにトーストが表示されるようにしますが、これはCSSだけで十分です
2. トーストには「閉じる」ボタンがあります。これはサーバを通信しませんので、Stimulusでの実装になります
3. Stimulusを使う時はまず最初にステートを考えます
   1. トーストを閉じたら、もう表示することはありません。そのため、DOMからトーストのHTMLを丸ごと削除できます。したがって本来であれば、敢えてステートを持つ必要はありません
   2. しかしアニメーションの都合上で、一旦（アニメーション付きで）非表示にしてから、DOMから削除します。アニメーション制御のためだけに一時的にステートを持たせます

## コード --- code

### トースト通知エリア --- notification-area

```erb:app/views/application/_global_notification.html.erb
<!-- Global notification live region, render this permanently at the end of the document -->
<div id="global-notification" aria-live="assertive" class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
  <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
    <!--
      Notification panel, dynamically insert this into the live region when it needs to be displayed

      Entering: "transform ease-out duration-300 transition"
        From: "translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        To: "translate-y-0 opacity-100 sm:translate-x-0"
      Leaving: "transition ease-in duration-100"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <% if notice.present? %>
      <div data-controller="global-notification"
           data-global-notification-shown-value="true"
           class="global-notification transition-all
                  data-[global-notification-shown-value=false]:ease-in
                  data-[global-notification-shown-value=false]:duration-100
                  data-[global-notification-shown-value=false]:opacity-0
                  data-[global-notification-shown-value=false]:translate-y-2
                  data-[global-notification-shown-value=false]:sm:translate-y-0
                  data-[global-notification-shown-value=false]:sm:translate-x-2
                  ease-out duration-300 translate-y-0 opacity-100 sm:translate-x-0
                  pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900"><%= notice %></p>
            </div>
            <div class="ml-4 flex flex-shrink-0">
              <button type="button"
                      class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      data-action="click->global-notification#close"
              >
                <span class="sr-only">Close</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    <% end %>
  </div>
</div>
```
 
* 上記のpartialは`application.html.erb`に挿入され、全ての画面で表示されるようにします
* `data-controller="global-notification"`により、Stimulusの`GlobalNotificationController`に接続します
* `data-global-notification-shown-value="true"`はControllerが制御するValuesステートで、トーストの表示状態を指定しています。トーストがあるならば（`notice.present?`が`true`）、初期状態では表示されます
* トーストを表示する時は下記のようにします
   * **Turbo Driveを使う場合:**<br>
       Turbo Driveを使う場合、`<form>`によるPOST送信は必ずPOST/redirect/GETのパターンに沿っている必要があります(Hotwireではこれが前提になっています)。一般にRails controllerの最後に`redirect_to "...", notice: "[トーストに表示する内容]"`と記載したり、あるいは`flash.notice = [トーストに表示する内容]`と記載するかと思いますが、上記のコードの`if notice.present?`の`notice`はこの`[トーストに表示する内容]`が格納されています。こうしてトーストの内容を含むHTMLがブラウザに送られます
   * **Turbo Streamsを使う場合:**<br>
       Turbo Streamsを使う場合もこのトーストpartialに相当する部分をTurbo Streamに載せてブラウザに送ります。ただしTurbo Streamsの場合はPOST/redirect/GETのパターンを使わずに、POSTでいきなりHTMLをブラウザに返します。したがってRails controllerの方では`flash.notice`ではなく、`flash.now.notice`で`notice`に`[トーストに表示する内容]`を格納しておく必要があります
   * まとめると、Turbo DriveでもTurbo StreamsでもRailsの[`#notice`](https://api.rubyonrails.org/v7.2.2/classes/ActionDispatch/Flash/FlashHash.html#method-i-notice)を使いますが、Turbo Driveでは`flash.notice`を使って設定します。一方、Turbo Streamsでは`flash.now.notice`を使用します。これでPOST/redirect/GETのパターンとPOSTからすぐにHTMLを返すパターンの双方に対応します
   * なおTurbo Framesの場合は画面の一箇所しか画面更新ができません。したがってTurbo Framesでトーストを表示するのはかなり難しくなります。Turbo DriveもしくはTurbo Streamsを使った方が良いでしょう

### GlobalNotificationControler Stimulus Controller --- stimulus-controller

```js:app/javascript/controllers/global_notification_controller.js
import {Controller} from "@hotwired/stimulus"
import {classTokenize} from "../utilities/utilities";

// Connects to data-controller="global-notification"
export default class extends Controller {
  static values = { shown: {type: Boolean, default: true} }

  connect() {
  }

  close() {
    this.shownValue = false
    // The CSS transition has a duration of 100ms, so we remove the DOM element
    // after allowing the transition to finish.
    setInterval(() => this.element.remove(), 200)
  }
}
```

* トーストは`close()`で一旦アニメーション付きで非表示にして、その後にDOMから削除します
   * CSSで非表示にするだけでなく、完全にDOM要素を取り除く処理も行います（`this.element.remove()`）

### アニメーション --- animations

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
    /* ... */
    
    .global-notification {
        @starting-style {
            opacity: 0 !important;
            transform: translateY(8px);
            @media (min-width: 640px) {
                transform: translateY(0px);
                transform: translateX(8px);
            }
        }
    }
    
    /* ... */
}
```

* Stimulusはなるべくならば[HTMLをあまり書き換えたくない](/tips/why-avoid-rendering-html-in-stimulus)ため、画面表示の変化はなるべくCSSで実現します
* `@starting-style`は2024年11月時点ではFirefoxがまだサポートしていませんが、無かったとしてもトーストが登場する時のアニメーションがないだけですので、許容範囲と考えました。ここにあるように`@starting-style`でアニメーションを処理させる選択肢を採用しました

## まとめ --- summary

* Hotwireでトーストを表示する方法を紹介しました
  * Turbo Driveを使うか、それともTurbo Streamsを使うかによって、通知内容をブラウザに送る方法が異なることを紹介しました
    * Turbo Driveは[POST/redirect/GETパターン](/concepts/post-redirect-get)を使用しますので、リダイレクト後の画面描画に反映させます
    * Turbo StreamsはPOSTだけでダイレクトにレスポンスを返しますので、同じリクエストの画面描画に反映させます
  * Railsの`flash`と`flash.now`を使用すると、ERBに条件分岐を入れずに、Controller側から上記の２つのケースにうまく対応できることを解説しました
