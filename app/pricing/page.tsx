import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Pricing() {
  return (
    <div className='mt-12 sm:mt-16 md:mt-20 px-4 sm:px-6 md:px-8 pb-8'>
        <h2 className='font-bold text-xl sm:text-2xl md:text-3xl my-4 sm:my-5 text-center'>
        AI Powered Trip Planner - Pick Your Plan
        </h2>
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto">
      <PricingTable/>
    </div>
    </div>
  )
}

export default Pricing