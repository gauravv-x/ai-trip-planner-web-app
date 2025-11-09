"use client"

import React, { useEffect, useState } from 'react'
import { Timeline } from "@/components/ui/timeline";
import Image from 'next/image';
import { ArrowLeft, Clock, ExternalLink, Star, Target, Ticket, Timer, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { title } from 'process';
import { Content } from 'next/font/google';
import Link from 'next/link';
import HotelCardItem from './HotelCardItem';
import PlaceCardItem from './PlaceCardItem';
import { useTripDetail } from '@/app/provider';
import { TripInfo } from './Chatbox';

// const TRIP_DATA={
//         "destination": "Tokyo",
//         "duration": "3 Days",
//         "origin": "London",
//         "budget": "Moderate",
//         "group_size": "2",
//         "hotels": [
//             {
//                 "hotel_name": "Park Hyatt Tokyo",
//                 "hotel_address": "3-7-1-2 Nishi-Shinjuku, Shinjuku-ku, Tokyo 163-1055, Japan",
//                 "price_per_night": "$400",
//                 "hotel_image_url": "https://example.com/park_hyatt_tokyo.jpg",
//                 "geo_coordinates": {
//                     "latitude": 35.6886,
//                     "longitude": 139.6917
//                 },
//                 "rating": 4.7,
//                 "description": "Iconic luxury hotel offering stunning city views, featured in 'Lost in Translation'."
//             },
//             {
//                 "hotel_name": "Imperial Hotel Tokyo",
//                 "hotel_address": "1-1-1 Uchisaiwaicho, Chiyoda-ku, Tokyo 100-8558, Japan",
//                 "price_per_night": "$350",
//                 "hotel_image_url": "https://example.com/imperial_hotel_tokyo.jpg",
//                 "geo_coordinates": {
//                     "latitude": 35.6745,
//                     "longitude": 139.7579
//                 },
//                 "rating": 4.5,
//                 "description": "Historic luxury hotel with impeccable service and a prime location."
//             },
//             {
//                 "hotel_name": "Keio Plaza Hotel Tokyo",
//                 "hotel_address": "2-2-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo 160-8330, Japan",
//                 "price_per_night": "$200",
//                 "hotel_image_url": "https://example.com/keio_plaza_tokyo.jpg",
//                 "geo_coordinates": {
//                     "latitude": 35.6912,
//                     "longitude": 139.6921
//                 },
//                 "rating": 4.2,
//                 "description": "Well-located hotel with various dining options and panoramic city views."
//             }
//         ],
//         "itinerary": [
//             {
//                 "day": 1,
//                 "day_plan": "Explore Shinjuku and Shibuya",
//                 "best_time_to_visit_day": "Morning to Evening",
//                 "activities": [
//                     {
//                         "place_name": "Shinjuku Gyoen National Garden",
//                         "place_details": "Beautiful garden with diverse landscapes.",
//                         "place_image_url": "https://example.com/shinjuku_gyoen.jpg",
//                         "geo_coordinates": {
//                             "latitude": 35.6852,
//                             "longitude": 139.7119
//                         },
//                         "place_address": "11 Naitomachi, Shinjuku City, Tokyo 160-0014, Japan",
//                         "ticket_pricing": "$5",
//                         "time_travel_each_location": "2-3 hours",
//                         "best_time_to_visit": "Morning"
//                     },
//                     {
//                         "place_name": "Shibuya Crossing",
//                         "place_details": "World-famous scramble crossing.",
//                         "place_image_url": "https://example.com/shibuya_crossing.jpg",
//                         "geo_coordinates": {
//                             "latitude": 35.6594,
//                             "longitude": 139.7009
//                         },
//                         "place_address": "2 Chome-2-1 Dogenzaka, Shibuya City, Tokyo 150-0043, Japan",
//                         "ticket_pricing": "Free",
//                         "time_travel_each_location": "30 minutes",
//                         "best_time_to_visit": "Evening"
//                     }
//                 ]
//             },
//             {
//                 "day": 2,
//                 "day_plan": "Visit Asakusa and Ueno",
//                 "best_time_to_visit_day": "Morning to Afternoon",
//                 "activities": [
//                     {
//                         "place_name": "Senso-ji Temple",
//                         "place_details": "Tokyo's oldest temple.",
//                         "place_image_url": "https://example.com/sensoji_temple.jpg",
//                         "geo_coordinates": {
//                             "latitude": 35.7147,
//                             "longitude": 139.7966
//                         },
//                         "place_address": "2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan",
//                         "ticket_pricing": "Free",
//                         "time_travel_each_location": "2 hours",
//                         "best_time_to_visit": "Morning"
//                     },
//                     {
//                         "place_name": "Ueno Park",
//                         "place_details": "Large public park with museums and a zoo.",
//                         "place_image_url": "https://example.com/ueno_park.jpg",
//                         "geo_coordinates": {
//                             "latitude": 35.7145,
//                             "longitude": 139.7764
//                         },
//                         "place_address": "Uenokoen, Taito City, Tokyo 110-0007, Japan",
//                         "ticket_pricing": "Varies by museum",
//                         "time_travel_each_location": "3-4 hours",
//                         "best_time_to_visit": "Afternoon"
//                     }
//                 ]
//             },
//             {
//                 "day": 3,
//                 "day_plan": "Explore the Imperial Palace and Ginza",
//                 "best_time_to_visit_day": "Morning to Afternoon",
//                 "activities": [
//                     {
//                         "place_name": "Tokyo Imperial Palace",
//                         "place_details": "Residence of the Emperor of Japan.",
//                         "place_image_url": "https://example.com/imperial_palace.jpg",
//                         "geo_coordinates": {
//                             "latitude": 35.6853,
//                             "longitude": 139.7514
//                         },
//                         "place_address": "1-1 Chiyoda, Chiyoda City, Tokyo 100-8111, Japan",
//                         "ticket_pricing": "Free (East Garden)",
//                         "time_travel_each_location": "2-3 hours",
//                         "best_time_to_visit": "Morning"
//                     },
//                     {
//                         "place_name": "Ginza District",
//                         "place_details": "Upscale shopping and dining area.",
//                         "place_image_url": "https://example.com/ginza_district.jpg",
//                         "geo_coordinates": {
//                             "latitude": 35.6724,
//                             "longitude": 139.7653
//                         },
//                         "place_address": "Ginza, Chuo City, Tokyo, Japan",
//                         "ticket_pricing": "Free (window shopping)",
//                         "time_travel_each_location": "2-3 hours",
//                         "best_time_to_visit": "Afternoon"
//                     }
//                 ]
//             }
//         ]
//     }



function Itinerary() {
  // @ts-ignore 
  const {tripDetailInfo, setTripDetailInfo} = useTripDetail();
  const [tripData, setTripData] = useState<TripInfo|null>(null);

  useEffect(()=>{
    tripDetailInfo&& setTripData(tripDetailInfo);
  },[tripDetailInfo]) 

  const data = [];

  if (tripData?.hotels && tripData.hotels.length > 0) {
    data.push({
      title: "Hotels",
      content: (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
          {tripData.hotels.map((hotel, index) => (
            <HotelCardItem key={index} hotel={hotel}/>
          ))}
        </div>
      ),
    });
  } else if (tripData?.destination && !tripData?.hotels) {
    data.push({
      title: "Hotels",
      content: (
        <div className='p-4 text-gray-500 italic'>
          Hotels are being planned...
        </div>
      ),
    });
  }

  if (tripData?.itinerary && tripData.itinerary.length > 0) {
    tripData.itinerary.forEach((dayData) => {
      data.push({
        title: `Day ${dayData?.day}`,
        content: (
          <div>
            <p className="p-2 text-base sm:text-lg md:text-xl font-bold text-primary mb-2">Best Time: {dayData?.best_time_to_visit_day}</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              {dayData.activities.map((activity, index) => (
                <PlaceCardItem key={index} activity={activity} />
              ))}
            </div>
          </div>
        ),
      });
    });
  } else if (tripData?.destination && !tripData?.itinerary) {
    data.push({
      title: "Itinerary",
      content: (
        <div className='p-4 text-gray-500 italic'>
          Itinerary is being planned...
        </div>
      ),
    });
  }

  return (
    <div className="relative w-full h-[70vh] sm:h-[75vh] md:h-[83vh] overflow-auto px-2 sm:px-4">
       {tripData ? <Timeline data={data} tripData={tripData} />
       :
      <div className='w-full h-full flex flex-col justify-center items-center relative'>
       <Image src={'/travel.png'} alt='travel.png' width={800} height={800} className='w-full h-full object-cover rounded-2xl sm:rounded-3xl' />
       <h2 className='flex gap-2 text-lg sm:text-xl md:text-2xl lg:text-3xl text-white left-4 sm:left-8 md:left-20 items-center absolute bottom-8 sm:bottom-12 md:bottom-20 px-2'><ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8"/> <span className="hidden sm:inline">Getting to know you to build perfect trip here...</span><span className="sm:hidden">Building your perfect trip...</span></h2>
       </div>
       }
    </div>
    );
}

export default Itinerary