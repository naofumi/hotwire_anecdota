---
title: Stimulus Controllerの構造
layout: article
order: 020
published: true
---

## はじめに --- intro

ここでは私がStimulus Controllerを書くときのパターンを紹介します。他人のものとの比較は十分にやっているわけではありませんので、今のところは私の書き方の紹介になります。

## Action, Renderingを分ける

下記は比較的複雑なStimulus Controllerの例です。各セクションをコメントしていますので、コードの中をご確認ください。

私が気を使っているのはActionのメソッドの行数を少なくして、RailsのThin Controllerのようにし、ステートの更新に集中させることです（ただしステートを介さないような簡単な処理の場合は直接targetを更新させます）。

またレンダリングを簡単にするために、すべてのtargetをまとめてレンダリングします。どのActionがどのtargetを更新するかを管理するのは、数が多くなると大変なので、多少の無駄が発生しても良いぐらいの気持ちですべてをまとめてレンダリングします。

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
