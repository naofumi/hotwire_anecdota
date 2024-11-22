---
title: モーダルの表示・非表示
layout: article
order: 006
published: true
---

十分な機能を持ったモーダルをHotwireで自作する方法を紹介します。なおモーダルの中に表示する内容はサーバから非同期で取得するものとします。

## 考えるポイント --- points-to-consider

モーダルは簡単に作れると考える人が多くいます。しかし実際にはモーダルの表示・非表示だけでも、かなり多くの機能が必要になります。これがなければ十分な機能を持ったモーダルとはいえず、そもそもモーダルではなく、普通のMPAの機能で十分な可能性がありますので、[UIの選択としてモーダルが間違っている可能性があり、再考が必要です]((/opinions/should_you_use_modals))。

1. **モーダルの内容はサーバから非同期通信で取得します**。何らかの形でTurboを使用します
   1. モーダルは画面の一部分だけを覆いますので、Turbo Drive, Turbo Frames, Turbo Streamsのうち、部分置換ができるTurbo FramesかTurbo Streamsから選択します
   2. モーダルそのものは一つの「枠」になっています。複数箇所を更新する必要がありませんので、Turbo Framesを選択します
2. Turboはネットワーク通信です。したがって**ネットワーク遅延を想定する必要があります**
   1. ネットワーク待ちであることをユーザに伝えるために、ボタンをクリックした瞬間にモーダルを開き、「ロード中」の画面を表示します
   2. サーバレスポンスを待たずに画面表示を変更しますので、Stimulusを使用します
   3. Stimulusを使うとアニメーションも表示しやすくなりますので、モーダル表示アニメーションも用意します
3. Stimulusを使う場合はステートの持ち方も検討します。モーダルのインタラクションは意外と複雑ですので、Stimulus Valuesステートを使うことにします
   1. 表示を切り替える箇所はモーダル「枠」だけでなく、 背景画面を覆う黒い幕も同時に表示させないといけません
   2. モーダルの表示・非表示は複数の箇所から制御します
      1. Todoの行をクリックするとモーダルが表示されます
      2. 背景画面を覆う黒い幕をクリックした時、モーダルを非表示にします
      3. ESCキーのショートカットでモーダルを非表示にします
   3. さらに背景画面は誤って操作できないようにしなければなりません。例えばスクロールされないようにしたり、フォーカスを取得してしまわないようにする必要があります。このためには[HTMLの`inert`属性](https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/inert)を使います
   4. **複数のHTML要素を制御する必要があります**ので、直接CSSクラスを操作すると煩雑になります。Stimulus Valuesを使って整理しやすく保ちます
   5. 加えてStimulus Valuesを使うと、HTMLの`data-*-value`属性を外部から変更してモーダルの開閉状態を制御でき、便利です
4. モーダルはHTML `body`要素の直下ぐらいに配置するの一般的です（一方で黒い幕を使わないポップアップダイアログであれば、モーダルのHTMLはボタンの近くに用意することが多いです）。今回もそのようにします
   1. モーダルを表示するためのActionボタン（例えばTodoを表示している行）と、モーダル自身がDOM上で完全に別々になります
      1. モーダルおよびActionボタン双方を制御するStimulus controllerを作ってしまうと、ページ全体を覆うほどの大きさになってしまいます。絶対に悪いわけではありませんが、コードの関係性がわかりにくくなるのが気がかりです
   2. これを回避するためには**複数間Stimulus controller間通信機能**を使います
      1. モーダル自身を制御するModalDialogController、およびモーダルを遠隔的に制御するModalDialogTriggerControllerの２つを用意します
      2. Outlet機能を使い、controller間通信をします 
5. 完璧なアクセシビリティは目指しませんが、ESCキーによってモーダルを閉じたり、[`inert`を使って裏の画像を制御できないようにする](https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/inert)などの工夫は実施します

## コード --- code

### モーダルを配置する箇所 --- modal-placement

