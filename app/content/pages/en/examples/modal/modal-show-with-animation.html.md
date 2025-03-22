---
title: モーダルの表示・非表示
layout: article
order: 006
published: true
siblings: true
---

十分な機能を持ったモーダルをHotwireで自作する方法を紹介します。下記のビデオのものになります。
なおモーダルの中に表示する内容はサーバから非同期で取得するものとします。

![modal.mov](content_images/modal.mov "max-w-[500px] mx-auto")
<div class="text-sm font-bold max-w-[500px] mx-auto">
サーバレスポンスに1秒の遅延を入れています
</div>

## 考えるポイント --- points-to-consider

モーダルは簡単に作れると考える人が多くいます。しかし実際にはモーダルの表示・非表示だけでも、かなり多くの機能が必要になります。これがなければ十分な機能を持ったモーダルとはいえず、そもそもモーダルではなく、普通のMPAの機能で十分な可能性がありますので、[UIの選択としてモーダルが間違っている可能性があり、再考が必要です](/opinions/should_you_use_modals)。

本サイトではHotwireを使って本格的なUI/UXを作成するのが目的です。[偶有的な複雑性(accidental complexity)](https://ja.wikipedia.org/wiki/銀の弾などない)はHotwireを使うことで回避できます。しかし本質的な複雑性(essential complexity)とは真剣に向き合うしかありません。そのため、解説はかなりの分量になっていますが、ご容赦ください。

![modal-dialog-show.png](content_images/modal-dialog-show.png "max-w-full")

1. **モーダルの内容はサーバから非同期通信で取得します**。何らかの形でTurboを使用します
   1. モーダルは画面の一部分だけを覆いますので、Turbo Drive, Turbo Frames, Turbo Streamsのうち、部分置換ができるTurbo FramesかTurbo Streamsから選択します
   2. モーダルそのものは一つの「枠」になっています。Turbo FramesとTurbo Streamsのどっちを選択するべきかですが、複数箇所を更新する必要がありませんので、Turbo Framesを選択します
2. Turboはネットワーク通信です。したがって**ネットワーク遅延を想定する必要があります**
   1. ネットワーク待ちであることをユーザに伝えるために、ボタンをクリックした瞬間にモーダルを開き、「ロード中」の画面を表示します
   2. サーバレスポンスを待たずに画面表示を変更してモーダルを表示しますので、Stimulusを使用します
   3. モーダル表示アニメーションも用意します（今回は下から浮いてくる感じにしました）
3. モーダルのインタラクションは意外と複雑ですので、Stimulus Valuesステートを使うことにします
   1. 表示を切り替える箇所はモーダル「枠」だけでなく、 背景画面を覆う黒い幕も同時に表示させないといけません
   2. モーダルの表示・非表示は複数の箇所から制御します
      1. Todoの行をクリックするとモーダルが表示されます
      2. 背景画面を覆う黒い幕をクリックした時、モーダルを非表示にします
      3. ESCキーのショートカットでモーダルを非表示にします
   3. 一覧表の異なる行を選択した際も同じHTML要素を使ってモーダルを表示します。Reactの場合はゼロから再レンダリングしますので勝手に古い内容をクリアしますが、Hotwireの場合は明示的に古いデータをクリアする必要があります
   4. さらに背景画面は誤って操作できないようにしなければなりません。例えばスクロールされないようにしたり、フォーカスを取得してしまわないようにする必要があります。このためには[HTMLの`inert`属性](https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/inert)を使います
   5. **複数のHTML要素を制御する必要があります**ので、直接CSSクラスを操作すると煩雑になります。Stimulus Valuesを使って整理しやすく保ちます
   6. 加えてStimulus Valuesを使うと、HTMLの`data-*-value`属性を外部から変更してモーダルの開閉状態を制御でき、便利です
4. モーダルはHTML `body`要素の直下ぐらいに配置するの一般的です（一方で黒い幕を使わないポップアップダイアログであれば、モーダルのHTMLはボタンの近くに用意することが多いです）。今回もそのようにします
   1. モーダルを表示するためのActionボタン（例えばTodoを表示している行）と、モーダル自身がDOM上で完全に別々になります
      1. モーダルおよびActionボタン双方を制御するStimulus controllerを作ってしまうと、ページ全体を覆うほどの大きさになってしまいます。絶対に悪いわけではありませんが、コードの関係性がわかりにくくなるのが気がかりです
   2. これを回避するためには**複数間Stimulus controller間通信機能**を使います
      1. モーダル自身を制御するModalDialogController、およびモーダルを遠隔的に制御するModalDialogTriggerControllerの２つを用意します
      2. Outlet機能を使い、controller間通信をします 
   3. なお今回のように複数間Stimulus controller間通信機能で対処できた理由の一つは、controller間の通信が限定的だからです。一方で[引き出しUI](/examples/drawer)の場合は、遠隔的に制御するTriggerの表示状態も制御していました。今回の例で言うとModalDialogTriggerController→ModalDialogControllerの通信だけでなく、ModalDialogTriggerController ↔︎ ModalDialogControllerの双方向通信が必要な状況でした。この場合は複数間Stimulus controller間通信機能では煩雑になりますので、１つのStimulus controllerにまとめた方が良いと思われます
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
        <turbo-frame id="modal-dialog__frame"
                     data-modal-dialog-target="clearable"
                     class="peer aria-busy:hidden">
        </turbo-frame>
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
    * 今回は`ModalDialogTriggerController`と`ModalDialogController`の複数controller間通信をします。そしてStimulusでcontroller間通信をする場合、`querySelector()`で使うようなCSSセレクタでHTML要素を指定します。`id`をつけているのはそのためです
* `data-controller="modal-dialog"`属性で、モーダルのHTMLを`ModalDialogController`Stimulus controllerに繋げます
* モーダルに`modal-dialog-shown-value`属性を持たせます。これがStimulus controllerのステートになります
    * CSSでは`group-data-[modal-dialog-shown-value=true]`を使って、この属性に応じたCSSを出し分けています。`modal-dialog-shown-value="true"`ならモーダルが表示され、`"false"`なら非表示になります
* モーダルの枠の中に`<turbo-frame id="modal-dialog__frame">`タグを持たせています。サーバから読み込まれた内容はここに挿入されます
    * `<turbo-frame>`にロードするデータをサーバにリクエストしている間、[Turboは自動的に`aria-busy`を`<turbo-frame>`タグに追加してくれます](https://turbo.hotwired.dev/reference/attributes#automatically-added-attributes)
      * `aria-busy`をCSS擬似セレクタで読みとり、ローディング中は`<turbo-frame>`そのものを非表示しています。前回表示したモーダルの内容が残っていて、これを表示させたく無いためです 
      * TailwindCSSの[`peer`](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state)を使って、`<turbo-frame>`の下にある`<div class="...peer-aria-busy:...">`属性の表示・非表示をコントロールしています。これはローディングアニメーションを表示する箇所です
* モーダルの背景の黒い幕をクリックするとモーダルが閉じられるようにします
   * `data-action="click->modal-dialog#hide"`の属性を持つHTML要素が黒い幕の`<div>`です。これをクリックすると後述する`ModalDialogController`の`hide()`メソッドが呼ばれて、モーダルが非表示になります
   * ただし、モーダルのコンテンツをクリックした場合にモーダルが閉じては困ります。この箇所はクリックを無視する必要があります
      * `data-action="click->modal-dialog#void:stop`の属性を持つHTML用紙がモーダルのコンテンツの枠です
      * ここをクリックすると`ModalDialogController`の`void()`メソッドが呼ばれますが、`void()`メソッド自身は何もしません
      * **注目して欲しいのは先ほどの`click->modal-dialog#void:stop`の`stop`の部分です**。これは`event.stopPropagation()`を呼んでくれます
      * `event.stopPropagation()`が呼ばれますので、クリックイベントはこのレイヤーでブロックされ、後ろの黒い背景に伝播しません。そのため、`ModalDialogController`の`hide()`メソッドが呼ばれることはなく、このクリックは無視されます
  
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
* `turbo_frame: "modal-dialog__frame"`の属性が指定されていますので、`<a>`タグのリンク先からのレスポンスは`<turbo-frame>`の中に表示されます

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
* 中継用のStimulus controllerが必要なのはモーダルダイアログがページの`root`近くに配置されていて、（Todoリストの中の）モーダルを開くボタンとはDOM的に距離が遠いためです。一つのStimulus Controllerで制御しようと思うと、Todoリストを覆い、かつモーダルダイアログも覆わなければなりませんが、これだと制御範囲が大きくなりすぎて、コードがわかりにくくなることを懸念しています。そのための分割です
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

  // Used to prevent browser default behavior on specific elements.
  void(event) {
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
      * 一般論として、モーダルを表示しているときは背景画面が操作できないようにする必要があります。黒い幕(`div`を)被せるとマウスクリックはブロックできますが、キーボードショートカット（エンター、タブなど）やスクロールは背景画面に届いてしまいます。完全にブロックするのが`inert`属性です。なおモーダルを隠すときはすぐに`inert`を解除せずに、少しだけ時間を空けています。そうしないとエンターキーで`<input>`タグが選択せれてしまうようなので、これを防ぐためです。
* `show()`, `hide()`はStimulus Actionで、ともに`data-modal-dialog-shown-value`ステートをセットしているだけです。この値はHTML要素の属性となりますので、CSS擬似セレクタが監視しています。そしてモーダルダイアログの表示・非表示が制御されます
* `shownValueChanged()`は、`data-modal-dialog-shown-value`ステートが変更された時に自動的に呼び出されるコールバックです。CSSだけで制御できないものについてはここで処理します。
     * 背景画面（`this.pageElement`）に`inert`属性をつけたり外したりして、背景画面が操作できないようにします
* `void()`のStimulus Actionは何もしません。上述の黒い幕をクリックした時の動作で使用しました。

## まとめ --- summary

* 今回はStimulus controller間の通信を使用しました。Stimulus controllerを細かく分割して、わかりやすくするために有効な方法です
    * なおReactの場合は[`createPortal()`](https://ja.react.dev/reference/react-dom/createPortal)を使って、制御したいパーツが分散する問題に対応します。似たような機能はStimulusにはありませんが、controller間通信で解決できます
    * とはいえ、Stimulus controller間通信によって複雑になっている部分は間違いなくあります。[引き出し](/examples/drawer)で示したように、大きくなってしまうものの、１つのStimulus Controllerにまとめる方が良い可能性もあります。ケースバイケースで判断していただければと思います
* インタラクションの制御に関わるコード分量は多くないのですが、考えるポイントは少なくありません。これは[モーダルの表示・非表示の必須の複雑さに真剣に向き合った結果](/opinions/why-isnt-hotwire-simpler)ですので、HTMLネイティブの`dialog`を使ったり、モーダル用のライブラリを使ったり、さらにUI/UXをそれに合わせていかない限り、なかなか避けられません
* 今回はモーダルの表示・非表示をやりました。次はモーダルの中でCRUDをした場合のコードを見ていきます
