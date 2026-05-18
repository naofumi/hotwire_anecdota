---
title: トースト
layout: article
order: 90
published: true
descriptors:
  component_names:
    - Toast
    - Notification
    - Alert
    - Message
  server_request: true
  state_management:
    - サーバのflash (session)
  technologies:
    - Stimulus
    - Turbo Drive (MPA) 
    - Turbo Streams
  demo_urls:
    - ["トーストデモ", "/todos"]
  related_pages:
    - /concepts/stimulus-tips.html.md
---

トーストは一時的な通知を表示するUIです。特に表示されてから
例えば`<form>`リクエストの送信後に表示して、成功したことをユーザに伝えるのに使います。

ここで作るのは下記のようなUIです。（「更新」ボタンを押した後にトーストが表示されます）

![toast.mov](content_images/toast.mov "mx-auto max-w-[500px]")

## 考えるポイント --- thinking-points

* サーバとの非同期通信
  * 今回は`<form>`リクエストの成功・失敗に対する応答として考えるため、サーバとの非同期通信を行います。 
* トースト表示・非表示のステート
  * トーストのHTML要素の存在自体をステートとします。
      * トーストを表示するときはサーバからトーストのHTMLを受け取り、ブラウザDOMに挿入します。
      * トーストを非表示にする時はブラウザDOMからトーストのHTMLを削除します。
  * しかしアニメーションの都合上で、一旦（アニメーション付きで）非表示にしてから、DOMから削除します。アニメーション制御のためだけに一時的にステートを持たせます。ステートはStimulusのValuesを使用します。
* サーバからトーストのHTMLを受け取る方法にはこだわりません。
   * 画面全体を更新しても良い場合は、TurboDrive (MPA)でトーストのHTMLを挿入します。
   * 画面を部分的に更新したい場合はTurbo StreamsでトーストのHTMLを挿入します。

## コード --- code

### トースト通知エリア --- notification-area

```erb:app/views/application/_global_notification.html.erb
<!-- Global notification live region, render this permanently at the end of the document -->
<div id="global-notification" aria-live="assertive" class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
  <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
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
                  pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5"
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
* `data-controller="global-notification"`により、Stimulusの`GlobalNotificationController`に接続します。これはあくまでもアニメーションの都合で、アニメーションを使用しない場合は不要です（後述）。
* `data-global-notification-shown-value="true"`はControllerが制御するValuesステートで、トーストの表示状態を指定しています。トーストがあるならば（`notice.present?`が`true`）、初期状態では表示されます
* トーストを表示する時は下記のようにします
   * **Turbo Drive (MPA)を使う場合:**<br>
       Turbo Driveを使う場合、`<form>`によるPOST送信は必ず[POST/redirect/GETのパターン](/concepts/post-redirect-get)に沿っている必要があります(Hotwireではこれが前提になっています)。一般にRails controllerの最後に`redirect_to "...", notice: "[トーストに表示する内容]"`と記載したり、あるいは`flash.notice = [トーストに表示する内容]`と記載するかと思いますが、ここではその`flash`をそのまま参照します。上記のコードの`if notice.present?`の`notice`はこの`flash`内の`[トーストに表示する内容]`が格納されています。こうしてトーストの内容を含むHTMLがブラウザDOMに挿入されます。
   * **Turbo Streamsを使う場合:**<br>
       Turbo Streamsを使う場合もこのトーストpartialに相当する部分をTurbo Streamに載せてブラウザに送ります。ただし[Turbo Streamsの場合はPOST/redirect/GETのパターンを使わずに、POSTでいきなりHTMLをブラウザに返します](/concepts/post-redirect-get)。したがってRails controllerの方では`flash.notice`ではなく、`flash.now.notice`で`notice`に`[トーストに表示する内容]`を格納しておく必要があります。[^flash]
   * まとめると、Turbo DriveでもTurbo StreamsでもRailsの[`#notice`](https://api.rubyonrails.org/v7.2.2/classes/ActionDispatch/Flash/FlashHash.html#method-i-notice)を使いますが、Turbo Driveでは`flash.notice`を使って設定します。一方、Turbo Streamsでは`flash.now.notice`を使用します。
     * POST/redirect/GETのパターンなら`flash.notice`
     * POSTからすぐにHTMLを返すパターンなら`flash.now.notice`
   * なおTurbo Framesの場合は画面の一箇所しか画面更新できません。今回は通知エリアをlayoutの`application.html.erb`で表示しているため、Turbo Framesで通知エリアまでカバーしてトーストを表示するのは難しくなります。Turbo DriveもしくはTurbo Streamsを使った方が良いでしょう。

[^flash]: Railsの`flash`は通常の`flash`だけのものと、[`flash.now`](https://api.rubyonrails.org/classes/ActionDispatch/Flash/FlashHash.html#method-i-now)の両方があります。`flash`はredirect直後のリクエストに表示されるもの、`flash.now`は現在のリクエストで表示されるものです。[POST/Redirect/GET](https://en.wikipedia.org/wiki/Post/Redirect/Get)を使用している場合(TurboDrive, TurboFrames)は`flash`を使用し、一方`TurboStreams`でデータ更新する場合は`flash.now`使うことが多いでしょう。

### GlobalNotificationController --- stimulus-controller

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

