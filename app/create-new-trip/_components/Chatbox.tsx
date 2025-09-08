"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader, Send } from 'lucide-react'
import React, { JSX, useEffect, useState } from 'react'
import EmptyBoxState from './EmptyBoxState'
import GroupSizeUI from './GroupSizeUI'
import BudgetUI from './BudgetUI'
import { FinalUI } from './FinalUI'
import { TripDurationUI } from './TripDurationUI'
import { motion } from "framer-motion";
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUserDetail } from '@/app/provider'
import { v4 as uuidv4 } from 'uuid';

type Message = {
    role: string;
    content: string;
    ui?: string;
};

export type TripInfo={
  budget: string,
  destination: string,
  duration: string,
  group_size: string,
  origin: string,
  hotels: Hotel[],
  itinerary: Itinerary
}

type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  hotel_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  description: string;
};

type Activity = {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
};

type Itinerary = {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: Activity[];
};



function Chatbox() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [isFinal, setIsFinal] = useState(false);
    const [tripDetail, setTripDetail] = useState<TripInfo>();
    const SaveTripDetail=useMutation(api.tripDetail.CreateTripDetail);
    const {userDetail, setUserDetail}= useUserDetail();

    const onsend=async()=>{
      console.log("INSIDE")
      if(!userInput?.trim()) return;
        setLoading(true);
        
        const newMeg:Message={
            role: 'user',
            content: userInput??''
        }
        setUserInput('');
        console.log("HERE")
        setMessages((prev:Message[]) => [...prev, newMeg]);

        const result = await axios.post('/api/aimodel',{
            messages:[...messages, newMeg],
            isFinal: isFinal
        });

        console.log("TRIP",result.data);

        !isFinal && setMessages((prev:Message[]) => [...prev, {
            role: 'assistant',
            content: result?.data?.resp,
            ui : result?.data?.ui,
        }]);

        if (isFinal){
          setTripDetail(result?.data?.trip_plan);
           const tripId = uuidv4();
           await SaveTripDetail({
              tripDetail:result?.data?.trip_plan,
              tripId: tripId,
              uid: userDetail?._id

          })
        }
        
        setLoading(false);

    } 

    const RenderGenerativeUi = (ui: string, content?: string) => {
  if (ui === "budget") {
    return <BudgetUI onSelectedOption={(v: string) => { setUserInput(v); onsend(); }} />;
  }
  if (ui === "groupSize") {
    return <GroupSizeUI onSelectedOption={(v: string) => { setUserInput(v); onsend(); }} />;
  }
  if (ui === "tripDuration") {
    return <TripDurationUI onSelectedOption={(v: string) => { setUserInput(v); onsend(); }} />;
  }
  if (ui === "final") {
    return <FinalUI viewTrip={() => console.log("Viewing trip:", tripDetail)} 
    disable={!tripDetail} />;
  }
  return null;
};

  useEffect(()=>{
    const lastMsg = messages[messages.length - 1];
    if(lastMsg?.ui=='final'){
      setIsFinal(true);
      setUserInput("Ok, Great")
      // onsend();
    }
  },[messages])

  useEffect(()=>{
    if(isFinal && userInput){
      onsend();
    }
},[isFinal]);

  return (
    <div className='h-[85vh] flex flex-col'>
        {messages?.length == 0 && 
            <EmptyBoxState onSelectOption={(v:string)=>{setUserInput(v); onsend()}} />
        }

        {/* Display Section  */}
        <section className='flex-1 overflow-y-auto p-4'> 
            {messages.map((msg:Message, index) => (
             msg.role == 'user' ? 
            <div className="flex justify-end mt-2" key={index}>
              <div className="max-w-lg bg-primary text-white px-4 py-2 rounded-lg shadow">
                {msg.content}
              </div>
            </div>
           : 
            <div className="flex justify-start mt-2" key={index}>
              <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg shadow">
                {msg.content}
              {RenderGenerativeUi(msg.ui ?? '', msg.content)}
              </div>
            </div>
))}
        {loading && <div className='flex justify-start mt-2'>
                <div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg'>
                       <Loader className="animate-spin" />
                </div>
            </div>}

        </section>
        {/* User Input Section */}
        <section className="p-4 bg-white border-t sticky bottom-0">
            <div className="flex items-end gap-2">
                <Textarea
                placeholder="Start typing here..."
                className="flex-1 min-h-[60px] max-h-[120px] resize-none rounded-xl"
                onChange={(event) => setUserInput(event.target.value)}
                value={userInput}
                />
                <Button
                size={"icon"}
                className="rounded-full bg-primary text-white transition-transform active:scale-90"
                onClick={onsend}
                disabled={loading}
                >
                {loading ? <Loader className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                </Button>
            </div>
        </section>

    </div>
  )
}

export default Chatbox