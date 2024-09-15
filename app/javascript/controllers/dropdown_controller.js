import { Controller } from "@hotwired/stimulus"


// Connects to data-controller="dropdown"
export default class DropdownController extends Controller {
  static targets = ["control", "menu"]
  static classes = ["show", "hide"]

  connect() {
  }

  show(event) {
    this.controlTargets.forEach((target) => target.ariaExpanded = true)

    this.menuTargets.forEach(target => {
      target.classList.remove(...this.hideClasses)
      target.classList.add(...this.showClasses)
    })
  }

  hide(event) {
    this.controlTargets.forEach((target) => target.ariaExpanded = false)
    
    this.menuTargets.forEach(target => {
      target.classList.remove(...this.showClasses)
      target.classList.add(...this.hideClasses)
    })
  }
}
