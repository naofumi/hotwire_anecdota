import {Controller} from "@hotwired/stimulus"
import {Validator} from "../utilities/validator"

// Connects to data-controller="validator"
export default class extends Controller {
  static targets = [
    'name', 'nameError',
    'email', 'emailError',
    'membershipType', 'membershipTypeError',
    'validFrom', 'validFromError',
    'validTo', 'validToError',
    'companyName', 'companyNameError'
  ]

  connect() {
    this.validator = new Validator([
      {
        target: this.nameTarget,
        errorBox: this.nameErrorTarget,
        customMessages: {valueMissing: "名前を入力してください"},
        customValidation: (target) => {
          if (target.value.length < 3) {
            target.setCustomValidity("名前は3文字以上で入力してください。")
          }
        }
      },
      {
        target: this.emailTarget,
        errorBox: this.emailErrorTarget,
      },
      {
        target: this.membershipTypeTarget,
        errorBox: this.membershipTypeErrorTarget,
        customValidation: (target) => {
          if (target.value === 'company' && this.companyNameTarget.value.length < 1) {
            target.setCustomValidity("会員が会社タイプの場合は下記の会社名を入力してください。")
          }
        }
      },
      {
        target: this.validFromTarget,
        errorBox: this.validFromErrorTarget,
        customValidation: (target) => {
          if (!target.value || !this.validToTarget.value) return

          if (new Date(target.value) > new Date(this.validToTarget.value)) {
            target.setCustomValidity("開始時期は終了時期より前でなければなりません。")
          }
        }
      },
      {
        target: this.validToTarget,
        errorBox: this.validToErrorTarget,
        customValidation: (target) => {
          if (!this.validFromTarget.value || !target.value) return

          if (new Date(this.validFromTarget.value) > new Date(target.value)) {
            target.setCustomValidity("終了時期は開始時期より後でなければなりません。")
          }
        }
      },
      {
        target: this.companyNameTarget,
        errorBox: this.companyNameErrorTarget,
        customValidation: (target) => {
          if (this.membershipTypeTarget.value === 'company' && target.value.length < 1) {
            target.setCustomValidity("会員が会社タイプの場合は会社名を入力してください。")
          }
        }
      },
    ])
  }

  validate(event) {
    this.validator.validate()
  }
}
