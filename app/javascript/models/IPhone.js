export default class IPhone {
  static DEFAULT_MODEL = "6-1inch"
  static DEFAULT_COLOR = "naturaltitanium"
  static DEFAULT_RAM = "256GB"

  constructor(iphoneObject, data) {
    this.model = iphoneObject.model
    this.color = iphoneObject.color
    this.ram = iphoneObject.ram
    this.data = data
  }

  state() {
    if (this.ram) {
      return "ram_entered"
    } else if (this.color) {
      return "color_entered"
    } else if (this.model) {
      return "model_entered"
    } else {
      return "nothing_entered"
    }
  }

  canEnterModel() {
    return true
  }

  canEnterColor() {
    return ["model_entered", "color_entered", "ram_entered"].includes(this.state())
  }

  canEnterRam() {
    return ["color_entered", "ram_entered"].includes(this.state())
  }

  imagePath() {
    const imageLabel = `${this.model || IPhone.DEFAULT_MODEL}-${this.color || IPhone.DEFAULT_COLOR}`
    return this.data.images[imageLabel]
  }

  fullColorName() {
    return this.data.colors[this.color || IPhone.DEFAULT_COLOR].full_name
  }

  price() {
    const modelPrice = this.data.prices.model[this.model || IPhone.DEFAULT_MODEL]
    const ramPrice = this.data.prices.ram[this.ram || IPhone.DEFAULT_RAM]
    return {lump: modelPrice.lump + ramPrice.lump, monthly: modelPrice.monthly + ramPrice.monthly}
  }

  pricingFor(model, ram) {
    model = model || IPhone.DEFAULT_MODEL
    ram = ram || IPhone.DEFAULT_RAM
    return {
      lump: this.data.prices.model[model].lump + this.data.prices.ram[ram].lump,
      monthly: this.data.prices.model[model].monthly + this.data.prices.ram[ram].monthly,
    }
  }
}
