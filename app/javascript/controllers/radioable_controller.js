import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="radioable"
export default class extends Controller {
  static values = {
    selected: {type: Boolean, default: false}
  }
  static outlets = ["radioable"]

  connect() {
  }

  select(event) {
    if (this.selectedValue) { return }

    this.radioableOutlets.forEach(element => {
      if (element !== this.element) { element.unselect() }
    })

    this.selectedValue = true
  }

  unselect(event) {
    console.log("unselect")
    this.selectedValue = false
  }
}
