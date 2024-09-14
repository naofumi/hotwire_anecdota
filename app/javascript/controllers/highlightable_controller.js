import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="highlightable"
export default class extends Controller {
  static targets = ["highlightee"]
  static classes = ["highlight"]

  connect() {
  }

  highlight(event) {
    const group = event.params.group
    this.highlighteeTargets.forEach(e => e.classList.remove(this.highlightClass))
    event.currentTarget.classList.add(this.highlightClass)
  }

  clearAllHighlights(event) {
    this.highlighteeTargets.forEach(e => e.classList.remove(this.highlightClass))
  }
}
