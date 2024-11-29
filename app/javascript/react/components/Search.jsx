import React from "react"

export default function Search({query, setQuery, loading}) {
  return <div className="max-w-72 mx-auto mb-10">
    <div className="group" aria-busy={loading}>
      <div className="mt-2">
        <input type="search"
               className="group-aria-busy:bg-[url('/Rolling@1x-1.4s-200px-200px.svg')] bg-contain bg-no-repeat bg-[left_0_top_0]
      block w-full rounded-full border-0 pr-4 pl-10 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
      placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm/6"
               value={query}
               onChange={e => setQuery(e.target.value)}
               placeholder="検索" />
      </div>
    </div>
  </div>
}
