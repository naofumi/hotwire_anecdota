import {Controller} from "@hotwired/stimulus"
import {setRadioGroup} from "../utlitilies";

// Connects to data-controller="tiers-with-toggle"
export default class extends Controller {
  static values = {frequency: String, priceTable: Object}
  static targets = ["price", "frequency"]

  connect() {
    setRadioGroup("frequency", this.frequencyValue)
  }

  setFrequency(event) {
    this.frequencyValue = event.params.frequency
    this.#render()
  }

  #render() {
    this.#updatePrices()
  }

  #updatePrices() {
    const priceTable = this.priceTableValue

    this.priceTargets.forEach(priceTarget => {
      const plan = priceTarget.dataset.tierPlan
      priceTarget.textContent = priceTable[plan][this.frequencyValue]
    })
  }
}
