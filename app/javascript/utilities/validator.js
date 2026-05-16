// See validator_controller.js for usage example
export class Validator {
  constructor(validatables) {
    this.validatables = validatables
  }

  validate() {
    this.#clearErrors()

    // Run custom validations or validations
    this.validatables.forEach(validatable => {
      this.#validateField(validatable)
    })

    this.#updateErrorMessages()
  }

  #updateErrorMessages() {
    Object.values(this.validatables).forEach(validatable => {
      if (!validatable.errorBox) {
        throw new Error("errorBox is not defined ", validatable)
      }
      validatable.errorBox.textContent = validatable.target.validationMessage
    })
  }

  #clearErrors() {
    Object.values(this.validatables).forEach(validatable => {
      if (!validatable.target) {
        throw new Error("Target is not defined")
      }
      validatable.target.setCustomValidity("")
    })
  }

  #validateField(validationConfig) {
    const target = validationConfig.target
    if (!target) {
      throw new Error("Target is not defined")
    }
    const customMessages = validationConfig.customMessages
    const customValidation = validationConfig.customValidation

    // First run native validations
    if (!target.validity.valid) {
      // Customize validation messages here.
      if (customMessages) {
        Object.keys(customMessages).forEach(key => {
          if (target.validity[key]) {
            target.setCustomValidity(customMessages[key])
          }
        })
      }
    } else {
      // If native validation passes, run custom validations
      if (customValidation) {
        customValidation(target)
      }
    }
  }
}
