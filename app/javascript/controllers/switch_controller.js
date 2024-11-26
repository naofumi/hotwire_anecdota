import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="switch"
export default class extends Controller {
  connect() {
  }

  toggle() {
    this.element.ariaChecked = this.element.ariaChecked === "true" ? "false" : "true"
  }
}
