---
title: Hotwireでステートをサーバに持たせる
layout: article
order: 10
published: true
siblings: true
---


## 概略 --- overview

ここでは価格変更の計算やステートの保持をすべてサーバに持たせる例を紹介します。

[デモはこちら](/iphone)に用意しています。

1. オプションが選択されるたびにサーバにリクエストを送信します
2. サーバは再計算された価格等をすべて反映したHTMLを返してきます
3. TurboはレスポンスのHTMLを画面に反映させ、新しい状態の価格等を表示します
4. この際、単にHTMLを置換するのではなく、Morphing(差分検出処理)を行い、ブラウザステートを維持します。これはReactが再レンダリングのたびに行うものと同じ考えです

## コード --- server-state-code

### IphonesController#show コントローラアクション --- show-controller

```rb:app/controllers/iphones_controller.rb
class IphonesController < ApplicationController
  layout "iphone"
  before_action :set_iphone
  
  def show
  end

  # ...
  
  private

    def set_iphone
      session[:iphone] ||= {}
      @iphone = Iphone.new(session[:iphone])
    end
end
```

* `IphonesController#show`をエンドポイントとします
* `@iphone`インスタンスは`Iphone`オブジェクトのインスタンスです。DBを使わずに、ステートはすべて`session`で管理ます。そのため`Iphone`インスタンスは`session`を使って初期化します

### Iphone.rb モデル --- iphone-model

```rb:app/models/iphone.rb
class Iphone
  def initialize(iphone_session)
    @iphone_session = iphone_session
    @catalog = Catalog.new
  end

  def state
    case
    when @iphone_session["ram"] then :ram_entered
    when @iphone_session["color"] then :color_entered
    when @iphone_session["model"] then :model_entered
    else :nothing_entered
    end
  end

  def model_enterable?
    true
  end

  def color_enterable?
    state.in? [ :model_entered, :color_entered, :ram_entered ]
  end

  def ram_enterable?
    state.in? [ :color_entered, :ram_entered ]
  end

  def model=(string)
    return unless model_enterable?
    @iphone_session["model"] = string
  end

  def model
    @iphone_session["model"]
  end

  def color=(string)
    return unless color_enterable?
    @iphone_session["color"] = string
  end

  def color
    @iphone_session["color"]
  end

  def ram=(string)
    return unless ram_enterable?
    @iphone_session["ram"] = string
  end

  def ram
    @iphone_session["ram"]
  end

  def color_name
    @catalog.color_name(color)
  end

  def image_path
    @catalog.image_path(model, color)
  end

  def pricing
    @catalog.pricing(model, ram)
  end

  def to_hash
    { model:, color:, color_name: }
  end
end
```

* `Iphone`クラスには注文状況とそこから導出される関連情報が収まっています
    * どこまでオプションを入力したかをステートマシン的に管理(`#color_enterable?` `#ram_enterable?`)
    * model, color, ram等のオプションをセットするメソッド (`#[...]=`)
    * 色の名前や画像URLを算出する処理 => `Iphone::Catalog`クラスに移譲 (`#color_name` `image_path`)
    * 価格情報を算出する処理 => `Iphone::Catalog`クラスに移譲 (`#pricing`)

### iPhoneモデルオプション選択 view --- iphone-model-select-view

```erb:app/views/iphones/_iphone.html.erb
<% local_assigns => {catalog:, iphone:} %>
  <!-- ... -->
    <%= form_with url: iphone_path, method: :post do %>
      <%= fieldset_tag nil, disabled: !iphone.model_enterable?, class: "disabled:opacity-30" do %>
        <% [{ model: "6-1inch", title: "オラのスマホ Pro", subtitle: "6.1-inch display" },
            { model: "6-7inch", title: "オラのスマホ Pro Max", subtitle: "6.7-inch display" }].each do |attributes| %>
          <%= render 'option',
                     name: :model,
                     value: attributes[:model],
                     selected: iphone.model == attributes[:model],
                     title: attributes[:title],
                     subtitle: attributes[:subtitle],
                     pricing_lines: item_pricing(attributes[:model], iphone.ram, catalog)
          %>
        <% end %>
      <% end %>
    <% end %>
  <!-- ... -->
```

