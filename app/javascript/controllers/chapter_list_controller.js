import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="chapter-list"
export default class extends Controller {
  static values = {shown: {type: Boolean, default: false}}
  static targets = ["mobile", "desktop"]
  connect() {
  }

  toggle() {
    this.shownValue = !this.shownValue
  }
}
