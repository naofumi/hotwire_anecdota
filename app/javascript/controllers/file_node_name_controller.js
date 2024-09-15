import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="file-node-name"
export default class extends Controller {
  static targets = ["detail", "input"]

  connect() {
  }

  submit(event) {
    event.currentTarget.form.requestSubmit()
  }

  reset(event) {
    event.currentTarget.form.reset()
    this.submit(event)
  }

  selectInput(event) {
    this.hasInputTarget && this.inputTarget.select()
  }
}
