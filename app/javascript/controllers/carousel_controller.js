import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="carousel"
export default class extends Controller {
  static targets = ["slide", "pagination"]
  static values = {
    currentSlide: {type: Number, default: 0},
    autoplay: {type: Boolean, default: true}
  }

  connect() {
    if (this.autoplayValue) {
      this.slideInterval = setInterval(() => {
        this.#moveNext()
      }, 2000)
    }
  }

  disconnect() {
    this.#clearSlideInterval()
  }

  #clearSlideInterval() {
    this.autoPlayValue = false
    if (this.slideInterval) {
      clearInterval(this.slideInterval)
    }
  }

  #render() {
    this.slideTargets.forEach((target, index) => {
      if (index === this.currentSlideValue) {
        target.classList.remove("invisible", "opacity-0")
      } else {
        target.classList.add("invisible", "opacity-0")
      }
    })
    this.paginationTargets.forEach((target,index) => {
      if (index === this.currentSlideValue) {
        target.classList.remove("opacity-50")
        target.classList.add("opacity-100")
      } else {
        target.classList.remove("opacity-100")
        target.classList.add("opacity-50")

      }
    })
  }

  move(event) {
    const moveToIndex = event.params.index
    this.currentSlideValue = moveToIndex
    this.#render()
    this.#clearSlideInterval()
  }

  next() {
    this.#moveNext()
    this.#clearSlideInterval()
  }

  previous() {
    this.#movePrevious();
    this.#clearSlideInterval()
  }

  get slideCount() {
    return this.slideTargets.length
  }

  #moveNext() {
    if (this.currentSlideValue + 1 < this.slideCount) {
      this.currentSlideValue = this.currentSlideValue + 1
    } else {
      this.currentSlideValue = 0
    }
    this.#render()
  }

  #movePrevious() {
    if (this.currentSlideValue - 1 >= 0) {
      this.currentSlideValue = this.currentSlideValue - 1
    } else {
      this.currentSlideValue = this.slideCount - 1
    }
    this.#render()
  }

}
