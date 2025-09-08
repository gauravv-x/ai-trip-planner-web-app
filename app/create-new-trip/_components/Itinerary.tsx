import React from 'react'
import { Timeline } from "@/components/ui/timeline";
import Image from 'next/image';
import { Star, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { title } from 'process';
import { Content } from 'next/font/google';

const TRIP_DATA={
        "destination": "Tokyo",
        "duration": "3 Days",
        "origin": "London",
        "budget": "Moderate",
        "group_size": "2",
        "hotels": [
            {
                "hotel_name": "Park Hyatt Tokyo",
                "hotel_address": "3-7-1-2 Nishi-Shinjuku, Shinjuku-ku, Tokyo 163-1055, Japan",
                "price_per_night": "$400",
                "hotel_image_url": "https://example.com/park_hyatt_tokyo.jpg",
                "geo_coordinates": {
                    "latitude": 35.6886,
                    "longitude": 139.6917
                },
                "rating": 4.7,
                "description": "Iconic luxury hotel offering stunning city views, featured in 'Lost in Translation'."
            },
            {
                "hotel_name": "Imperial Hotel Tokyo",
                "hotel_address": "1-1-1 Uchisaiwaicho, Chiyoda-ku, Tokyo 100-8558, Japan",
                "price_per_night": "$350",
                "hotel_image_url": "https://example.com/imperial_hotel_tokyo.jpg",
                "geo_coordinates": {
                    "latitude": 35.6745,
                    "longitude": 139.7579
                },
                "rating": 4.5,
                "description": "Historic luxury hotel with impeccable service and a prime location."
            },
            {
                "hotel_name": "Keio Plaza Hotel Tokyo",
                "hotel_address": "2-2-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo 160-8330, Japan",
                "price_per_night": "$200",
                "hotel_image_url": "https://example.com/keio_plaza_tokyo.jpg",
                "geo_coordinates": {
                    "latitude": 35.6912,
                    "longitude": 139.6921
                },
                "rating": 4.2,
                "description": "Well-located hotel with various dining options and panoramic city views."
            }
        ],
        "itinerary": [
            {
                "day": 1,
                "day_plan": "Explore Shinjuku and Shibuya",
                "best_time_to_visit_day": "Morning to Evening",
                "activities": [
                    {
                        "place_name": "Shinjuku Gyoen National Garden",
                        "place_details": "Beautiful garden with diverse landscapes.",
                        "place_image_url": "https://example.com/shinjuku_gyoen.jpg",
                        "geo_coordinates": {
                            "latitude": 35.6852,
                            "longitude": 139.7119
                        },
                        "place_address": "11 Naitomachi, Shinjuku City, Tokyo 160-0014, Japan",
                        "ticket_pricing": "$5",
                        "time_travel_each_location": "2-3 hours",
                        "best_time_to_visit": "Morning"
                    },
                    {
                        "place_name": "Shibuya Crossing",
                        "place_details": "World-famous scramble crossing.",
                        "place_image_url": "https://example.com/shibuya_crossing.jpg",
                        "geo_coordinates": {
                            "latitude": 35.6594,
                            "longitude": 139.7009
                        },
                        "place_address": "2 Chome-2-1 Dogenzaka, Shibuya City, Tokyo 150-0043, Japan",
                        "ticket_pricing": "Free",
                        "time_travel_each_location": "30 minutes",
                        "best_time_to_visit": "Evening"
                    }
                ]
            },
            {
                "day": 2,
                "day_plan": "Visit Asakusa and Ueno",
                "best_time_to_visit_day": "Morning to Afternoon",
                "activities": [
                    {
                        "place_name": "Senso-ji Temple",
                        "place_details": "Tokyo's oldest temple.",
                        "place_image_url": "https://example.com/sensoji_temple.jpg",
                        "geo_coordinates": {
                            "latitude": 35.7147,
                            "longitude": 139.7966
                        },
                        "place_address": "2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan",
                        "ticket_pricing": "Free",
                        "time_travel_each_location": "2 hours",
                        "best_time_to_visit": "Morning"
                    },
                    {
                        "place_name": "Ueno Park",
                        "place_details": "Large public park with museums and a zoo.",
                        "place_image_url": "https://example.com/ueno_park.jpg",
                        "geo_coordinates": {
                            "latitude": 35.7145,
                            "longitude": 139.7764
                        },
                        "place_address": "Uenokoen, Taito City, Tokyo 110-0007, Japan",
                        "ticket_pricing": "Varies by museum",
                        "time_travel_each_location": "3-4 hours",
                        "best_time_to_visit": "Afternoon"
                    }
                ]
            },
            {
                "day": 3,
                "day_plan": "Explore the Imperial Palace and Ginza",
                "best_time_to_visit_day": "Morning to Afternoon",
                "activities": [
                    {
                        "place_name": "Tokyo Imperial Palace",
                        "place_details": "Residence of the Emperor of Japan.",
                        "place_image_url": "https://example.com/imperial_palace.jpg",
                        "geo_coordinates": {
                            "latitude": 35.6853,
                            "longitude": 139.7514
                        },
                        "place_address": "1-1 Chiyoda, Chiyoda City, Tokyo 100-8111, Japan",
                        "ticket_pricing": "Free (East Garden)",
                        "time_travel_each_location": "2-3 hours",
                        "best_time_to_visit": "Morning"
                    },
                    {
                        "place_name": "Ginza District",
                        "place_details": "Upscale shopping and dining area.",
                        "place_image_url": "https://example.com/ginza_district.jpg",
                        "geo_coordinates": {
                            "latitude": 35.6724,
                            "longitude": 139.7653
                        },
                        "place_address": "Ginza, Chuo City, Tokyo, Japan",
                        "ticket_pricing": "Free (window shopping)",
                        "time_travel_each_location": "2-3 hours",
                        "best_time_to_visit": "Afternoon"
                    }
                ]
            }
        ]
    }



function Itinerary() {
  const data = [
    {
      title: "Recommanded Hotels",
      content: (
        <div className='grid grid-cols-2 md:grid-cols-2 gap-4'>
          {TRIP_DATA?.hotels.map((hotel, index) => (
            <div key={index} className='flex flex-col gap-1'>
                 <Image src={'/placeholder.jpg'} alt='place-image' width={400} height={200}
                 className='rounded-xl shadow object-cover mb-2'/>
                 <h2 className='font-semibold text-lg'>{hotel?.hotel_name} </h2>   
                 <h2 className='text-gray-500'>{hotel?.hotel_address} </h2>   
                 <div className='flex justify-between items-center'>
                 <p className='flex gap-2 text-green-600'><Wallet/>{hotel?.price_per_night} </p>   
                 <p className='flex gap-2 text-yellow-500'><Star/>{hotel?.rating} </p>   
                 </div>
                 <Button variant={'outline'} className='mt-1'>View</Button>
                 {/* <p className='line-clamp-2 text-gray-500'><Star/>{hotel?.description} </p>    */}

            </div>
          ))}
        </div>
      ),
    },
    ...TRIP_DATA?.itinerary.map((dayData)=>({
        title:`Day ${dayData?.day}`,
        content:(
            <div>
                <p>Best Time:{dayData?.best_time_to_visit_day}</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {dayData.activities.map((activity,index)=>(
                    <div key={index}>
                        <Image src={'/placeholder.jpg'} width={400} height={200} alt={activity?.place_name} 
                        className='object-cover rounded-xl'
                        />       
                        <h2 className='font-semibold text-lg'>{activity?.place_name}</h2>            
                        </div>
                ))
    }
                
                </div>
            </div>
        )  
    }))
  ];
  return (
    <div className="relative w-full h-[83vh] overflow-auto">
       <Timeline data={data} tripData={TRIP_DATA} />
    </div>
    );
}

export default Itinerary