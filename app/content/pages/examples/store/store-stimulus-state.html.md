---
title: ステートをStimulusに持たせた例
layout: article
order: 005
published: true
---

## Stimulusにステートを持たせた場合 --- example-with-stimulus-state

[デモはこちら](/components/iphone)に用意しています。

1. 製品ページを表示するとき、Stimulus Controllerのvalue属性に、価格を含めたカタログ情報を送ります。まだ製品の初期状態もvalue属性で送ります
2. オプションが選択されるとStimulus Controllerのactionが呼び出されると、それに応じてaction属性が修正されます
3. Simulus Controllerはaction値が変更されると自動的にコールバックが呼び出されますので、そのコールバックの中で`#render`を実行します
4. `#render`はvalue属性にあるステートの内容に従って、targetとして指定されているHTML要素を更新します

* ロジックはすべてクライアントサイドで持ちます

## コード --- code

```erb:app/views/components/iphone.html.erb
<div class="mx-auto min-w-[1028px] lg:max-w-5xl">
  <!-- ... -->  
  <%
    @catalog_data[:images].transform_values! { image_path(_1) }
  %>
  <%= tag.div data: { controller: "iphone-static", iphone_static_catalog_data_value: @catalog_data } do %>
    <!-- ページの初期のHTMLはここ -->
  <% end %>
</div>
```

* `iphone-static`のStimulus Controllerを接続しています。そして`@catalog_data`を`iphoneStaticCatalogDataValue`として渡しています。この書き方をするとJSONとして渡されます
* その他、ページの初期のHTMLを記述しています

```js:app/javascript/controllers/iphone_static_controller.js
import {Controller} from "@hotwired/stimulus"
import IPhone from "../models/IPhone"

// Connects to data-controller="iphone-static"
export default class extends Controller {
  static targets = [
    "image", "price", "colorText", "itemPricing",
    "modelForm", "colorForm", "ramForm"
  ]
  static values = {
    catalogData: Object,
    iphone: {type: Object, default: {model: null, color: null, ram: null}}
  }

  connect() {
  }

  updateOption(event) {
    const {name, value} = event.currentTarget
    this.iphoneValue = {...this.iphoneValue, [name]: value}
  }

  updateColor(event) {
    const color = event.currentTarget.value
    this.iphoneValue = {...this.iphoneValue, color: color}
  }

  setColorText(event) {
    const colorName = event.params.colorName
    const colorFullName = this.catalogDataValue.colors[colorName].full_name
    this.colorTextTargets.forEach(target => target.textContent = colorFullName)
  }

  resetColorText(event) {
    this.colorTextTargets.forEach(target => target.textContent = this.iphone.fullColorName())
  }

  iphoneValueChanged() {
    this.#render()
  }

  #render() {
    this.iphone = new IPhone(this.iphoneValue, this.catalogDataValue)
    this.#renderImageTarget()
    this.#renderPriceTarget()
    this.#renderColorTextTargets()
    this.#renderItemPricingTargets()
    this.#renderFormTargets()
  }

  #renderImageTarget() {
    this.imageTarget.src = this.iphone.imagePath()
  }

  #renderPriceTarget() {
    const price = this.iphone.price()
    this.priceTarget.textContent =
      `From ${price.lump.toFixed(2)} or ${price.monthly.toFixed(2)}`
  }

  #renderColorTextTargets() {
    const colorText = this.iphone.fullColorName()
    this.colorTextTargets.forEach(e => e.textContent = colorText)
  }

  #renderItemPricingTargets() {
    this.itemPricingTargets.forEach(e => {
      const name = e.dataset.iphoneStaticPricingName
      const value = e.dataset.iphoneStaticPricingValue
      const pricing = name === "model"
                      ? this.iphone.pricingFor(value, this.iphone.ram)
                      : this.iphone.pricingFor(this.iphone.model, value)
      e.innerHTML = `
        <div class="text-xs text-gray-500 text-right">From \$${pricing.lump.toFixed(2)}</div>
        <div class="text-xs text-gray-500 text-right">or \$${pricing.monthly.toFixed(2)}</div>
        <div class="text-xs text-gray-500 text-right">for 24 mo.</div>
      `
    })
  }

  #renderFormTargets() {
    this.modelFormTarget.disabled = !this.iphone.canEnterModel()
    this.colorFormTarget.disabled = !this.iphone.canEnterColor()
    this.ramFormTarget.disabled = !this.iphone.canEnterRam()
  }
}
```