```erb:app/views/iphones/_option.html.erb
<%= label_tag [name, value].join('_'), class: "mt-4 flex justify-between items-center p-4 block border-2 rounded-lg w-full cursor-pointer has-[:checked]:border-blue-500" do %>
  <%= radio_button_tag name, value, selected,
                       class: "hidden",
                       onchange: "this.form.requestSubmit()"
  %>
  <div>
    <div class="text-lg"><%= title %></div>
    <% if subtitle %>
      <div class="text-sm text-gray-500"><%= subtitle %></div>
    <% end %>
  </div>
  <div>
    <% pricing_lines.each do |line| %>
      <div class="text-xs text-gray-500 text-right"><%= line %></div>
    <% end %>
  </div>
<% end %>
```

* オプションは`app/views/iphones/_option.html.erb`の中で`radio_button_tag`として実装しています。`radio`を使いますので、楽観的UIはブラウザネイティブのものが使えます
* `radio_button`が変更されたら`onchange`でformをsubmitします。本来ならばStimulus Controllerを作って、それを呼び出すべきかもしれません。しかしこれぐらいに簡単な場合はさすがに面倒なので、私はインラインJavaScriptで済ませることも多いです
* 製品オプションは選択されると、<span class="text-blue-600">青い</span>枠がつきます。これはCSSの`has-[:checked]:border-blue-500`で処理されます。`radio_button`の`check`は楽観的に入りますので、この枠も楽観的UIです
* formは`app/views/iphones/_iphone.html.erb`に記されている普通の`form_with`で実装しています。Turboがインストールされていますので、submitされると非同期でサーバにリクエストを送信します

### IphonesController#create コントローラアクション --- create-controller

```ruby:app/controllers/iphones_controller.rb
class IphonesController < ApplicationController
  layout "iphone"
  before_action :set_iphone
  before_action :set_catalog

  # ...

  def create
    @iphone.model = params[:model] if params[:model]
    @iphone.color = params[:color] if params[:color]
    @iphone.ram = params[:ram] if params[:ram]

    respond_to do |format|
      format.turbo_stream
    end
  end

  # ...
end
```

* formのsubmitは`IphonesController#create`に来ます
* ここで`@iphone` (`Iphone`クラスのインスタンス)に`params`が渡され、ブラウザで選択されたオプションがsessionに反映されます
* 最後に`turbo_streams`で応答しています。これは規約に従って`create.turbo_stream.erb`をテンプレートとして使用します

### create後のTurbo Stream --- create-turbo-stream

```erb:app/views/iphones/create.turbo_stream.erb
<%= turbo_stream.replace "iphone", method: "morph" do %>
  <%= render "iphone", iphone: @iphone, controller: @catalog %>
<% end %>
```

* Turbo Streamの中ではHTML上のidが`iphone`の場所に、partialの`iphone`を入れ替えています。`iphone` partialはフォーム全体をカバーしています。つまり更新された内容でフォーム全体を描き直しています
* `method: "morph"`をしていますので、単純にDOMを新しいものと入れ替えるのではなく、変更された箇所だけを入れ替えます。ブラウザのステートをなるべくそのままにしますので、よりスムーズなUI/UXになります
    * Turbo Streamsは個別の小さい範囲を書き換えるのによく使いますが、今回のように大きい範囲を書き直すときも使えます。その方がコードが簡略化されます。その場合は一般的にMorphingを使ってブラウザステートを維持すると良いでしょう 

### カラーオプションをホバーした時 --- hover-on-color

```erb:app/views/iphones/_iphone.html.erb
<%= tag.div data: { controller: "color-changer", color_changer_iphone_value: iphone } do %>
  <div class="text-xl my-4" data-color-changer-target="colorText"><%= iphone.color_name %></div>

  <%= form_with url: iphone_path, method: :post do %>
    <%= fieldset_tag nil, disabled: !iphone.color_enterable?, class: "disabled:opacity-30" do %>
      <% [{ color: "naturaltitanium", class: "bg-gray-400" },
          { color: "bluetitanium", class: "bg-indigo-800" },
          { color: "whitetitanium", class: "bg-white" },
          { color: "blacktitanium", class: "bg-black" }].each do |attributes| %>
        <%= render 'color_option',
                   value: attributes[:color],
                   color: attributes[:class],
                   iphone: iphone %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

```erb:app/views/iphones/_color_option.html.erb
<% local_assigns => {value:, color:, iphone:} %>

