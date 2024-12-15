import React, {Fragment} from "react"

import {Button} from '@headlessui/react'
import clsx from 'clsx'

function ButtonExample() {
  return (
    <Button as={Fragment} type="submit">
      {({hover, active}) => (
        <button
          className={clsx(
            'rounded py-2 px-4 text-sm text-white',
            !hover && !active && 'bg-sky-600',
            hover && !active && 'bg-sky-500',
            active && 'bg-sky-700'
          )}
        >
          Save changes
        </button>
      )}
    </Button>
  )
}

export default function ButtonPage() {
  return <div className="container container-lg mx-auto px-4 pt-16">
    <div className="mx-auto min-w-[1028px] lg:max-w-5xl">
      <h1 className="text-5xl">Button Page</h1>
    </div>

    <div className="text-center mt-16">
      <ButtonExample />
    </div>
  </div>
}

