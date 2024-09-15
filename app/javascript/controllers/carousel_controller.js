import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="carousel"
export default class extends Controller {
  static targets = ["slide", "pagination"]
  static values = {
    currentSlide: {type: Number, default: 0},
    autoplay: {type: Boolean, default: true},
    interval: {type: Number, default: 4000},
  }
  #hideClasses;
  #paginationSelectedClasses;
  #paginationUnselectedClasses;

  connect() {
    if (this.autoplayValue) {
      this.slideInterval = setInterval(() => {
        this.#moveNext()
      }, this.intervalValue)
    }

    this.#hideClasses = ["invisible", "opacity-0"]
    this.#paginationSelectedClasses = ["opacity-100"]
    this.#paginationUnselectedClasses = ["opacity-50"]
  }

  disconnect() {
    this.#clearSlideInterval()
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

  #clearSlideInterval() {
    this.autoPlayValue = false
    if (this.slideInterval) {
      clearInterval(this.slideInterval)
    }
  }

  #render() {
    this.#renderSlide();
    this.#renderPagination();
  }

  #renderPagination() {
    this.paginationTargets.forEach((target, index) => {
      if (index === this.currentSlideValue) {
        target.classList.remove(...this.#paginationUnselectedClasses)
        target.classList.add(...this.#paginationSelectedClasses)
      } else {
        target.classList.remove(...this.#paginationUnselectedClasses)
        target.classList.add(...this.#paginationUnselectedClasses)
      }
    })
  }

  #renderSlide() {
    this.slideTargets.forEach((target, index) => {
      if (index === this.currentSlideValue) {
        target.classList.remove(...this.#hideClasses)
      } else {
        target.classList.add(...this.#hideClasses)
      }
    })
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
