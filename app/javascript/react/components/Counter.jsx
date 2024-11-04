import React, {useState} from "react"

export default function Counter({initialValue}) {
  const [count, setCount] = useState(initialValue);
  function handleSetCount(newCount) {
    setCount(newCount)
  }

  return(
    <div className="p-2 rounded border-2 border-dashed">
      <div className="text-3xl">Counter: {count}</div>
      <button
        className="w-16 bg-orange-600 border rounded p-1 text-white"
        onClick={e => handleSetCount(count + 1)}>Up</button>
      <button
        className="w-16 ml-1 bg-orange-600 border rounded p-1 text-white"
        onClick={e => handleSetCount(count - 1)}>Down</button>
    </div>
  )
}
