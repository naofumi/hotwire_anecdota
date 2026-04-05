---
title: モーダルの表示・非表示制御
layout: article
order: 006
published: true
show_siblings: true
descriptors:
  parent: /examples/modal
---

親ページの[モーダル](/examples/modal)の「モーダルの表示・非表示制御」の箇所について解説します。

## 考えるポイント --- points-to-consider

モーダルの表示・非表示制御では以下の点を考慮する必要があります。

![modal-dialog-show.png](content_images/modal-dialog-show.png "max-w-full")

* **今回はモーダルの内容をサーバから非同期通信で取得します**。
   * モーダルは画面の一部分だけを覆いますので、Turbo Drive, Turbo Frames, Turbo Streamsのうち、部分置換ができるTurbo FramesかTurbo Streamsから選択します。
   * モーダルそのものは一つの「枠」になっています。Turbo FramesとTurbo Streamsのどっちを選択するべきかですが、複数箇所を更新する必要がありませんので、ここではTurbo Framesを選択します
* Turboはネットワーク通信です。したがって**ネットワーク遅延を想定する必要があります**
   * ネットワーク待ちであることをユーザに伝えるために、ボタンをクリックした瞬間にモーダルを開き、「ロード中」の画面を表示します。
   * すぐに画面が反応してモーダルを表示する必要がありますのでStimulusを使用します。サーバレスポンスを待っていると数百ms待たされる可能性が高いので、ユーザはモッサリしたUI/UXだと感じてしまいます。
   * モーダル表示アニメーションも用意します（今回は下から浮いてくる感じにしました）
* モーダルのインタラクションは意外と複雑ですので、Stimulus Valuesステートを使います。[^stimulus_state]
* モーダルを表示させるボタンと実際のモーダルの間の通信は**Stimulus controller間通信機能**を使います
   * モーダル自身を制御するModalDialogController、およびモーダルを遠隔的に制御するModalDialogTriggerControllerの２つを用意します
   * Outlet機能を使い、controller間通信をします 
*  完璧なアクセシビリティは目指しませんが、ESCキーによってモーダルを閉じたり、[`inert`を使って裏の画像を制御できないようにする](https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/inert)などの工夫は実施します