```erb:app/views/layouts/application.html.erb
# ...

<body class="relative">
<div id="page">
  <%= render "nav", show_data_reset: true %>
  <div class="container container-lg mx-auto px-4 pt-8">
    <div><%= content_for(:breadcrumbs) %></div>
    <%= render 'variants_selector' %>

    <%= yield %>
  </div>
</div>
<%= render "modal_dialog" %>
<%= render 'global_notification' %>
</body>
</html>
```

* これはメインのレイアウトページです。一番`<body>`タグに近いところです
* モーダルのHTMLはここに配置します
* またページコンテンツは`<div id="page">`内に配置します。モーダルが表示された時に背面で隠される部分です。

### モーダルの枠 --- modal-frame

```erb:app/views/application/_modal_dialog.html.erb
<div class="group relative z-10 collapse opacity-0 transition-all duration-200
            data-[modal-dialog-shown-value=true]:visible
            data-[modal-dialog-shown-value=true]:duration-300
            data-[modal-dialog-shown-value=true]:opacity-100"
     id="modal-dialog"
     data-controller="modal-dialog"
     data-modal-dialog-page-value="#page"
     data-action="keydown.esc@window->modal-dialog#hide:stop:prevent"
     aria-labelledby="modal-title"
     role="dialog"
     aria-modal="true">
  <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
  <div class="fixed inset-0 bg-gray-500/75 transition-all
              opacity-0 ease-in duration-200
              group-data-[modal-dialog-shown-value=true]:opacity-100
              group-data-[modal-dialog-shown-value=true]:ease-out
              group-data-[modal-dialog-shown-value=true]:duration-300"
       aria-hidden="true"></div>

  <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
         data-action="click->modal-dialog#hide">
      <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
      <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl
                  sm:my-8 sm:w-full sm:max-w-sm sm:p-6 transition-all
                  opacity-0 translate-y-4 sm:translate-y-80 sm:scale-95 ease-in duration-200
                  group-data-[modal-dialog-shown-value=true]:opacity-100
                  group-data-[modal-dialog-shown-value=true]:translate-y-0
                  group-data-[modal-dialog-shown-value=true]:scale-100
                  group-data-[modal-dialog-shown-value=true]:ease-out
                  group-data-[modal-dialog-shown-value=true]:duration-200"
           data-action="click->modal-dialog#void:stop"
      >
        <turbo-frame id="modal-dialog__frame">
        </turbo-frame>
      </div>
    </div>
  </div>
</div>
```

* 実際のモーダルを表示するpartialです
    * アニメーション用のTailwind CSSおよびcontrollerを接続するコードがほとんどです
* モーダル全体には`id="modal-dialog"`をつけます。今回はDOMのルートに近いところにモーダルを配置しました
    * Stimulusでは主に`target`を使ってHTML要素を指定します。しかし今回はStimulus controller間通信を行いますので、controller外のHTML要素もアクセスします。この要素も`ModalDialogTriggerController` Stimulus Controllerからアクセスされます。その時は`target`ではなく、通常のCSSセレクタを使ってHTML要素を指定します。そのための`id`になります
* `data-controller="modal-dialog"`属性で、`ModalDialogController` Stimulus controllerと繋げます
* モーダルに`modal-dialog-shown-value`属性を持たせます。これがStimulus controllerのステートになります
    * CSSでは`group-data-[modal-dialog-shown-value=true]`を使って、この属性に応じたCSSをだし分けています
* モーダルの枠の中に`<turbo-frame id="modal-dialog__frame">`タグを持たせています。サーバから読み込まれた内容はここに挿入されます

## データロード中の進行中表示 --- loading

### モーダル表示のトリガー --- trigger

