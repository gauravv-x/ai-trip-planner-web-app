import { Button } from '@/components/ui/button'
import { Globe2 } from 'lucide-react'
import React from 'react'

function FinalUI({ viewTrip, disable}: any) {
    return (
        <div className="flex flex-col items-center justify-center mt-4 sm:mt-6 p-4 sm:p-6 bg-white rounded-lg">
            
            <Globe2 className="text-primary text-3xl sm:text-4xl animate-bounce" />
            
            <h2 className="mt-2 sm:mt-3 text-base sm:text-lg font-semibold text-primary text-center">
                ✈️ Planning your dream trip...
            </h2>
            
            <p className="text-gray-500 text-xs sm:text-sm text-center mt-1 px-2">
                Gathering best destinations, activities, and travel details for you.
            </p>

            <Button disabled={disable} onClick={viewTrip} className="mt-3 sm:mt-4 w-full text-sm sm:text-base">View Trip</Button>
            
            {/* Loading Bar */}
            {/* <div className="w-48 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
                <div className="h-2 bg-primary animate-pulse w-3/4"></div>
            </div> */}

        </div>
    )
}

export {FinalUI};