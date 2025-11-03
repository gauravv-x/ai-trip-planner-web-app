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
    <div className="grid grid-col-1 md:grid-cols-3 gap-5 p-10">
      <div>
        <Chatbox />
      </div>
      <div className="col-span-2 relative">
        {activeIndex == 0 ? <Itinerary /> : <GlobleMap />}
        <Tooltip>
          <TooltipTrigger className="absolute bg-black bottom-10 left-[50%] rounded-2xl">
            <Button
              size={"lg"}
              onClick={() => setActiveIndex(activeIndex == 0 ? 1 : 0)}
              className='bg-black hover:bg-gray-700'
            >
              {activeIndex == 0 ? <Plane /> : <Globe2 />}
            </Button></TooltipTrigger>
          <TooltipContent>
            Get Switch Between Map to Trip
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default CreateNewTrip