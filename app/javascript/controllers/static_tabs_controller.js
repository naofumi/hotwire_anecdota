import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="static-tabs"
export default class extends Controller {
  static values = {contentId: String}
  static targets = ["content", "switch", "mobileSelect"]

  connect() {
  }

  select(event) {
    this.contentIdValue = event.params.contentId
  }

  mobileSelect(event) {
    this.contentIdValue = event.currentTarget.value
  }

  contentIdValueChanged() {
    this.#render()
  }

  #render() {
    this.#renderSwitches()

    this.#renderMobileSelect()

    this.#renderContent()
  }

  #renderSwitches() {
    this.switchTargets.forEach(target => {
      if (target.dataset.staticTabsContentIdParam === this.contentIdValue) {
        this.#setSwitch(target)
      } else {
        this.#unsetSwitch(target)
      }
    })
  }

  #renderMobileSelect() {
    Array.from(this.mobileSelectTarget.options).forEach(target => {
      if (target.value === this.contentIdValue) {
        target.selected = true
      } else {
        target.selected = false
      }
    })
  }

  #renderContent() {
    this.contentTargets.forEach(target => {
      if (target.id === this.contentIdValue) {
        this.#showContent(target)
      } else {
        this.#hideContent(target)
      }
    })
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
