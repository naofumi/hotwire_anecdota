import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="slide-drawer"
export default class extends Controller {
  static values = {show: {type: Boolean, default: false}};
  static targets = ["backdrop", "drawer"]

  connect() {
  }

  show() {
    this.showValue = true
    this.#render()
  }

  hide() {
    this.showValue = false
    this.#render()
  }

  #render() {
    if (this.showValue) {
      this.backdropTarget.classList.remove("!opacity-0", "invisible")
      this.drawerTarget.classList.remove("translate-x-[768px]")
      document.body.style.overflow = "hidden"
    } else {
      this.backdropTarget.classList.add("!opacity-0", "invisible")
      this.drawerTarget.classList.add("translate-x-[768px]")
    }
  }
}
