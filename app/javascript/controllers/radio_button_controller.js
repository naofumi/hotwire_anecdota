import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="radio-button"
export default class extends Controller {
  static values = {
    selected: {type: Boolean, default: false}
  }
  static outlets = ["radio-button"]

  connect() {
  }

  select(event) {
    if (this.selectedValue) { return }

    this.radioButtonOutlets.forEach(element => {
      if (element !== this.element) { element.unselect() }
    })

    this.selectedValue = true
  }

  unselect(event) {
    this.selectedValue = false
  }
}
