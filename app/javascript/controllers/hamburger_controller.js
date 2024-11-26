import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="hamburger"
export default class extends Controller {
  connect() {
  }

  toggle(event) {
    event.currentTarget.ariaExpanded = event.currentTarget.ariaExpanded == "true" ? "false" : "true"
  }
}