* これはStimulus Controllerの`iPhoneStaticController`のコードです
* `static targets =`では、表示状態を変更したいHTML要素を定義しています
* `static values =`では、このStimulus Controllerが管理するステートを記述しています。`values`はHTML要素の`data-*`属性として保存されますが、それを自動的に型にキャストするために型を定義します
* `update*()`のメソッドはすべてactionです。HTMLのradio buttonが変更されたときに呼び出されます。Stimulus Controllerの`value`を更新しています
* `setColorText()`, `resetColorText()`は色のアイコンの上をホバーした時の処理です。一時的に色の名前を表示するだけですので、ステートに保存する必要がありません。ここでは`value`属性を変更せずにダイレクトにHTML要素の`textContext`属性を書き換えています
* `iphoneValueChanged()`は`iphoneValue`属性が変更された時に自動的に呼ばれるコールバックです。上記の`update*()`メソッドはいずれも`value`を更新していましたが、そうするとこのメソッドが自動的に呼ばれます。そしてこの中で`#render()`メソッドを呼び出します
* `#render()`メソッドでは`value`にセットされたステートに従って、各`*target`の表示を変更します。その際、価格計算等のロジックは複雑になりますので、`IPhone`クラスのインスタンスを作り、それに委任しています。

```js:app/javascript/models/IPhone.js
export default class IPhone {
  static DEFAULT_MODEL = "6-1inch"
  static DEFAULT_COLOR = "naturaltitanium"
  static DEFAULT_RAM = "256GB"

  constructor(iphoneObject, data) {
    this.model = iphoneObject.model
    this.color = iphoneObject.color
    this.ram = iphoneObject.ram
    this.data = data
  }

  state() {
    if (this.ram) {
      return "ram_entered"
    } else if (this.color) {
      return "color_entered"
    } else if (this.model) {
      return "model_entered"
    } else {
      return "nothing_entered"
    }
  }

  canEnterModel() {
    return true
  }

  canEnterColor() {
    return ["model_entered", "color_entered", "ram_entered"].includes(this.state())
  }

  canEnterRam() {
    return ["color_entered", "ram_entered"].includes(this.state())
  }

  imagePath() {
    const imageLabel = `${this.model || IPhone.DEFAULT_MODEL}-${this.color || IPhone.DEFAULT_COLOR}`
    return this.data.images[imageLabel]
  }

  fullColorName() {
    return this.data.colors[this.color || IPhone.DEFAULT_COLOR].full_name
  }

  price() {
    const modelPrice = this.data.prices.model[this.model || IPhone.DEFAULT_MODEL]
    const ramPrice = this.data.prices.ram[this.ram || IPhone.DEFAULT_RAM]
    return {lump: modelPrice.lump + ramPrice.lump, monthly: modelPrice.monthly + ramPrice.monthly}
  }

  pricingFor(model, ram) {
    model = model || IPhone.DEFAULT_MODEL
    ram = ram || IPhone.DEFAULT_RAM
    return {
      lump: this.data.prices.model[model].lump + this.data.prices.ram[ram].lump,
      monthly: this.data.prices.model[model].monthly + this.data.prices.ram[ram].monthly,
    }
  }
}
```

* `IPhone`クラスはビジネスロジックを収めています
    * 初期状態のモデル・カラー・RAM容量
    * どこまでオプションを入力したかをステートマシン的に管理
    * model, color, ram等のオプションをセットするメソッド
    * 色の名前や画像URLを算出する処理
    * 価格情報を算出する処理

## まとめ --- summary

* ステートをサーバに持たせているものと構造としてはよく似ています。結局はロジックが複雑であるという問題を解決するため、iPhoneクラスを作り、そこにビジネスロジックを持たせています
* `target`を使って、指定したHTML要素を更新しています。ステートをサーバに持たせた例、およびReactの例と異なり、Stimulusの場合はページのHTMLをゼロからレンダリングし直すことはしません。あくまでも`target`で指定された箇所だけをアップデートする感じになります
* Stimulusでは、必ずしもステートを明確に用意する必要はありません。むしろステートはHTMLにあると考えて、その都度HTML要素の状態を確認するのが普通です。しかし今回のようにステートが複雑である場合やステートが複数のHTML要素を同時に更新する場合は、ステートを一箇所にまとめて、そこから各HTML要素をレンダリングする方がわかりやすくなります。今回のステートを使用したパターンはそのようなものになります。