```erb:app/views/todos/_todo.html.erb
<% highlight = local_assigns.fetch(:highlight, false) %>

<tr class="group p-2" id="<%= dom_id(todo) %>">
  <td class="<%= 'highlight-on-appear' if highlight %> p-2 border-gray-400 border-t group-[:first-child]:border-none">
    <div class="flex">
      <div class="flex grow items-center">
        <%= render 'like_button', todo: %>
        <%= todo.title %>
        <%= link_to edit_todo_path(todo), class: "ml-2",
                    data: {controller: "modal-dialog-trigger",
                           modal_dialog_trigger_modal_dialog_outlet: "#modal-dialog",
                           action: "click->modal-dialog-trigger#show",
                           turbo_frame: "modal-dialog__frame" } do %>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
          </svg>
        <% end %>
      </div>
      <div class="text-xs shrink-0 pr-2"><%= l todo.created_at, format: :short %></div>
      <div class="shrink-0"><%= render 'delete_button', todo: %></div>
    </div>
  </td>
</tr>
```

* `link_to`は`<a>`タグを作成します。これをクリックするとモーダルが表示されるようにしています
* `data: {controller: "modal-dialog-trigger"}`で、この`<a>`タグを`ModalDialogTriggerController`に接続しています
   * これは`ModalDialogController`に接続するControllerです。クリックされたことをリレーします
   * `modal_dialog_trigger_modal_dialog_outlet: "#modal-dialog"`のところは、接続先のStimulus Controllerを選択するCSSセレクタです。この場合は`id="modal-dialog"`のHTML要素が選択されています
* `action: "click->modal-dialog#show"`を設定し、クリックすると`ModalDialogTriggerController`の`show()`メソッドが実行されます。これは最終的にモーダルダイアログを表示させます
* `turbo_frame: "modal-dialog__frame"`の属性が指定されていますので、`<a>`タグのリンク先からレスポンスは`<turbo-frame>`の中に表示されます

### リンクのクリックイベントをリレーするModalDialogTriggerController --- code-modal-dialog-controller

```js:app/javascript/controllers/modal_dialog_trigger_controller.js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="modal-dialog-trigger"
export default class extends Controller {
  static outlets = [ "modal-dialog" ]

  connect() {
  }

  show() {
    this.modalDialogOutlets.forEach(modal => modal.show())
  }

  hide() {
    this.modalDialogOutlets.forEach(modal => modal.hide())
  }
}
```

* これはTodoリストのリンクがクリックされたとき、そのイベントを`ModalDialogController`にリレーして、モーダルを表示してもらうためのStimulus Controllerです（イベントを新たに発火していませんので、JavaScriptイベントをリレーしているわけではありません。メッセージをリレーしていると呼んだ方が良いかもしれませんが、ここでは単に「リレー」という表現を使いました）
* これが必要なのはモーダルダイアログがページの`root`近くに配置されていて、DOM的に距離が遠いためです。一つのStimulus Controllerで制御しようと思うと、Todoリストを覆い、かつモーダルダイアログも覆わなければなりませんが、これだと制御範囲が大きくなりすぎて、コードがわかりにくくなることを懸念しています。そのための分割です
* リレー先の`ModalDialogController`は`static outlets = [ "modal-dialog" ]`で指定しています
* `show()`メソッドでは、`ModalDialogController`の`show()`メソッドを呼び出しているだけです。`hide()`も同様です。

### モーダル表示用のModalDialogController --- code-modal-dialog-controller

```js:app/javascript/controllers/modal_dialog_controller.js
import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="modal-dialog"
export default class extends Controller {
  static values = {
    shown: {type: Boolean, default: false},
    page: String
  }

  connect() {
    this.pageElement = document.querySelector(this.pageValue)
  }

  show(event) {
    this.shownValue = true
  }

  hide(event) {
    this.shownValue = false
  }

  shownValueChanged() {
    this.element.dataset.dialogShown = this.shownValue
    if (this.shownValue) {
      this.pageElement.inert = true
    } else {
      setTimeout(() => this.pageElement.inert = false, 100)
    }
  }

  hideOnSuccess(event) {
    if (!event.detail.success) {
      return
    }

    this.hide(event)
  }

  // Used to prevent browser default behavior on specific elements.
  void(event) {
  }
}
```

