import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="slide-drawer"
export default class extends Controller {
  static values = {
    shown: {type: Boolean, default: false},
    selectedTab: {type: Number, default: 0},
  };
  static targets = ["drawer", "tab"]

  connect() {
  }

  show(event) {
    this.shownValue = true
    this.selectedTabValue = this.tabTargets.indexOf(event.currentTarget)
  }

  hide() {
    this.shownValue = false
    this.selectedTabValue = 0
  }

  shownValueChanged() {
    this.#render()
  }

  #render() {
    if (this.shownValue) {
      document.body.style.overflow = "hidden"
      this.drawerTarget.ariaHidden = false
    } else {
      document.body.style.overflow = "auto"
      this.drawerTarget.ariaHidden = true
    }
    this.tabTargets.forEach((target, i) => {
      target.ariaSelected = (i === this.selectedTabValue)
    })
  }
}
