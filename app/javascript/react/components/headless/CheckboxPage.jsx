import React, {Fragment, useState} from "react"
import clsx from 'clsx'
import {Checkbox, Field, Label} from '@headlessui/react'

function CheckboxExample() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Field className="flex items-center gap-2">
      <Checkbox checked={enabled} onChange={setEnabled} as={Fragment}>
        {({checked, disabled}) => (
          <span
            className={clsx(
              'block size-4 rounded border',
              !checked && 'bg-white',
              checked && !disabled && 'bg-blue-500',
              checked && disabled && 'bg-gray-500',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
          <svg className={clsx('stroke-white', checked
                                               ? 'opacity-100'
                                               : 'opacity-0')} viewBox="0 0 14 14" fill="none">
            <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        )}
      </Checkbox>
      <Label>Enable beta features</Label>
    </Field>
  )
}

export default function CheckboxPage() {
  return <div className="container container-lg mx-auto px-4 pt-16">
    <div className="mx-auto min-w-[1028px] lg:max-w-5xl">
      <h1 className="text-5xl">Checkbox Page</h1>
    </div>

    <div className="mx-auto mt-16 w-96">
      <CheckboxExample/>
    </div>
  </div>
}

