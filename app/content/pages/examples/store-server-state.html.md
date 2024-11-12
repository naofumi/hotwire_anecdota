---
title: 製品選択画面のステートをサーバに持たせた例
layout: section
order: 005
published: true
---

## サーバにステートを持たせた場合 --- example-with-server-state

[デモはこちら](/iphone)に用意しています。

1. オプションが選択される都度、サーバにリクエストを送信します
2. サーバは再計算された価格等をすべて反映したHTMLを返してきます
3. レスポンスのTurbo Streamsを画面に反映させて、新しい状態の価格等を表示します
4. この際、単にHTMLを置換するのではなく、Morphing(差分検出処理)を行い、ブラウザステートを維持します。これはReactが再レンダリングのたびに行うものと同じ考えです

* ロジックはすべてサーバサイドに保持されます

### コード --- server-state-code

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
* `@iphone`インスタンスは`Iphone`オブジェクトのインスタンスです。選択されたオプションは`session`の中に保存しますので、`Iphone`インスタンスは`session`を使って初期化します

```rb:app/models/iphone.rb
class Iphone
  Price = Data.define(:lump, :monthly)
  DEFAULT_MODEL = "6-1inch"
  DEFAULT_COLOR = "naturaltitanium"
  DEFAULT_RAM = "256GB"

  def initialize(iphone_session)
    @iphone_session = iphone_session
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
    color_name_for_value(color)
  end

  def color_name_for_value(value)
    color_table = {
      "naturaltitanium" => "Color – Natural Titanium",
      "bluetitanium" => "Color – Blue Titanium",
      "whitetitanium" => "Color – White Titanium",
      "blacktitanium" => "Color – Black Titanium"
    }
    color_table[value || DEFAULT_COLOR]
  end

  def image_path
    "iphone_images/iphone-15-pro-finish-select-202309-#{model || DEFAULT_MODEL}-#{color || DEFAULT_COLOR}.webp"
  end

  def pricing
    Iphone.pricing_for(model, ram)
  end

  def self.pricing_for(model, ram)
    Price.new(lump: 0, monthly: 0).then do |price|
      case model || DEFAULT_MODEL
      when "6-1inch" then Price.new(lump: price.lump + 999, monthly: price.monthly + 41.62)
      when "6-7inch" then Price.new(lump: price.lump + 1199, monthly: price.monthly + 49.95)
      else raise "bad model: #{model}"
      end
    end.then do |price|
      case ram || DEFAULT_RAM
      when "256GB" then price
      when "512GB" then Price.new(lump: price.lump + 200, monthly: price.monthly + 8.34)
      when "1TB" then Price.new(lump: price.lump + 400, monthly: price.monthly + 26.77)
      end
    end
  end

  def to_hash
    { model:, color:, color_name: }
  end
end
```

* `Iphone`クラスはビジネスロジックを収めています
    * 初期状態のモデル・カラー・RAM容量
    * どこまでオプションを入力したかをステートマシン的に管理
    * model, color, ram等のオプションをセットするメソッド
    * 色の名前や画像URLを算出する処理
    * 価格情報を算出する処理

本当のストアであれば製品オプションの情報や価格算出はDB等で管理すると思いますが、今回はとりあえずハードコードしました。

```erb:app/views/iphones/_iphone.html.erb
  <%= form_with url: iphone_path, method: :post do %>
    <%= fieldset_tag nil, disabled: !@iphone.model_enterable?, class: "disabled:opacity-30" do %>
      <% [{ model: "6-1inch", title: "iPhone 15 Pro", subtitle: "6.1-inch display" },
          { model: "6-7inch", title: "iPhone 15 Pro Max", subtitle: "6.7-inch display" }].each do |attributes| %>
        <%= render 'option',
                   name: :model,
                   value: attributes[:model],
                   selected: @iphone.model == attributes[:model],
                   title: attributes[:title],
                   subtitle: attributes[:subtitle],
                   pricing_lines: item_pricing(attributes[:model], @iphone.ram)
        %>
      <% end %>
    <% end %>
  <% end %>
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

* オプションは`app/views/iphones/_option.html.erb`の中で`radio_button_tag`で実装しています
* `radio_button`が変更されたら`onchange`でformをsubmitします
* 製品オプションは選択されると、<span class="text-blue-600">青い</span>枠がつきます。これはCSSの`has-[:checked]:border-blue-500`で処理されます
* formは`app/views/iphones/_iphone.html.erb`に記されている普通の`form_with`です。Turboがインストールされていますので、submitされると非同期でサーバにリクエストを送信します

```ruby:app/controllers/iphones_controller.rb
class IphonesController < ApplicationController
  layout "iphone"
  before_action :set_iphone

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

* formのsubmitは`IphonesController#submit`に来ます
* ここで`@iphone` (Iphoneクラスのインスタンス)に`params`が渡され、選択されたオプションがsessionに反映されます
* 最後に`turbo_streams`で応答しています。これは規約に従って`create.turbo_stream.erb`をテンプレートとして使用します

```erb:app/views/iphones/create.turbo_stream.erb
<%= turbo_stream.replace "iphone", method: "morph" do %>
  <%= render "iphone", iphone: @iphone %>
<% end %>
```

* Turbo Streamの中ではHTML上のidが`iphone`の場所に、partialの`iphone`を入れ替えています。つまり更新された内容で描き直しています
* `method: "morph"`をしていますので、単純にDOMを新しいものと入れ替えるのではなく、変更された箇所だけを入れ替えます。ブラウザのステートをなるべくそのままにしますので、よりスムーズなUI/UXになります

### まとめ --- summary-server-state

* ブラウザ側は`form`を送信するだけで、非常に簡単に保たれています
* サーバ側のControllerも非常に簡単に保たれています。リクエストを受け取り、`Iphone`オブジェクトを作ったり、更新したりするだけです
* 複雑さは`Iphone`クラスのインスタンスである`@iphone`に集約されています



