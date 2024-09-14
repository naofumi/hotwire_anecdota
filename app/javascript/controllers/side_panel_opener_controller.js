import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="side-panel-opener"
export default class extends Controller {
  static values = {panel: String}

  connect() {
  }

  show(event) {
    this.#sidePanel.show()
  }

  close(event) {
    this.#sidePanel.close()
  }

  get #sidePanel() {
    return document.querySelector(this.panelValue)
  }
}
