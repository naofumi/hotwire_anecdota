---
title: ステートをStimulusに持たせる
layout: article
order: 20
published: true
---

## 概略 --- introduction

ここではステートをすべてStimulusに持たせて価格表示の変更などをさせるものを紹介します。

[デモはこちら](/components/iphone)に用意しています。

1. 各オプションごとの製品価格および製品オプションの初期値をStimulus Controllerにあらかじめ渡す必要があります。Stimulusの[Values](https://stimulus.hotwired.dev/reference/values)を使うと、HTMLの`data-*`属性でサーバから値を渡すことができます
2. オプションが選択されるとStimulus Controllerのactionが呼び出され、actionの中でStimulusのValueを更新します
3. Valueが更新されると自動的にコールバックが呼ばれますので、その中で`#render`を実行します
4. `#render`はtargetとして指定されているHTML要素を更新します

**Action ==> Values ==> Targets**と情報が流れます。Reactと似た感じで、Values(ステート)を中心にActionを受け取り、Targetを更新するフローになります。

Stimulusはステートを内部に持たず、HTMLにステートを持たせる書き方が多いです。ただし今回はデータが更新される箇所が多数あり、更新ロジックも少し複雑ですので、ステート中心のフローが適切です。

## コード --- code

### Stimulus Controllerの接続と初期データの受け渡し --- stimulus-initialization-and-data-transfer

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

* `iphone-static`Stimulus Controllerをとの接続です。`@catalog_data`はコントローラから渡された製品オプションと価格のデータです。これを`iphoneStaticCatalogDataValue`としてStimulus Controllerに渡しています（なおRailsはこの時に自動的にJSONに変換してくれます）

### `iphone-static` Stimulus Controller --- stimulus-controller

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

* `IphoneStatic` Stimulus Controllerでは製品オプション選択イベントを受け取り、`this.iphoneValue`ステートを更新し、`this.#render()`で画面を更新します
* `static targets =`では、`this.#render()`の中で更新するHTML要素を定義しています
* `static values =`はステートを記述しています。型も定義します（HTML属性はただのString型なので、キャストが必要なため）
* `update*()`のメソッドはすべてactionです。`this.iphoneValue`ステートを適宜更新しています
* `setColorText()`, `resetColorText()`は色のアイコンの上をホバーした時の処理です。一時的に色の名前を表示するだけですので、ステートに保存する必要がありません。ダイレクトにHTML要素の`textContext`属性を書き換えています
* `iphoneValueChanged()`は`iphoneValue`属性が変更された時に自動的に呼ばれるコールバックです。この中で`#render()`メソッドを呼び出します
* `#render()`メソッドはステートに従って、各`*target`の表示を変更します。その際、価格計算等のロジックは複雑になりますので、`IPhone`クラスのインスタンスを作り、それに委任しています

### IPhoneモデル --- iphone-model

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

* [ステートをサーバに持たせた例](http://localhost:3000/examples/store/store-server-state)と構造としてはよく似ています
    * ActionのイベントをStimulus Controllerで受け取り、`this.iphoneValue`ステートに保存し、IPhoneオブジェクトでロジックを処理して、targetsを更新しています
    * ステートをサーバに持たせた場合は、form送信イベントをRails Controllerで受け取り、Iphoneオブジェクトの中でsessionにステートを保存し、Iphoneオブジェクトでロジックを処理し、Turbo Streamを介してブラウザ画面を更新しました
    * ステートをサーバに持たせた場合は、HTMLを生成しながらステートを反映できました。Stimulus Controllerにステートを持たせた場合は、一度生成されたHTMLを後から修正する形になりますので、その分が煩雑です
    * Reactも構造はよく似ています。サーバのステートを持たせた場合と同様にHTMLを生成しながらステートを反映しますので、その分ReactはStimulusに比べて書きやすくなっています
