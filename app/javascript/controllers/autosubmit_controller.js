import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="autosubmit"
export default class extends Controller {
  connect() {
    this.form = this.element
  }

  submit() {
    this.form.requestSubmit()
  }
}
