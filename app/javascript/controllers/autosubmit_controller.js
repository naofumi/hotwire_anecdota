import {Controller} from "@hotwired/stimulus"
import {debounce} from "../utilities/utilities"

// Connects to data-controller="autosubmit"
export default class extends Controller {
  static values = {wait: {type: Number, default: 300}}

  connect() {
    this.form = this.element
  }

  submit() {
    this.form.requestSubmit()
  }

  submitWithDebounce() {
    debounce(() => this.submit(), this.waitValue)()
  }
}

