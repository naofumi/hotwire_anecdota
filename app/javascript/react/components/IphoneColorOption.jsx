import React from 'react';

export default function IphoneColorOption({value, color, selected, handleColorChange}) {
  return (
    <label htmlFor={`${color}-${value}`}
           className={`${color} inline-block w-8 h-8 mr-1 border-2 rounded-full cursor-pointer outline-2 outline outline-offset-0.5 outline-transparent has-[:checked]:outline-blue-500`}>
      <input type="radio"
             id={`${color}-${value}`}
             name="color"
             value={value}
             checked={selected}
             onChange={() => handleColorChange(value)}
             className="hidden"/>
      &nbsp;
    </label>
  )
}