* モーダルを表示・非表示にするActionは`show()`, `hide()`です
* `static values =`でValues ステートを宣言しています
    * `data-modal-dialog-shown-value`は、ダイアログボックスの表示・非表示を指定するステートです
    * `data-modal-dialog-page-value`は、モーダルによって隠蔽される背景画面を指定するCSSセレクタです。この要素の`inert`属性を指定することで、モーダルが開いた時に操作を受け付けなくします。なお、この要素は`ModalDialogController`の制御よりも外側にあるため、`target`ではなく、CSSセレクタで指定するようにしています
      * モーダルを表示しているときは背景画面が操作できないようにします。黒い幕のDIV被せるとマウスクリックはブロックできますが、キーボードショートカット（エンター、タブなど）やスクロールは背景画面に届きます。これらを完全にブロックするのが`inert`属性です。なおモーダルを隠すときはすぐに`intert`を解除せずに、少しだけ時間を空けています。そうしないとエンターキーで`<input>`タグが選択せれてしまうようなので、これを防ぐためです。
* `show()`, `hide()`ともに`data-modal-dialog-shown-value`ステートをセットしています。この値はHTML要素の属性となりますので、CSSレセクタで読まれます。そしてモーダルダイアログの表示・非表示が制御されます
* `shownValueChanged()`は、`data-modal-dialog-shown-value`ステートが変更された時に自動的に呼び出されるコールバックです。この中で背景画面に`inert`属性をつけたり外したりして、背景画面が操作できないようにしています

## ポイント --- points-to-note

* 今回のモーダルダイアログはHTMLのルートの近くに配置しています。一方でモーダルダイアログを開くためのリンクはTodo一覧の中にあります
   * この全体を１つのStimulus controllerで制御するとなると、結局ページ全体を覆うStimulus controllerを作ることになります。しかしそうなると対応関係がわかりにくいだけでなく、１つのページにいくつものモーダルが存在するケースに対応しにくくなります
   * そこで今回はトリガーのStimulus controllerからモーダルを指定する方法として、Stimulusの`target`を使用せず、直接IDを指定するようにしています
   * 上記はモーダルを表示する`show()`の時の話です。一方でモーダルを閉じるときの`hide()`は、モーダルダイアログの内部要素がトリガーになります。例えば背景のクリックであるとか、閉じるボタンだったりとかです
   * そこで同じModalDialogControllerクラスを a) モーダルダイアログそのものを制御するため、b) モーダルを表示するトリガーを制御するための双方に使っています。`show()`用のStimulus controllerと`hide()`用のStimulus controllerを用意しても良いのですが、それでは却ってわかりにくいと考えたためです
* [比較的新しいHTML属性の`inert`を使っています](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/inert)。これはアクセシビリティ上の重要な機能を提供していますが、`inert`以前は実現が難しいものでした。そして多くのウェブサイトでは正しく実装されていませんでした。モーダルは簡単に考えてはいけないよという実例です

なおReactの場合は[`createPortal()`](https://ja.react.dev/reference/react-dom/createPortal)を使って、上記の問題に対応します。似たような機能はStimulusにはありませんが、Stimulusの場合は完全に独立したControllerであってもHTML属性を外部から変更するだけでステートを制御できますので、十分に対処可能です。

## まとめ --- summary

* クオリティの高いUI/UXを実現するためには、ある程度アニメーションを用意する必要があります
* このためにはTurboだけではなく、その前後でStimulus controllerによる制御をつけることができます
* Reactと比べて、Stimulusはcontrollerを外部から制御しやすいようにできています。今回はHTML属性を外部から直接変更することで制御しています。こうすることで、controllerの制御範囲を小さく保ち、管理のしやすさを保っています
