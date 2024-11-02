import {Controller} from "@hotwired/stimulus"
import IPhone from "../models/IPhone"

// Connects to data-controller="iphone-static"
export default class extends Controller {
  static targets = ["image", "price", "colorText", "itemPricing"]
  static values = {
    catalogData: Object,
    iphone: {type: Object, default: {model: "6-1inch", color: "naturaltitanium", ram: "256GB"}}
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
  }

  #renderImageTarget() {
    this.imageTarget.src = this.iphone.imagePath()
  }

  #renderPriceTarget() {
    this.priceTarget.textContent =
      `From ${this.iphone.price().lump.toFixed(2)} or ${this.iphone.price().monthly.toFixed(2)}`
  }

  #renderColorTextTargets() {
    this.colorTextTargets.forEach(e => e.textContent = this.iphone.fullColorName())
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
}
