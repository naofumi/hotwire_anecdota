import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="radio-tabs"
export default class extends Controller {
  static targets = ["content"]

  connect() {
  }

  select(event) {
    const selectedValue = event.currentTarget.value

    this.contentTargets.forEach(target => {
      if (target.id === selectedValue ) {
        target.classList.add("block")
        target.classList.remove("hidden")
      } else {
        target.classList.remove("block")
        target.classList.add("hidden")
      }
    })
  }
}