[^stimulus_state]: StimulusではしばしばDOMにステートを持たせますが、この方法はスパゲッティコードを生む危険性があり、複雑な場合はお勧めしません。複雑な場合は[Stimulus values](https://stimulus.hotwired.dev/reference/values)でステートを持たせて、[Mediator pattern](https://refactoring.guru/ja/design-patterns/mediator)のように集中管理させるべきです。 


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
* モーダルのHTMLはここの直下に配置します（`modal_dialog` partialとして）
* またページのメインコンテンツは`<div id="page">`内に配置します。これはモーダルが表示された時に背面になり、黒い幕で隠される部分です。

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
  -->
  <div class="fixed inset-0 bg-gray-500/75 transition-all
              opacity-0 ease-in duration-200
              group-data-[modal-dialog-shown-value=true]:opacity-100
              group-data-[modal-dialog-shown-value=true]:ease-out
              group-data-[modal-dialog-shown-value=true]:duration-300"
       aria-hidden="true"></div>

  <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
         data-action="mouseup->modal-dialog#hide:self">
      <!--
        Modal panel, show/hide based on modal state.
      -->
      <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl
                  sm:my-8 sm:w-full sm:max-w-sm sm:p-6 transition-all
                  opacity-0 translate-y-4 sm:translate-y-80 sm:scale-95 ease-in duration-200
                  group-data-[modal-dialog-shown-value=true]:opacity-100
                  group-data-[modal-dialog-shown-value=true]:translate-y-0
                  group-data-[modal-dialog-shown-value=true]:scale-100
                  group-data-[modal-dialog-shown-value=true]:ease-out
                  group-data-[modal-dialog-shown-value=true]:duration-200"
      >
        <!--
          Modal contents
        -->
        <turbo-frame id="modal-dialog__frame"
                     data-modal-dialog-target="clearable"
                     class="peer aria-busy:hidden">
        </turbo-frame>
        <!--
          Loading indicator
        -->
        <div class="hidden peer-aria-busy:absolute
                           peer-aria-busy:block
                           peer-aria-busy:inset-0
                           peer-aria-busy:bg-contain
                           peer-aria-busy:bg-no-repeat
                           peer-aria-busy:bg-center
                           peer-aria-busy:bg-[url('/Rolling@1x-1.4s-200px-200px.svg')]">

        </div>
      </div>
    </div>
  </div>
</div>
```

* 実際のモーダルを表示するpartialです
    * コードが長くなってしまっているのはアニメーション用のTailwind CSSのためです。中身はcontrollerを接続するシンプルなコードです
* モーダル全体には`id="modal-dialog"`をつけます
    * 今回は`ModalDialogTriggerController` ⇨ `ModalDialogController`のcontroller間通信をします。この際`ModalDialogController`は`querySelector`で指定するため、`id`をつけています。
* `data-controller="modal-dialog"`属性で、モーダルのHTMLを`ModalDialogController`Stimulus controllerに繋げます
* モーダルに`modal-dialog-shown-value`属性を持たせます。これがStimulus controllerのステートになります
    * CSSでは`group-data-[modal-dialog-shown-value=true]`を使って、この属性に応じたCSSを出し分けています。`modal-dialog-shown-value="true"`ならモーダルが表示され、`"false"`なら非表示になります
* モーダルの枠の中に`<turbo-frame id="modal-dialog__frame">`タグを持たせています。サーバから読み込まれた内容はここに挿入されます
    * `<turbo-frame>`にロードするデータをサーバにリクエストしている間、[Turboは自動的に`aria-busy`を`<turbo-frame>`タグに追加してくれます](https://turbo.hotwired.dev/reference/attributes#automatically-added-attributes)
      * `aria-busy`をCSS擬似セレクタで読みとり、ローディング中は`<turbo-frame>`そのものを非表示しています。前回表示したモーダルの内容が残っていて、これを表示させたくないためです。 
      * TailwindCSSの[`peer`](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state)を使って、`<turbo-frame>`の下にある`<div class="...peer-aria-busy:...">`属性の表示・非表示をコントロールしています。これはローディングアニメーションを表示する箇所です。
* モーダルの背景の黒い幕をクリックするとモーダルが閉じられるようにします
   * `data-action="click->modal-dialog#hide:self"`の属性を持つHTML要素は画面全体を覆っている`<div>`です。これをクリックすると後述する`ModalDialogController`の`hide()`メソッドが呼ばれて、モーダルが非表示になります
   * actionの最後に`:self`がついていますので、直接このHTML属性をクリックしない限り`hide()`は実行されません。つまりモーダルの中をクリックした場合は`hide()`は実行されません。
  
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
  * `data-controller-modal-dialog-trigger`で、この`<a>`タグを`ModalDialogTriggerController`に接続しています
     * `ModalDialogTriggerController`は`ModalDialogController`にメッセージを中継するだけのControllerです。クリックされたことをリレーします
     * `data-modal-dialog-trigger-modal-dialog-outlet="#modal-dialog"`のところは、接続先のStimulus Controllerを選択するCSSセレクタです。今回は`id="modal-dialog"`のHTML要素に接続しているStimulus Controller (`ModalDialogController`)が接続されます
  * `data-action="click->modal-dialog#show"`を設定し、クリックすると`ModalDialogTriggerController`の`show()`メソッドが実行されるようにしています。中継されたメッセージは上記Outletで指定した`ModalDialogController`の`show()`メソッドに到達し、モーダルダイアログが表示されます
* `<a>`タグですので、Turboのデフォルトアクションとしてリンク先にリクエストを投げます。そして`turbo_frame: "modal-dialog__frame"`の属性が指定されていますので、レスポンスのコンテンツから`<turbo-frame id="modal-dialog__frame">`の中身が抜かれ、DOMの中にある`<turbo-frame id="modal-dialog__frame">`に埋め込まれます（つまりモーダルダイアログの中に表示されます）。

### リンクのクリックイベントをリレーするModalDialogTriggerController --- code-modal-dialog-trigger-controller

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

* これはTodoリストのリンクがクリックされたとき、そのイベントを`ModalDialogController`にリレーして、モーダルを表示してもらうためのStimulus Controllerです
* 中継用のStimulus controllerが必要なのはモーダルダイアログがページの`root`近くに配置されていて、（Todoリストの中の）モーダルを開くボタンとはDOM的に距離が遠いためです。一つのStimulus Controllerで制御しようと思うとTodoリストを覆い、かつモーダルダイアログも覆わなければなりませんが、これだと制御範囲が大きくなりすぎて、コードがわかりにくくなることを懸念しています。そのための分割です
* リレー先の`ModalDialogController`は`static outlets = [ "modal-dialog" ]`で宣言しています
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

  hideOnSuccess(event) {
    if (!event.detail.success) return

    this.hide(event)
  }

  shownValueChanged() {
    if (this.shownValue) {
      this.#makePageUnresponsive()
    } else {
      this.#restorePageResponsiveness()
    }
  }

  #makePageUnresponsive() {
    this.pageElement.inert = true
  }

  #restorePageResponsiveness() {
    setTimeout(() => this.pageElement.inert = false, 100)
  }
}
```

* `static values =`でValues ステートを宣言しています
    * `data-modal-dialog-shown-value`は、ダイアログボックスの表示・非表示を指定するステートです。CSSはこれを読み取り、モーダルダイアログの表示・非表示を自動的に切り替えてくれます
    * `data-modal-dialog-page-value`は、モーダルによって隠蔽される背景画面を指定するCSSセレクタです。この要素に`inert`属性を指定することで、モーダルが開いた時に操作を受け付けなくします。なお、この要素は`ModalDialogController`の制御よりも外側にあるため、`target`で指定できません。そのためにCSSセレクタで指定しています
      * 一般論として、モーダルを表示しているときは背景画面が操作できないようにする必要があります。黒い幕(`div`を)被せるとマウスクリックはブロックできますが、キーボードショートカット（エンター、タブなど）やスクロールは背景画面に届いてしまいます。完全にブロックするのが`inert`属性です。なおモーダルを隠すときはすぐに`inert`を解除せずに、少しだけ時間を空けています。そうしないとエンターキーで`<input>`タグが選択されてしまうようなので、これを防ぐためです。
* `show()`, `hide()`はStimulus Actionで、ともに`data-modal-dialog-shown-value`ステートをセットしているだけです。この値はHTML要素の属性となりますので、CSS擬似セレクタが監視しています。そしてモーダルダイアログの表示・非表示が制御されます
* `shownValueChanged()`は、`data-modal-dialog-shown-value`ステートが変更された時に自動的に呼び出されるコールバックです。CSSだけで制御できないものについてはここで処理します。
     * 背景画面（`this.pageElement`）に`inert`属性をつけたり外したりして、背景画面が操作できないようにします
* `void()`のStimulus Actionは何もしません。上述の黒い幕をクリックした時の動作で使用しました。
