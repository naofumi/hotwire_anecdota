import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="sidebar"
export default class extends Controller {
  connect() {
  }

  toggle(event) {
    const button = event.currentTarget
    button.ariaExpanded = button.ariaExpanded === "true" ? "false" : "true"
  }

  setCurrent(event) {
    this.#resetAriaCurrent()
    const link = event.currentTarget
    link.ariaCurrent = "page"
  }

  #resetAriaCurrent() {
    this.element
      .querySelectorAll("[aria-current]")
      .forEach(e => e.ariaCurrent = "false")
  }
}
