---
title: クライアントサイドバリデーション
layout: article
order: 90
published: true
descriptors:
  component_names:
    - クライアントサイドバリデーション
  server_request: true
  state_management:
    - HTML form
    - HTML input
    - HTML select
  technologies:
    - Stimulus
    - Turbo Drive 
  demo_urls:
    - ["クライアントサイドのデモ", "/memberships?variant=client_validation"]
    - ["サーバサイドのデモ", "/memberships?variant=server_validation"]
  related_pages:
    - /introduction/modern-browsers-and-react-relevance
---

バリデーションはUI/UXの良し悪しに大きな影響を与えます。ここではStimulusと[ブラウザネイティブのバリデーション](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation)を組み合わせた例を紹介します。ブラウザネイティブのバリデーションの**拡張性が高いこと**、また**かなり優れたUI/UXが実現できること**が確認できると思います。

ここで作るのは次のようなUIです。サーバサイドバリデーションだけのものと、それにクライアントサイドバリデーションを重ねた２つのデモを用意しています。

![Client Validation Video](content_images/client-validation.mov "mx-auto")

## クライアントサイドバリデーションの位置付け --- positioning-of-client-side-validation

バリデーションに大きく２つの役割があります。

* **ビジネスロジックに適合したデータのみが保存され**、サーバで不整合な処理が行われないことの保証。
* **ユーザに的確なエラーメッセージを表示**し、修正を手助けすること。

Ruby on Railsは双方の役割を果たす機能を従来から用意してきました。しかしブラウザネイティブのバリデーションが発展んしたため、サーバ側が親切なエラーメッセージ表示を表示する必然性はなくなりました。**サーバはデータの整合性に注力し、親切なエラーメッセージの表示はクライアントサイドに任せるという分業もできます**。ブラウザのバリデーションを迂回し、悪質なリクエストを投げてきたユーザにわざわざ親切なメッセージを返す必要はないという考え方です。

そうなると優れたUI/UXを提供するためのクライアントサイドバリデーションの役割がますます重要になってきます。

## 考えるポイント --- points-to-consider

* ブラウザネイティブのバリデーションでは[多くのバリデーションパターンが用意されていて](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation#using_built-in_form_validation)、HTMLで指定するだけで使用できます。
* デフォルトではバリデーションはフォーム送信直前に実行され、エラーのあったフィールドまでスクロールした上でフォーカスが移動し、エラーメッセージが表示されます。まだUI的に不十分な場合はJavaScript/CSSを書くことでエラー表示タイミングや表示方法をカスタマイズできます。(下記参照)
* エラーメッセージのカスタマイズもJavaScriptを書くことで可能です。(下記参照)

## コード --- code

* 今回のデモではJavaScriptの`Validator`クラスを書き、カスタマイズの冗長性をある程度減らしています。

```erb:app/views/memberships/_form.html+client_validation.erb
<!-- Stimulus controller (ValidatiorController)に接続しています -->
<%= form_with(model: membership, data: { controller: 'validator' }) do |form| %>
  <!-- ここはサーババリデーションのエラーを表示する箇所です -->
  <% if membership.errors.any? %>
    <div style="color: red">
      <h2><%= pluralize(membership.errors.count, "error") %> prohibited this membership from being saved:</h2>

      <ul>
        <% membership.errors.each do |error| %>
          <li><%= error.full_message %></li>
        <% end %>
      </ul>
    </div>
  <% end %>

  <div class="mt-4">
    <%= form.label :name, class: "form-label form-label--required" %>
    <%= form.text_field :name, class: "text-field", required: true,
                           # "input"イベントでvalidationを実行
                           # Target "name"としてのvalidationを行う。
                        data: { action: "input->validator#validate", validator_target: "name" } %>
    <!-- validationの結果を格納する -->
    <div class="error-message" data-validator-target="nameError"></div>
  </div>

  ...
  
  <div class="mt-8 flex justify-end">
    <%= form.submit class: "btn-primary" %>
  </div>
<% end %>
```

* 上記はフォームのコードです。Stimulus controller (ValidatorController)を使用してブラウザネイティブのclient-side form validation APIに接続します。
* `data-action`はバリデーション実行のタイミングを指示し、`data-validator-target`はエラーの表示箇所を指定しています。

```scss:app/assets/stylesheets/components/forms.css
.text-field {
    @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-600 focus:ring-orange-600;
    &:user-invalid {
        @apply !bg-red-500/10 !border-red-500 !border-2;
    }
    &:user-invalid + .error-message {
        @apply block
    }
}

.select-field {
    @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-600 focus:ring-orange-600;
    &:user-invalid {
        @apply !bg-red-500/10 !border-red-500 !border-2;
    }
    &:user-invalid + .error-message {
        @apply block
    }
}
```

* 上記は使用するCSSのコードです。
* `:user-invalid`および`:user-invalid + .error-message`でエラーメッセージを表示しています。
* `:user-invalid`はブラウザネイティブの機能ですがかなり高度な制御をしています。ユーザがバリデーションエラーを実際に起こしてしまうまではエラーを表示せず、エラーを起こした後に初めてエラーを表示します。エラーメッセージの鬱陶しさを最小限にコントロールしています。

```js:app/javascript/controllers/validator_controller.js
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
      //...
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
      //...
    ])
  }

  validate(event) {
    this.validator.validate()
  }
}
```

* 上記はStimulus controller (ValidatorController)のコードです。**カスタムバリデーションの要求が高ければ、各フォームごとに固有のStimulus controllerを書くことになるでしょう**。
* `new Validator`の箇所でバリデーションルールやカスタムメッセージを指定しています。
* `Validator`はバリデーションの冗長なコードをまとめたカスタムのJavaScriptクラスです(下記参照)

```js:app/javascript/utilities/validator.js
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
```

* バリデーションの冗長なコードをまとめたJavaScriptクラスです。**各フォーム共通になりますので、ライブラリ的に使用します**。
* `#validateField()`のところがネイティブのclient-side form validationのメインの部分です。
   * `target.validity.valid`でネイティブのバリデーションを実行します。
   * 必要であればカスタムのバリデーションメッセージ(`customMessages`)を適応します。
* ネイティブバリデーションが通過してもカスタムバリデーション(`customValidation`)を実行します。

## まとめ --- summary

* ブラウザの[client-side form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation#using_built-in_form_validation)でかなり良好なUI/UXが実現できます。下記の機能はブラウザがネイティブで提供しています。
   * フォーム送信直前にバリデーションエラーがあれば、エラーがあった最初のフィールドにスクロールし、フォーカスをあて、かつエラーメッセージを表示します。
   * 入力途中にエラーを表示する場合、ユーザにとって邪魔にならない適切なタイミングでエラーを表示します。これにはCSS擬似要素の`:user-invalid`を使用します。
* 多少の工夫をすれば、カスタムバリデーションやバリデーションメッセージも比較的簡素に指定できるようになります。
* ブラウザの[client-side form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation#using_built-in_form_validation)とDOM要素を接続する際、Stimulusはかなり便利です。
