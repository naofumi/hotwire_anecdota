export default class IPhone {
  constructor(iphoneObject, data) {
    this.model = iphoneObject.model
    this.color = iphoneObject.color
    this.ram = iphoneObject.ram
    this.data = data
  }

  imagePath() {
    return this.data.images[`${this.model}-${this.color}`]
  }

  fullColorName() {
    return this.data.colors[this.color].full_name
  }

  price() {
    const modelPrice = this.data.prices.model[this.model]
    const ramPrice = this.data.prices.ram[this.ram]
    return {lump: modelPrice.lump + ramPrice.lump, monthly: modelPrice.monthly + ramPrice.monthly}
  }

  pricingFor(model = "6-1inch", ram = "256GB") {
    return {
      lump: this.data.prices.model[model].lump + this.data.prices.ram[ram].lump,
      monthly: this.data.prices.model[model].monthly + this.data.prices.ram[ram].monthly,
    }
  }
}
