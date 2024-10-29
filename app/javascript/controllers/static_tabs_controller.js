import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="static-tabs"
export default class extends Controller {
  static targets = ["content", "switch"]

  connect() {
  }

  select(event) {
    this.#unsetSwitches()
    const target = event.currentTarget
    this.#setSwitch(target)

    this.#hideContents()
    const contentId = event.params.contentId
    const content = document.getElementById(contentId)
    this.#showContent(content)
  }

  mobileSelect(event) {
    this.#hideContents()
    const contentId = event.currentTarget.value
    const content = document.getElementById(contentId)
    this.#showContent(content)
  }
  
  #hideContents() {
    this.contentTargets.forEach((target) => this.#hideContent(target))
  }

  #unsetSwitches() {
    this.switchTargets.forEach(target => this.#unsetSwitch(target))
  }

  #hideContent(element) {
    element.classList.remove("block")
    element.classList.add("hidden")
  }

  #showContent(element) {
    element.classList.remove("hidden")
    element.classList.add("block")
  }

  #setSwitch(element) {
    element.classList.remove("border-transparent", "text-gray-500", "hover:border-gray-300","hover:text-gray-700")
    element.classList.add("border-indigo-500", "text-indigo-600")
    element.ariaCurrent="page"
  }

  #unsetSwitch(element) {
    element.classList.remove("border-indigo-500", "text-indigo-600")
    element.classList.add("border-transparent", "text-gray-500", "hover:border-gray-300","hover:text-gray-700")
    element.ariaCurrent="false"
  }
}
