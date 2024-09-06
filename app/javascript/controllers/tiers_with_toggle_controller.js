import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="tiers-with-toggle"
export default class extends Controller {
  static values = {frequency: String, priceTable: Object}
  static targets = ["price", "frequency"]
  connect() {
    this.#updateFrequencyToggle()
  }

  setFrequency(event) {
    const frequency = event.params.frequency
    this.frequencyValue = frequency
    this.#updatePrices()
  }

  #updateFrequencyToggle() {
    document.querySelectorAll("input[type=radio][name=frequency]")
      .forEach(e=> {
        if (e.value === this.frequencyValue) {
          e.checked = true
        } else {
          e.checked = false
        }
      })
  }

  #updatePrices() {
    const priceTable = this.priceTableValue

    this.priceTargets.forEach(priceTarget => {
      debugger
      const plan = priceTarget.dataset.tierPlan
      priceTarget.textContent = priceTable[plan][this.frequencyValue]
    })
  }
}
