import { Controller } from "@hotwired/stimulus"


// Connects to data-controller="dropdown"
export default class DropdownController extends Controller {
  static targets = ["switch"]

  connect() {
  }

  show(event) {
    this.switchTargets.forEach((target) => target.ariaExpanded = true)
  }

  hide(event) {
    this.switchTargets.forEach((target) => target.ariaExpanded = false)
  }

  void(event) {}
}
