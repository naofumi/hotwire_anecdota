import React from 'react';

export default function IphoneOption(
  {
    name, value, selected, title,
    subtitle = null, pricingLines, handleOptionChange
  }) {
  return (
    <label htmlFor={`${name}-${value}`}
           className="mt-4 flex justify-between items-center p-4 block border-2 rounded-lg w-full cursor-pointer has-[:checked]:border-blue-500">
      <input type="radio"
             id={`${name}-${value}`}
             name={name}
             value={value}
             checked={selected}
             onChange={() => handleOptionChange(value)}
             className="hidden" />
      <div>
        <div className="text-lg" dangerouslySetInnerHTML={{__html: title}}/>
        {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
      </div>
      <div>
        {pricingLines.map((line, i) => (
          <div key={i} className="text-xs text-gray-500 text-right" dangerouslySetInnerHTML={{__html: line}} />
        ))}
      </div>
    </label>
  )
}
