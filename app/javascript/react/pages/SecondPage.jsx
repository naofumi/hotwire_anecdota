import React from "react"

export default function SecondPage() {
  return <div className="container container-lg mx-auto px-4 pt-16">
    <div className="mx-auto min-w-[1028px] lg:max-w-5xl">
      <h1 className="text-5xl">Second React Page</h1>
      <a href="/react/toggle" className="underline text-orange-600">GOTO First page</a>
    </div>
  </div>
}
