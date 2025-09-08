import React from 'react'
import Chatbox from './_components/Chatbox'
import Itinerary from './_components/Itinerary'

 

function CreateNewTrip() {
  return (
    <div className='grid grid-col-1 md:grid-cols-3 gap-5 p-10'>
        <div>
                <Chatbox />
        </div>
        <div className='col-span-2'>
              <Itinerary />
        </div>
    </div>
  )
}

export default CreateNewTrip