import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="combobox"
export default class extends Controller {
  static targets = ["input", "options", "option"]
  static values = {
    options: {type: Array, default: []},
    query: {type: String, default: ""},
    selectedId: {type: String, default: null},
    opened: {type: Boolean, default: false},
    cursor: {type: String, default: null},
  }

  connect() {
  }

  setQuery(event) {
    this.queryValue = event.currentTarget.value
    if (!this.queryValue) { this.selectedIdValue = "" }
    this.openedValue = true
  }

  showListBox(event) {
    this.openedValue = true
  }

  hideListBox(event) {
    this.#resetInputToSelected()
    this.openedValue = false
  }

  selectOption(event) {
    this.selectedIdValue = event.params.value
    this.inputTarget.value = this.#findOptionById(this.selectedIdValue).title
    this.openedValue = false
  }

  moveDown() {
    const nextOption = this.#findNextOptionById(this.cursorValue)
    if (nextOption) {
      this.cursorValue = nextOption.id.toString()
    } else {
      this.cursorValue = this.#filteredOptions().at(0).id
    }
  }

  moveUp() {
    const previousOption = this.#findPreviousOptionById(this.cursorValue)
    if (previousOption) {
      this.cursorValue = previousOption.id.toString()
    } else {
      this.cursorValue = this.#filteredOptions().at(-1).id
    }
  }

  selectCurrent(event) {
    this.selectedIdValue = this.cursorValue
    this.inputTarget.value = this.#findOptionById(this.selectedIdValue).title
    this.openedValue = false
  }

  focus(event) {
    const id = event.currentTarget.dataset.comboboxValueParam
    this.cursorValue = id
  }

  queryValueChanged() {
    this.#renderListBox()
    this.#renderOptions()
  }

  cursorValueChanged() {
    this.#renderOptions()
  }

  selectedIdValueChanged() {
    this.#renderOptions()
  }

  #filteredOptions() {
    return (this.queryValue === ''
            ? this.optionsValue
            : this.optionsValue.filter((option) => {
        return option.title.toLowerCase().includes(this.queryValue.toLowerCase())
      }))
  }

  #findOptionById(id) {
    return this.#filteredOptions().find((option) => option.id === parseInt(id))
  }

  #findNextOptionById(id) {
    const ids = this.#filteredOptions().map((p) => p.id)
    const index = ids.indexOf(parseInt(id))
    return this.#filteredOptions()[index + 1]
  }

  #findPreviousOptionById(id) {
    const ids = this.#filteredOptions().map((p) => p.id)
    const index = ids.indexOf(parseInt(id))
    return this.#filteredOptions()[index - 1]
  }

  #resetInputToSelected() {
    if (this.selectedIdValue) {
      this.inputTarget.value = this.#findOptionById(this.selectedIdValue).title
    } else {
      this.inputTarget.value = ""
    }
  }

  #render() {
    this.#renderListBox()
    this.#renderOptions()
  }

  #renderListBox() {
    const fragment = document.createDocumentFragment()
    this.#filteredOptions().forEach((option) => {
      const row = this.element.querySelector(".combobox-row").content.cloneNode(true).children[0]
      row.dataset.comboboxValueParam = option.id
      row.textContent = option.title
      fragment.appendChild(row)
    })
    this.optionsTarget.replaceChildren()
    this.optionsTarget.appendChild(fragment)
  }

  #renderOptions() {
    this.optionTargets.forEach((target) => {
      const value = target.dataset.comboboxValueParam
      target.dataset.selected = value === this.selectedIdValue ? "true" : "false"
      target.dataset.focus = value === this.cursorValue ? "true" : "false"
    })
  }
}
