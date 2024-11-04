import React from "react"

export default function Greeting({message}) {
  return (
    <div className="p-2 rounded border-2 border-dashed">
      <h1 className="text-3xl">{message}</h1>
    </div>
  )
}
