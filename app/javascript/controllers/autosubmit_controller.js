import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="autosubmit"
export default class extends Controller {
  static values = {wait: {type: Number, default: 300}}

  connect() {
    this.form = this.element
    this.timeoutId = null
  }

  submit() {
    this.form.requestSubmit()
  }

  submitWithDebounce() {
    console.log("submitWithDebounce")
    clearTimeout(this.timeoutId)
    this.timeoutId = setTimeout(() => this.submit(), this.waitValue)
  }
}

