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
