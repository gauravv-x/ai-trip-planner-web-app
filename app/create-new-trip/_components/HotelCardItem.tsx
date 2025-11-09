"use client"
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Hotel } from "./Chatbox";
import axios from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  hotel: Hotel;
};

function HotelCardItem({ hotel }: Props) {

  const[photoUrl,setPhotoUrl]= useState<string>();

  useEffect(()=>{
    hotel&&GetGooglePlaceDetail();   
  },[hotel])

  const GetGooglePlaceDetail = async()  =>{
    const result = await axios.post('/api/google-place-detail', {
        placeName: hotel?.hotel_name
    });
    if(result?.data.e)
    {
      return;
    }
    setPhotoUrl(result?.data);


  }


  return (
    <div className="flex flex-col gap-2 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Image
        src={photoUrl?photoUrl:"/placeholder.jpg"}
        alt={hotel?.hotel_name}
        width={400}
        height={200}        
        className="object-cover h-[150px] sm:h-[180px] md:h-[200px] w-full"
      />
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex flex-col gap-2">
        <h2 className="font-semibold text-base sm:text-lg line-clamp-2 leading-tight">{hotel?.hotel_name} </h2>
        <h2 className="text-gray-500 text-xs sm:text-sm line-clamp-2">{hotel?.hotel_address} </h2>

        <TooltipProvider>
          <div className="flex flex-wrap gap-2 mt-1">
            {/* Price Badge */}
            {hotel?.price_per_night && (
              <div className="flex items-start gap-1.5 bg-green-50 text-green-700 px-2.5 py-1.5 rounded-md border border-green-200 flex-1 min-w-[140px]">
                <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-green-600 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium break-words line-clamp-2 flex-1">
                  {hotel.price_per_night}
                </span>
              </div>
            )}
            
            {/* Rating Badge */}
            {hotel?.rating && (
              <div className="flex items-start gap-1.5 bg-yellow-50 text-yellow-600 px-2.5 py-1.5 rounded-md border border-yellow-200 flex-1 min-w-[140px]">
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-yellow-500 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium break-words line-clamp-2 flex-1">
                  {hotel.rating}
                </span>
              </div>
            )}
          </div>
        </TooltipProvider>

        {/* Description */}
        {hotel?.description && (
          <div className="text-xs text-gray-500 italic">
            {hotel.description}
          </div>
        )}

        {/* View Button */}
        <Link
          href={
            "https://www.google.com/maps/search/?api=1&query=" + hotel?.hotel_name
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

export default HotelCardItem;
