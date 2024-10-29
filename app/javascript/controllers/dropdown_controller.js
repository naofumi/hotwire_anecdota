import { Controller } from "@hotwired/stimulus"


// Connects to data-controller="dropdown"
export default class DropdownController extends Controller {
  static targets = ["switch", "menu"]
  static classes = ["show", "hide"]

  connect() {
  }

  show(event) {
    this.#setSwitchTargets({ariaExpandedValue: true})
    this.#showMenuTargets()
  }

  hide(event) {
    this.#setSwitchTargets({ariaExpandedValue: false})
    this.#hideMenuTargets()
  }

  #setSwitchTargets({ariaExpandedValue}) {
    this.switchTargets.forEach((target) => target.ariaExpanded = ariaExpandedValue)
  }

  #showMenuTargets() {
    this.menuTargets.forEach(target => {
      target.classList.remove(...this.hideClasses)
      target.classList.add(...this.showClasses)
    })
  }

  #hideMenuTargets() {
    this.menuTargets.forEach(target => {
      target.classList.remove(...this.showClasses)
      target.classList.add(...this.hideClasses)
    })
  }
}
