import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="variants-selector"
export default class extends Controller {
  connect() {
  }

  submit(event) {
    event.currentTarget.form.requestSubmit()
  }
}
