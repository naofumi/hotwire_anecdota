import React from 'react'
import {csrfToken} from "../../utilities/csrf"

export default function VariantsSelector({availableVariants, selectedVariant}) {
  function handleVariantChange(selectedVariant) {
    const {param, token} = csrfToken()
    fetch("/variants", {
      method: "PUT",
      headers: {"x-csrf-token": token, "Content-Type": "application/json"},
      body: JSON.stringify({variant: {name: selectedVariant}, [param]: token})
    }).then(res => window.location.reload())
  }

  return (
    <div className="text-center mt-4" data-controller="variants-selector">
      <form className="flex flex-col items-center">
        <label htmlFor="variants-selector" className="text-xs font-bold mb-1">
          variantを選択
        </label>
        <select
          defaultValue={selectedVariant}
          className="w-44 text-sm border border-gray-400 rounded-lg p-1"
          onChange={e => handleVariantChange(e.currentTarget.value)}
        >
          {availableVariants.map(variant => (
            <option key={variant} value={variant}>
              {variant}
            </option>
          ))}
        </select>
      </form>
    </div>
  )
}
