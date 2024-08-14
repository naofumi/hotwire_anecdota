import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="tablist"
export default class extends Controller {
  connect() {
  }

  select(event) {
    const selected = event.currentTarget
    this.element.querySelectorAll("[aria-current]")
      .forEach((e) => {e.ariaCurrent = "false"})
    selected.ariaCurrent = "page"
  }
}
