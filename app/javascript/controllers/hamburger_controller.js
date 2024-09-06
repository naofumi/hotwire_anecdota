import { Controller } from "@hotwired/stimulus"
import {classTokenize} from "../utlitilies";

// Connects to data-controller="hamburger"
export default class extends Controller {
  static targets = ["icon"]
  static values = {controls: String}

  connect() {
  }

  toggle(event) {
    this.#toggleAriaExpanded(event.currentTarget)

    this.#toggleMultiple(this.iconTargets, "hidden block")

    const menus = document.querySelectorAll(this.controlsValue)

    this.#toggleMultiple(menus, "hidden block")
  }

  #toggleAriaExpanded(element) {
    element.ariaExpanded = element.ariaExpanded == "true" ? "false" : "true"
  }

  #toggleMultiple(elements, classesString) {
    const classStrings = classTokenize(classesString)

    elements.forEach(element => {
      classStrings.forEach(classString => {
        element.classList.toggle(classString)
      })
    })
  }
}
