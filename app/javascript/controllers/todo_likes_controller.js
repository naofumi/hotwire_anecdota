import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="todo-likes"
export default class extends Controller {
  static values = {liked: Boolean}
  static targets = ["liked", "unliked", "count"]

  connect() {
  }

  likedValueChanged() {
    this.#render()
  }

  likeOptimistic(event) {
    this.likedValue = true
    this.countTarget.textContent = this.#countAsInt() + 1
  }

  unlikeOptimistic(event) {
    this.likedValue = false
    this.countTarget.textContent = this.#countAsInt() - 1
  }

  #countAsInt() {
    return parseInt(this.countTarget.textContent)
  }

  #render() {
    if (this.likedValue) {
      this.likedTarget.classList.remove("hidden")
      this.unlikedTarget.classList.add("hidden")
    } else {
      this.likedTarget.classList.add("hidden")
      this.unlikedTarget.classList.remove("hidden")
    }
  }
}
