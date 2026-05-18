---
title: Stimulus Controllerの構造
layout: article
order: 150
published: true
---

![stimulus-structure.webp](content_images/stimulus-structure.webp "max-w-[400px] mx-auto")

ここでは私がStimulus Controllerを書くときのパターンを紹介します。他人のものとの比較は十分にやっているわけではありませんが、概ね似ているのではないかと思います。

## 単方向データフロー --- single-direction-data-flow

単方向データフローはロジックがわかりやすく、デバッグしやすいのが特徴です。jQueryよりもReactの方がわかりやすいと言われるのは主に単方向データフローのおかげだと思います。**特に複数のActionが複数のTargetを更新しているケースではロジックが追いやすくなります**。

**複雑なステートを管理する場合、Stimulusも単方向データフロー的な使い方ができます**。ここで紹介するのはこのようなものです。簡単なステートの場合は、ここまで考える必要はありません。

[コード例](/examples)の中には下記の書き方をしているものがたくさんあります。

* 簡単な例: [引き出しの例](/examples/drawer)
* 複雑な例: [Apple Store模写の例](/examples/store/store-stimulus-state)

## 具体例 --- example

下記は[Apple Store模写の比較的複雑なStimulus Controllerの例](/examples/store/store-stimulus-state)です。各セクションをコメントしていますので、コードの中をご確認ください。

* **Actionのメソッドの行数を少なくします**。ステートの更新に集中させることで、責務を明確にします（ただしステートを介さないような簡単な処理の場合は直接targetを更新させることもあります）。なおこの考え方は[Rails MVCのSkinny Controller](https://weblog.jamisbuck.org/2006/10/18/skinny-controller-fat-model)と同じ考え方です。
* **ActionハンドラーとRenderを明確に分けるのは大きなメリットがある**と感じています。
* また下記では`IPhone`クラスを用意し、**ビジネスロジックは完全に分離収納しています**。下記のような処理の流れになります。
    * Actionで`this.iphoneValue`ステートを更新する（[Valuesステート](https://stimulus.hotwired.dev/reference/values)）
    * `#render()`するとき、上記ステートで`IPhone`クラスを初期化
    * `IPhone`クラスのビジネスロジックに応じて、画面を変更する


```js:app/javascript/controllers/iphone_static_controller.js
import {Controller} from "@hotwired/stimulus"
import IPhone from "../models/IPhone"

// Connects to data-controller="iphone-static"
export default class extends Controller {
  // target, values, classes, outlets等の宣言
  static targets = [
    "image", "price", "colorText", "itemPricing",
    "modelForm", "colorForm", "ramForm"
  ]
  static values = {
    catalogData: Object,
    iphone: {type: Object, default: {model: null, color: null, ram: null}}
  }

  // Stimulus Controllerを使うときは真っ先に接続確認をしますので、たいてい残しています。
  // ここに`alert("hello")`などと書いて、接続を確認します。
  connect() {
  }

  // `data-action`によって呼び出されるイベントハンドラ群。
  // Actionと読んだりもします。
  // Actionはなるべく行数を少なくします。RailsのThin Controllerと同じ発想で、
  // なるべく他のメソッドに処理を委任します。
  //
  // 簡単な場合はActionの中でHTMLのCSS属性やちょっとした内容を変更しますが、
  // 多くの場合はステートを変更するのにとどめます。ステートに基づいて実際に
  // HTMLを変更するのは、複雑になってきたらなるべく`#render()`のようなもので
  // まとめて処理します。
  updateOption(event) {
    const {name, value} = event.currentTarget
    this.iphoneValue = {...this.iphoneValue, [name]: value}
  }

  updateColor(event) {
    const color = event.currentTarget.value
    this.iphoneValue = {...this.iphoneValue, color: color}
  }

  // この２つのActionはステートを介さないような簡単な処理をする箇所です。
  // そのためにActionの中で直接targetを更新しています。
  setColorText(event) {
    const colorName = event.params.colorName
    const colorFullName = this.catalogDataValue.colors[colorName].full_name
    this.colorTextTargets.forEach(target => target.textContent = colorFullName)
  }

  resetColorText(event) {
    this.colorTextTargets.forEach(target => target.textContent = this.iphone.fullColorName())
  }

  // Stimulus `Values`でステートを管理している場合は、Valueが変更されたら自動的に
  // 呼び出される`*ValueChanged`コールバックを使います。
  iphoneValueChanged() {
    this.#render()
  }

  // 少し複雑になって、複数のtargetを更新するControllerの場合は、すべてまとめて
  // #render()に記載します。
  //
  // なおActionによってはすべてのtargetを更新する必要がないものもあります。
  // しかし、どのActionがどのtargetを更新するかを管理するのは大変です。
  // 多少の無駄があっても、常にすべてのtargetを更新するように私はしています。
  // これは差分検出処理がないだけで、割とReactの考え方に近いのではないかと思います。
  #render() {
    // このStimulus Controllerではステートマシン的な管理や価格計算が行われています。
    // Controllerにそのロジックを入れるとかなり大きくなってしまうので、
    // 別途 `Iphone` モデルを作って使用しています。
    // あくまでもControllerは **Action ==> Valuesなどのステート ==> targets** の
    // フローを管理するものとして切り分けます。
    this.iphone = new IPhone(this.iphoneValue, this.catalogDataValue)
    this.#renderImageTarget()
    this.#renderPriceTarget()
    this.#renderColorTextTargets()
    this.#renderItemPricingTargets()
    this.#renderFormTargets()
  }

  // targetごとにレンダリングするメソッドを分けます
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

## まとめ --- summary

* ある程度複雑になると、Reactの単方向データフローと同じように、データフローを整理した方がわかりやすくなります。
* Stimulusはそのための[Valuesステート](https://stimulus.hotwired.dev/reference/values)を用意しています
