---
title: トースト
layout: article
order: 005
published: true
---

ここで作るのは下記のようなUIです。

**トーストの画像**

[デモはこちら](/components/accordion)に用意しています。

## 考えるポイント --- thinking-points

トーストは`<form>`リクエストの送信後に表示して、成功したことをユーザに伝えるのが主な目的です。他にも任意に通知を表示するときも使用できますが、今回は`<form>`送信のユースケースのみを想定します。

1. `<form>`リクエストへの応答ですので、非同期でサーバとの通信をしたことが前提です
2. トーストはユーザによって消します。この際はサーバとの通信は不要です。Stimulusで行います
   1. CSS transitionがあるため、Tailwindのクラスが複雑になります。Stimulus controllerの中でHTML属性にCSSクラスを当てるよりも、controllerにValue属性を持たせて、CSSがこれを参照するようにした方がわかりやすいでしょう

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
           data-global-notification-target="toast"
           data-global-notification-shown-value="false"
           class="transform transition
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
* 
* 上記のpartialは`application.html.erb`に挿入され、全ての画面で表示されるようにします
* `data-controller="global-notification"`により、Stimulusの`GlobalNotificationController`に接続します
* `data-global-notification-shown-value="false"`はControllerが制御するValuesステートです
* `data-global-notification-target="toast"`はStimulus Controllerのコールバックを起動するために使っています（次の項目に解説しています）
* トーストを表示する時は下記のようにします
   * **Turbo Driveを使う場合:**<br>
       Turbo Driveを使う場合、`<form>`によるPOST送信は必ずPOST/redirect/GETのパターンに沿っている必要があります(Hotwireではこれが前提になっています)。一般にRails controllerの最後に`redirect_to "...", notice: "[トーストに表示する内容]"`と記載したり、あるいは`flash.notice = [トーストに表示する内容]`と記載するかと思いますが、上記のコードの`if notice.present?`の`notice`はこの`[トーストに表示する内容]`が格納されています。こうしてトーストの内容を含むHTMLがブラウザに送られます
   * **Turbo Streamsを使う場合:**<br>
       Turbo Streamsを使う場合もこのトーストpartialに相当する部分をTurbo Streamに載せてブラウザに送ります。ただしTurbo Streamsの場合はPOST/redirect/GETのパターンを使わずに、POSTでいきなりHTMLをブラウザに返します。したがってRails controllerの方では`flash.notice`ではなく、`flash.now.notice`で`notice`に`[トーストに表示する内容]`を格納しておく必要があります
   * いずれの場合もStimulusは`data-global-notification-target="toast"`を持ったtargetが追加されたことを検知し、トーストをアニメーション付きで表示します
   * なおTurbo Framesの場合は画面の一箇所しかできません。したがってTurbo Framesでトーストを表示するのはかなり難しくなります。Turbo DriveもしくはTurbo Streamsを使います

### GlobalNotificationControler Stimulus Controller --- stimulus-controller

```js
import {Controller} from "@hotwired/stimulus"
import {classTokenize} from "../utilities/utilities";

// Connects to data-controller="global-notification"
export default class extends Controller {
  static values = { shown: {type: Boolean, default: true} }
  static targets = ["toast"]

  connect() {
  }

  close() {
    this.shownValue = false
    // The CSS transition has a duration of 100ms, so we remove the DOM element
    // after allowing the transition to finish.
    setInterval(() => this.element.remove(), 200)
  }

  /*
  * The @starting-style CSS @rule allows you to set starting values on transitions
  * when an element is first added to the DOM. https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style#description
  *
  * However, since this is still an experimental feature as of Nov. 2024, we use a
  * JavaScript workaround.
  * */
  toastTargetConnected(element) {
    // We wait 10 ms to allow the DOM to render with the Toast in the hidden state and then
    // show the Toast.
    setTimeout(() => {
      this.shownValue = true
    }, 10)
  }
}
```

* CSSのtransitionを使ったアニメーションの場合、最初の表示状態を指定する必要があります。新たに要素を追加する場合は初期状態がありませんので、[`@starting-style`ルール](https://developer.mozilla.org/ja/docs/Web/CSS/@starting-style)を使って指定します。しかしこの機能はまだ実験的(2024年11月時点でFirefoxが未対応です)です。そこでここではStimulus ControllerのJavaScriptによる迂回策を実施します
   * `data-global-notification-target="toast"`を指定して、Stimulusのtargetを設定します。こうすることによって、新たにtargetが追加されるとcallbackの`toastTargetConnected()`が自動的に呼ばれます
   * `toastTargetConnected()`が呼ばれたら、10ms後にValuesステートを変更して`data-global-notification-shown-value="true"`にします。こうするとtransitionアニメーションとともにトーストが表示されます
   * なお`@starting-style`ルールが使える環境だったり、アニメーションが不要な要件だったりした場合は、この対策は不要になります。Targetを設定する必要もありません。最初から`data-global-notification-shown-value="true"`にしておけばトーストが表示されます
* トーストは`close()`で消せます。CSSで非表示にするだけでなく、完全にDOM要素を取り除いた方が良いでしょう 
* なお、`toastTargetConnected()`を使わずに、今回は`connected()`を使っても良いと思います。まずは`target`の接続の監視ができることを覚えていただければと思います


## まとめ --- summary

* Hotwireでトーストを表示する方法を紹介しました。Turbo Driveを使っているか、それともTurbo Streamsを使っているかによって、通知内容をブラウザに送る方法が異なることを紹介しました（POST/redirect/GETパターンを使用するか否かによって変わります）
* `@starting-style`ルールを使わずにトーストのアニメーションを表示する方法を紹介しました
* トーストを使ったUIはそれなりに多いのですが、細かい動作の違いがいろいろあります。この辺りの仕様次第で、やらなければならないことが追加になったりします
    * 過去のトーストと最新のトーストを並べて表示するか？
    * 自動的に消えるようにするか？
    * 画面遷移をしたときにも、移動先の画面で表示させるべきか？

個人的にはトーストの内容は「通知」ほど重要ではなく、通常は無視しても差し支えない情報だと感じています。大事なものは別に通知のページが別途にあるべきです。

したがってあまり複雑に作り込む必要はなく、実際のウェブアプリを触っていても無い方が良いのではないかとすら思うことが個人的には多いです。あったとしてもすぐに自動的に消えるようにした方がよく、これのためにコードが複雑になるのは避けたいと思っています。いずれにしてもHotwireで実装することは特に複雑なことでは無いのですが、どこまでやるかはよく考えたら良いかと思います。
