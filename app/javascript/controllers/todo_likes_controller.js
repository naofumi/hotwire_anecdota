import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="todo-likes"
export default class extends Controller {
  static targets = ["count", "checkbox"]

  connect() {
  }

  optimistic(event) {
    let count = this.countTarget.textContent
    if (this.checkboxTarget.checked) {
      count++
    } else {
      count--
    }
    this.countTarget.textContent = count
  }

  submit(event) {
    event.currentTarget.form.requestSubmit()
  }
}
