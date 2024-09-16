import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="revealer"
export default class extends Controller {
  static targets = ["revealable"]
  connect() {
  }

  exclusiveReveal(event) {
    const revealable = this.element.querySelector(event.params.revealable)

    this.revealableTargets.forEach(element => {
      if (element === revealable) {
        element.classList.remove("hidden")
        element.classList.add("block")
      } else {
        element.classList.remove("block")
        element.classList.add("hidden")
      }
    })
  }
}
