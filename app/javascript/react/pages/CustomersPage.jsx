import React, {useEffect, useState} from "react"
import Search from "../components/Search"

function fetchJsonWithAbort(url, callback) {
  const abortController = new AbortController()

  fetch(url, {
    headers: {"Accept": "application/json"},
    signal: abortController.signal
  })
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => console.log(err))

  return abortController
}

function useServerData(url, initialData) {
  const [serverData, setServerData] = useState(initialData)
  const [loading, setLoading] = useState(false)

  function reloadData() {
    setLoading(true)
    fetchJsonWithAbort(url, (json) => {
      setServerData(json)
      setLoading(false)
    })
  }

  useEffect(() => {
    setLoading(true)
    const abortController = fetchJsonWithAbort(url, (json) => {
      setServerData(json)
      setLoading(false)
    })
    return () => {
      abortController.abort()
    }
  }, [url])

  return [serverData, loading, reloadData]
}

export default function CustomersPage() {
  const [query, setQuery] = useState("")
  const [customers, loading, reloadData] = useServerData(`/customers?query=${query}`, [])

  function navigateTo(customer) {
    document.location.href = `/customers/${customer.id}/edit?redirect_to=/react/customers`
  }

  return <div className="max-w-lg mx-auto">
    <div className="mb-16">
      <h1 className="text-4xl text-center">Customers React</h1>
    </div>

    <Search query={query} setQuery={setQuery} loading={loading}/>

    <div className="text-right">
      <button onClick={reloadData} type="button" className="btn-primary">Reload</button>
    </div>

    <table className="table table-striped w-full">
      <thead>
      <tr className="border-b-2 border-gray-900">
        <th className="p-2 text-left">Name</th>
        <th className="p-2 text-left">JP Name</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      {customers.map((customer, i) => (
        <tr key={i} className="group border-t border-gray-400 [:first-child]:border-none">
          <td className="p-2">
            {customer.name}
          </td>
          <td className="p-2">
            {customer.jp_name}
          </td>
          <td className="p-2">
            <button onClick={() => navigateTo(customer)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                   stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
              </svg>
            </button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  </div>
}


