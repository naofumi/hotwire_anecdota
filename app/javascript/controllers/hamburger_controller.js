import { Controller } from "@hotwired/stimulus"
import {classTokenize} from "../utlitilies";

// Connects to data-controller="hamburger"
export default class extends Controller {
  static targets = ["icon", "menu"]

  connect() {
  }

  toggle(event) {
    this.#toggleAriaExpanded(event.currentTarget)

    this.#toggleMultiple(this.iconTargets, ["hidden", "block"])

    this.#toggleMultiple(this.menuTargets, ["hidden", "block"])
  }

  #toggleAriaExpanded(element) {
    element.ariaExpanded = element.ariaExpanded == "true" ? "false" : "true"
  }

  #toggleMultiple(elements, classes) {
    elements.forEach(element => {
      classes.forEach(classToken => {
        element.classList.toggle(classToken)
      })
    })
  }
}
