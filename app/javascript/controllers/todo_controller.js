import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="todo"
export default class extends Controller {
  connect() {
  }

  delete(event) {
    const row = document.getElementById(event.params.id)
    const element = row.querySelector("td > div")
    element.classList.remove('opacity-100')
    element.classList.add("transition-all", "duration-200", 'opacity-0')
  }
}
