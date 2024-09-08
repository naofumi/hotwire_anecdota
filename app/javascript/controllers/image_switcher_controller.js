import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="image-switcher"
export default class extends Controller {
  static values = {iphone: Object}
  static targets = ["colorText"]

  connect() {
  }

  setColorTitle(event) {
    const colorName = event.params.colorName
    this.colorTextTargets.forEach(target => target.textContent = colorName)
  }

  resetColorTitle(event) {
    this.colorTextTargets.forEach(target => target.textContent = this.iphoneValue.color_name)
  }

}