<%= label_tag [:color, value].join('_'),
              data: {
                action: "mouseenter->color-changer#setColorText mouseleave->image-switcher#resetColorText",
                color_changer_color_name_param: iphone.color_name_for_value(value)
              },
              class: "#{color} inline-block w-8 h-8 border-2 rounded-full cursor-pointer outline-2 outline outline-offset-0.5 outline-transparent has-[:checked]:outline-blue-500" do %>
  <%= radio_button_tag :color, value, iphone.color == value,
                       class: "hidden",
                       onchange: "this.form.requestSubmit()"
  %>&nbsp;
<% end %>
```

* カラーオプションを表示する箇所です
    * カラーオプションの上をホバーした時にオプションの上のテキストにカラー名が表示されますが、これはサーバに通信するほどのことでもない上、レスポンスが速くないとUI/UXが悪いので、Stimulusだけを使ってブラウザ上で実装します
* 個々のカラーオプションは`_color_option.html.erb` partialで書いています
* ホバーした時のアクションは`ColorChangerController` Stimulus Controllerが担当します
    * 変更されるテキストは `data-color-changer-target="colorText"`の箇所です
    * Stimulus Controllerは`data-action="mouseenter->color-changer#setColorText mouseleave->image-switcher#resetColorText"`で、`mouseenter`, `mouseleave`イベントに応じて呼び出されます
    * 表示するテキストは`data-color-changer-color-name-param`で指定しています

### カラーオプション変更のStimulus Controller --- color-changer-stimulus-controller

```js:app/javascript/controllers/color_changer_controller.js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="color-changer"
export default class extends Controller {
  static values = {iphone: Object}
  static targets = ["colorText"]

  connect() {
  }

  setColorText(event) {
    const colorName = event.params.colorName
    this.colorTextTargets.forEach(target => target.textContent = colorName)
  }

  resetColorText(event) {
    this.colorTextTargets.forEach(target => target.textContent = this.iphoneValue.color_name)
  }
}
```

* Actionから`setColorText`, `resetColorText`が呼び出され、Targetの内容を直接更新するものです
    * シンプルな更新の場合はコードが複雑になりませんので、Stimulus Controllerの中でステートを管理せず、HTMLに直接書き込んでも問題ありません 
    * 表示するべき文字は`params.colorName`から読み込んでいます

## まとめ --- summary-server-state

* ブラウザ側は`form`を送信するだけです。ラジオボタンを押した時にformを自動的に送信するインラインJavaScriptを書いているのみで、ほとんど何もしていません（今回はインラインで書ける程度のJavaScriptでしたので、Stimulusも省略しました）
* 製品オプションはHTMLネイティブの`radio`で実装していますので、コードを書かなくても楽観的UIが実現できます。CSS擬似要素の`:checked`て適宜UIを更新します
* サーバ側のControllerも簡単なものです。リクエストを受け取り、`Iphone`オブジェクトを作り、更新しているだけです。Railsのごく一般的なControllerです
* ロジックの複雑さはすべて`Iphone`クラスに集約されています
   * 注文に関する情報は`Iphone`クラスに、カタログに関する情報は`Iphone::Catalog`クラスに分けています 
* カラーオプションの上をホバーした時の動作は簡単なもので、他の要素に影響しませんので、ステートを持たずにStimulusで簡単に処理しています。ここの処理はそれ以外のフォームの処理と完全に独立しています
* 画面の更新はTurbo Streams + Morphingを使っています
    * Turbo Streamsではありますが、細かく複数箇所を更新するのではなく、一気に全画面を更新しています（`app/views/iphones/create.turbo_stream.erb`）
       * 複数箇所を更新しないため、最初の画面描画とのちのTurbo Streamsによる更新はほぼ同じコードになります（個別に更新箇所を指定する必要がありませんので、コードが簡単です）
    * Turbo Streamsは画面の複数箇所を更新する機能の他、パフォーマンス最適化でも有効です。Turbo Drive, Turbo Framesだと必要なPOST/Redirect/GETパターンを省略し、直接POSTから画面更新ができるためです。今回はパフォーマンス最適化のために使っています
    * Morphingはブラウザステート（フォーカスなど）をなるべく維持するために使っています。今回は必ずしも必要ありませんが、そういうフィールドがある時は有効です

上述のように、製品オプションを選択するたびにサーバ通信をするやり方であっても、UI/UX上は特に問題になりません。楽観的UIも実現していますので、ネットワークが遅くてもUI/UXへの悪影響は最小化できています。
