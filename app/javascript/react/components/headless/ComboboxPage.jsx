import React, {Fragment, useState} from "react"

import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
]

function ComboboxExample() {
  const [selectedPerson, setSelectedPerson] = useState(people[0])
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
    ? people
    : people.filter((person) => {
      return person.name.toLowerCase().includes(query.toLowerCase())
    })

  return (
    <Combobox immediate value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
      <ComboboxInput
        aria-label="Assignee"
        displayValue={(person) => person?.name}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ComboboxOptions anchor="bottom" className="w-52 border empty:invisible">
        {filteredPeople.map((person) => (
          <ComboboxOption as={Fragment} key={person.id} value={person} className="data-[focus]:bg-blue-100">
            {({ focus, selected }) => (
              <div className={clsx('group flex gap-2', focus && 'bg-blue-100')}>
                {selected && <CheckIcon className="size-5" />}
                {person.name}
              </div>
            )}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}

export default function ComboboxPage() {
  return <div className="container container-lg mx-auto px-4 pt-16">
    <div className="mx-auto min-w-[1028px] lg:max-w-5xl">
      <h1 className="text-5xl">Combobox Page</h1>
    </div>

    <div className="mx-auto mt-16 w-96">
      <ComboboxExample/>
    </div>
  </div>
}

