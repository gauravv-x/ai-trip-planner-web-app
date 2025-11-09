"use client"
import { Button } from '@/components/ui/button';
import { Clock, ExternalLink, Ticket } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Activity } from './Chatbox';
import axios from 'axios';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props={
    activity:Activity
}

function PlaceCardItem({activity}:Props) {
  const[photoUrl,setPhotoUrl]= useState<string>();

  useEffect(()=>{
    activity&&GetGooglePlaceDetail();   
  },[activity])

  const GetGooglePlaceDetail =async()  =>{
    const result = await axios.post('/api/google-place-detail/', {
        placeName: activity?.place_name+":"+ activity?.place_address
    });
    if(result?.data.e)
    {
      return;
    }
    setPhotoUrl(result?.data);


  }
  return (
    <div className="flex flex-col gap-2 sm:gap-3 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Image src={photoUrl?photoUrl:"/placeholder.jpg"}
        width={400}
        height={200}
        alt={activity?.place_name}
        className="object-cover h-[150px] sm:h-[180px] md:h-[200px] w-full"
      />
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex flex-col gap-2">
        <h2 className="font-semibold text-base sm:text-lg line-clamp-2 leading-tight">{activity?.place_name}</h2>
        <p className="text-gray-600 line-clamp-2 text-xs sm:text-sm leading-relaxed">{activity?.place_details}</p>
        
        {/* Ticket and Time Information - Improved Layout with Tooltips */}
        <TooltipProvider>
          <div className="flex flex-wrap gap-2 mt-1">
            {/* Ticket Pricing - Badge Style with Tooltip */}
            {activity?.ticket_pricing && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-start gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-md border border-blue-200 flex-1 min-w-[140px] cursor-help hover:bg-blue-100 transition-colors">
                    <Ticket className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-blue-600 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium break-words line-clamp-2 flex-1">
                      {activity.ticket_pricing}
                    </span>
                  </div>
                </TooltipTrigger>
                {activity.ticket_pricing.length > 35 && (
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">{activity.ticket_pricing}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )}
            
            {/* Best Time - Badge Style with Tooltip */}
            {activity?.best_time_to_visit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-start gap-1.5 bg-orange-50 text-orange-700 px-2.5 py-1.5 rounded-md border border-orange-200 flex-1 min-w-[140px] cursor-help hover:bg-orange-100 transition-colors">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-orange-600 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium break-words line-clamp-2 flex-1">
                      {activity.best_time_to_visit}
                    </span>
                  </div>
                </TooltipTrigger>
                {activity.best_time_to_visit.length > 30 && (
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">{activity.best_time_to_visit}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )}
          </div>
        </TooltipProvider>

        {/* Additional Info - Travel Time */}
        {activity?.time_travel_each_location && (
          <div className="text-xs text-gray-500 italic">
            Travel time: {activity.time_travel_each_location}
          </div>
        )}

        {/* View Button */}
        <Link
          href={
            "https://www.google.com/maps/search/?api=1&query=" +
            activity?.place_name
          }
          target="_blank"
          className="mt-1"
        >
          <Button size={"sm"} variant={"outline"} className="w-full text-xs sm:text-sm hover:bg-primary hover:text-white transition-colors">
            View on Map
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default PlaceCardItem