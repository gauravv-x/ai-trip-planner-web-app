'use client'

import React, { useEffect, useState } from 'react';
import Chatbox from './_components/Chatbox'
import Itinerary from './_components/Itinerary'
import GlobleMap from './_components/GlobleMap';
import { useTripDetail } from "../provider";
import { Button } from '@/components/ui/button';
import { Globe2, Plane } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
 

function CreateNewTrip() {
  //@ts-ignore
  const {tripDetailInfo ,setTripDetailInfo}= useTripDetail();
  const [activeIndex,setActiveIndex]= useState(1);
  
  useEffect(()=>{
      setTripDetailInfo(null);
},[])


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 p-4 sm:p-6 md:p-8 lg:p-10">
  {/* Left Panel (Chatbox) */}
  <div className="order-2 md:order-1">
    <Chatbox />
  </div>

  {/* Right Panel (Itinerary / Map) */}
  <div className="relative order-1 md:order-2 col-span-1 md:col-span-2 min-h-[350px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[650px] rounded-xl md:rounded-2xl overflow-hidden">
    {activeIndex === 0 ? <Itinerary /> : <GlobleMap />}

    {/* Floating Toggle Button */}
    <Tooltip>
      <TooltipTrigger className="absolute bottom-5 sm:bottom-7 md:bottom-10 left-1/2 -translate-x-1/2 z-20">
        <Button
          size="default"
          onClick={() => setActiveIndex(activeIndex === 0 ? 1 : 0)}
          className="bg-black hover:bg-gray-800 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 flex items-center justify-center rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          <span className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white">
            {activeIndex === 0 ? <Plane /> : <Globe2 />}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs sm:text-sm">
        Switch Between Map and Trip
      </TooltipContent>
    </Tooltip>
  </div>
</div>
  );
}

export default CreateNewTrip