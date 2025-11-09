"use client"
import GlobleMap from '@/app/create-new-trip/_components/GlobleMap';
import Itinerary from '@/app/create-new-trip/_components/Itinerary';
import { Trip } from '@/app/my-trips/page';
import { useTripDetail, useUserDetail } from '@/app/provider';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function ViewTrip() 
{
    const {tripid} = useParams();
    const {userDetail,setUserDetail} = useUserDetail();
    //@ts-ignore
    const {tripDetailInfo, setTripDetailInfo} = useTripDetail();
    const convex =  useConvex();
    const [tripData,setTripData] = useState<Trip>();
    useEffect(()=>{
        userDetail && GetTrip()
    },[userDetail])


    const GetTrip=async()=>{
        const result = await convex.query(api.tripDetail.GetTripById,{
            uid: userDetail?._id,
            tripid: tripid as string
        })

        setTripData(result);
        setTripDetailInfo(result?.tripDetail);
    }

  return (
    <div className='grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-0'>
      <div className='md:col-span-3 order-2 md:order-1'>
        <Itinerary />
      </div>
      <div className='md:col-span-2 order-1 md:order-2 min-h-[400px] md:min-h-auto'>
        <GlobleMap/> 
      </div>
    </div>
  )
}

export default ViewTrip