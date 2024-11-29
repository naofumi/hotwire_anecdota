import {Controller} from "@hotwired/stimulus"
import Chart from "chart.js/auto"

// Connects to data-controller="chartjs"
export default class extends Controller {
  static values = {
    data: {type: Array, default: []},
    label: String
  }
  static targets = ["chart"]

  connect() {
  }

  disconnect() {
    this.chart?.destroy()
  }

  changeBar(event) {
    const value = event.currentTarget.value
    const barIndex = Number(event.params.bar)
    const newDataValue = [...this.dataValue]
    newDataValue[barIndex] = {year: 2010 + barIndex, count: value}

    // We create a new dataValue object and use the
    // `this.dataValue` setter to update the value.
    // This is to trigger the `this.dataValueChange()` callback.
    // It is unnecessary if you call `this.#render()` directly
    // in this function.
    this.dataValue = newDataValue
  }

  dataValueChanged() {
    this.#render()
  }

  #render() {
    this.#renderChart()
  }

  #renderChart() {
    const data = this.dataValue
    if (this.chart) {
      this.chart.data = this.#data()
      this.chart.update()
    } else {
      this.chart = new Chart(
        this.chartTarget,
        {
          type: 'bar',
          data: this.#data()
        }
      );
    }
  }

  #data() {
    return {
      labels: this.dataValue.map(row => row.year),
      datasets: [
        {
          label: this.labelValue,
          data: this.dataValue.map(row => row.count)
        }
      ]
    }
  }
}
