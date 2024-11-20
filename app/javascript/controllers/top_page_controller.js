import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="top-page"
export default class extends Controller {
  static targets = ["section"]

  connect() {
    this.sectionObserver =
      new IntersectionObserver(entries => {
        this.#renderSection(entries)
      })
    this.sectionTargets
      .forEach(target => this.sectionObserver.observe(target))
  }

  disconnect() {
    this.sectionObserver.disconnect()
  }

  #renderSection(entries) {
    const keyframes = {
      opacity: [0,1],
      translate: ["50px 0", 0],
    }
    entries.forEach((entry) => this.#intersectedAtScreenBottom(entry) && entry.target.animate(keyframes, 300))
  }

  #intersectedAtScreenBottom(entry) {
    if (!entry.isIntersecting) { return false }
    // Do not animate sections that are already visible on the page load.
    if (entry.intersectionRatio > 0.1) { return false }

    return entry.intersectionRect.top !== 0
  }
}
