import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="file-detail"
export default class extends Controller {
  static targets = ["panel"]

  connect() {
  }

  show() {
    this.panelTarget.classList.remove('hidden')
  }
}
