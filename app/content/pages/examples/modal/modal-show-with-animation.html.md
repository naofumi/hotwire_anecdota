---
title: ちゃんとしたモーダルを表示する
layout: article
order: 006
published: true
---

Hotwireでモーダルをちゃんと表示する方法を紹介します。なおモーダルの内容はサーバから取得するとします

## 考えるポイント --- points-to-consider

1. モーダルの内容（例えば編集form）はサーバから取得しますので、Turboを使います
   1. 部分更新しますのでTurbo FramesかTurbo Streamsが選択肢になりますが、通常はTurbo Framesで、今回もこれを選択します
2. Turboと同時にアニメーションを走らせます。これはStimulusを使用します。TurboとStimulusを同時並行で動かす感じになります
3. モーダル開閉のステートはStimulusのValuesステートを使用し、これをCSSに参照させて表示を切り替えます
   1. アニメーションは多くのCSS属性を変更しますので、少なくともTailwindを使っている場合はHTML上のCSSクラスを個別の書き換えるのではなく、Valuesステートを使った方がすべてのクラスを一望でき、わかりやすいと感じています
   2. Valuesステートを使うと外部からモーダル表示を切り替えやすくなります、利便性が上がります
4. モーダルはDOMのルートに近いところに配置するの一般的です。今回もそのようにします
   1. こうするとモーダルを表示するためのActionを記述したボタン類と、モーダル自身がDOM上で完全に別の枝に存在してしまいます。これを同時に制御するStimulus controllerを作ってしまうと、ページ全体を覆う大きなものになってしまい、わかりにくくなってしまいます（Reactと異なりprop drillingは発生しませんが、わかりにくいことには変わりないと思います）
   2. これを回避するために、モーダル自身を制御するModalDialogControllerと、モーダルを遠隔的に制御するModalDialogTriggerControllerの２つを用意します。StimulusをController間の通信を使います
5. 完璧なアクセシビリティは目指しませんが、ESCキーによってモーダルを閉じたり、[`inert`を使って裏の画像を制御できないようにする](https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/inert)などの工夫は実施します

## コード --- code

### モーダルの枠 --- modal-frame

```erb:app/views/application/_modal_dialog.html.erb
<div class="group relative z-10 collapse opacity-0 transition-all duration-200
            data-[dialog-shown=true]:visible
            data-[dialog-shown=true]:duration-300
            data-[dialog-shown=true]:opacity-100"
     id="modal-dialog"
     data-controller="modal-dialog"
     data-dialog-shown="false"
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
              group-data-[dialog-shown=true]:opacity-100
              group-data-[dialog-shown=true]:ease-out
              group-data-[dialog-shown=true]:duration-300"
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
                  group-data-[dialog-shown=true]:opacity-100
                  group-data-[dialog-shown=true]:translate-y-0
                  group-data-[dialog-shown=true]:scale-100
                  group-data-[dialog-shown=true]:ease-out
                  group-data-[dialog-shown=true]:duration-200"
           data-action="click->modal-dialog#void:stop"
      >
        <turbo-frame id="modal-dialog__frame">
        </turbo-frame>
      </div>
    </div>
  </div>
</div>
```

* モーダルには`id="modal-dialog"`をつけます。今回はDOMのルートに近いところにモーダルを配置しました。したがってStimulus controllerの`target`として指定するのではなく、`id`で指定したいためです
* モーダルに`data-controller="modal-dialog"`属性をつけて、Stimulus controllerと繋げます
* モーダルに`data-dialog-shown`属性を持たせます。これがStimulus controllerのステートになります。またこれで背景やモーダルの枠の表示をCSSで制御できるようにします
* モーダルの枠の中に`<turbo-frame>`タグを持たせています。サーバから読み込まれた内容はここに挿入されます

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
                    data: {controller: "modal-dialog",
                           action: "click->modal-dialog#show",
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

* `link_to`で作成される`<a>`タグをクリックするとモーダルが表示されます
* `data: {controller: "modal-dialog"}`で、この`<a>`を`ModalDialogController`に接続しています
* `action: "click->modal-dialog#show"`を設定し、クリックするとモーダルの「枠」を表示します
* `turbo_frame: "modal-dialog__frame"`がありますので、リンク先からレスポンスは`<turbo-frame>`の中に表示されます

### モーダル表示のStimulus Controller --- code-controller

```js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="modal-dialog"
export default class extends Controller {
  connect() {
  }

  show(event) {
    document.getElementById("modal-dialog").dataset.dialogShown = "true"
    document.getElementById("page").inert = true
  }

  hide(event) {
    document.getElementById("modal-dialog").dataset.dialogShown = "false"
    setTimeout(() => document.getElementById("page").inert = false, 100)
  }

  hideOnSuccess(event) {
    if (!event.detail.success) { return }

    this.hide(event)
  }

  // Used to prevent browser default behavior on specific elements.
  void(event) {}
}
```

* モーダルを表示・非表示にするActionは`show()`, `hide()`です
* `show()`, `hide()`ともに`data-dialog-shown`をセットしています。これがステートになります。これがCSSに影響して、表示・非表示を切り替えます
* `show()`, `hide()`ではさらに`id="page"`HTML要素の`inert`属性をしてしています。`page`はモーダル以外の部分ですが、モーダルを表示しているときはこの内容にアクセスできないようにしなければなりません。モーダルのバックを上に被せただけではキーボードショートカット（エンター、タブなど）では隠れている部分にもアクセスできてしまいます。それを防ぐのが`inert`属性で、アクセシビリティ的には重要です。なおモーダルを隠すとき、すぐに`intert`を解除せずに、少しだけ時間を空けています。そうしないとエンターキーで`<input>`タグが選択せれてしまうので、これを防ぐためです。 

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
