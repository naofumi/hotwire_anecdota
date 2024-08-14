import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="select-menu"
export default class extends Controller {
  static targets = ["input"]

  connect() {
  }

  toggle(event) {
    event.currentTarget.ariaExpanded
      = event.currentTarget.ariaExpanded === "true"
        ? "false"
        : "true"
  }

  select(event) {
    this.element.querySelectorAll("*[aria-selected=true]")
      .forEach((e) => e.ariaSelected = "false")
    event.currentTarget.ariaSelected = "true"
    this.inputTarget.innerHTML = event.currentTarget.textContent
    this.#close()
  }

  #close() {
    const button = this.element.querySelector("*[aria-haspopup=listbox]")
    button.ariaExpanded = "false"
  }
}
