"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader, Send } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import EmptyBoxState from './EmptyBoxState'
import GroupSizeUI from './GroupSizeUI'
import BudgetUI from './BudgetUI'
import { FinalUI } from './FinalUI'
import { TripDurationUI } from './TripDurationUI'
import { motion } from "framer-motion";
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useTripDetail, useUserDetail } from '@/app/provider'
import { v4 as uuidv4 } from 'uuid';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ui?: string;
};

export type TripInfo = {
  budget: string,
  destination: string,
  duration: string,
  group_size: string,
  origin: string,
  hotels: Hotel[],
  itinerary: Itinerary[]
}

export type Hotel = {
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

export type Activity = {
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

export type Itinerary = {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: Activity[];
};

function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripInfo | undefined>();
  const SaveTripDetail = useMutation(api.tripDetail.CreateTripDetail);
  const { userDetail, setUserDetail } = useUserDetail();
  // @ts-ignore
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // keep messagesRef in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // single initial input effect
  useEffect(() => {
    const storedInput = localStorage.getItem("initialUserInput");
    if (storedInput && storedInput.trim() !== "") {
      localStorage.removeItem("initialUserInput");
      // send directly (force text) so we don't rely on asynchronous setState
      onsend(storedInput);
    }
  }, []);

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (!container) return;
    // small timeout to allow DOM to update
    setTimeout(() => {
      try {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      } catch {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onsend();
    }
  };

  // onsend supports forceFinal to ensure the server sees final-state when needed
  const onsend = async (text?: string, forceFinal?: boolean) => {
    if (loading) return;
    const content = (text ?? userInput ?? textareaRef.current?.value ?? '').trim();
    if (!content) return;

    setLoading(true);

    const newMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content
    };

    // optimistically add user message
    setUserInput('');
    setMessages(prev => {
      const next = [...prev, newMsg];
      messagesRef.current = next;
      return next;
    });
    scrollToBottom();

    try {
      // build payload from the latest messages (avoid stale closure)
      const payloadMessages = [...messagesRef.current, newMsg].map(m => ({
        role: m.role,
        content: m.content,
        ui: m.ui
      }));

      const finalFlag = forceFinal ?? isFinal;

      const result = await axios.post('/api/aimodel', {
        messages: payloadMessages,
        isFinal: finalFlag
      });

      const assistantContent = result?.data?.resp ?? '';
      const assistantUi = result?.data?.ui;

      // append assistant reply unless final state prevents assistant content display
      if (!finalFlag) {
        const assistantMsg: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: assistantContent,
          ui: assistantUi
        };
        setMessages(prev => {
          const next = [...prev, assistantMsg];
          messagesRef.current = next;
          return next;
        });
        scrollToBottom();
      }

      // when final, save trip details
      if (finalFlag && result?.data?.trip_plan) {
        const plan = result.data.trip_plan as TripInfo;
        setTripDetail(plan);
        setTripDetailInfo?.(plan);
        const tripId = uuidv4();
        try {
          await SaveTripDetail({
            tripDetail: plan,
            tripId,
            uid: userDetail?._id
          });
        } catch (saveErr) {
          console.error('Save trip detail error', saveErr);
        }
      }
    } catch (err) {
      console.error('Send error', err);
    } finally {
      setLoading(false);
    }
  };

  const RenderGenerativeUi = (ui: string) => {
    if (ui === "budget") {
      return <BudgetUI onSelectedOption={(v: string) => { setUserInput(v); onsend(v); }} />;
    }
    if (ui === "groupSize") {
      return <GroupSizeUI onSelectedOption={(v: string) => { setUserInput(v); onsend(v); }} />;
    }
    if (ui === "tripDuration") {
      return <TripDurationUI onSelectedOption={(v: string) => { setUserInput(v); onsend(v); }} />;
    }
    if (ui === "final") {
      // when user clicks final view, do not auto-send; show final UI button
      return <FinalUI viewTrip={() => console.log("Viewing trip:", tripDetail)} disable={!tripDetail} />;
    }
    return null;
  };

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.ui === 'final') {
      // ensure final flag is set and immediately send the confirmation text as final
      setIsFinal(true);
      // call onsend with explicit forceFinal so isFinal state timing doesn't matter
      onsend("Ok, Great", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  return (
    <div className='h-[85vh] flex flex-col border shadow rounded-2xl p-5'>
      {messages.length === 0 &&
        <EmptyBoxState onSelectOption={(v: string) => { setUserInput(v); onsend(v); }} />
      }

      {/* Display Section  */}
      <section ref={containerRef} className='flex-1 overflow-y-auto p-4'>
        {messages.map((msg) => (
          msg.role === 'user' ?
            <div className="flex justify-end mt-2" key={msg.id}>
              <div className="max-w-lg bg-primary text-white px-4 py-2 rounded-lg shadow">
                {msg.content}
              </div>
            </div>
            :
            <div className="flex justify-start mt-2" key={msg.id}>
              <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg shadow">
                {msg.content}
                {RenderGenerativeUi(msg.ui ?? '')}
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
            onKeyDown={handleKeyDown}
            value={userInput}
            ref={textareaRef}
            autoFocus
          />
          <Button
            size={"icon"}
            className="rounded-full bg-primary text-white transition-transform active:scale-90"
            onClick={(e) => { e.preventDefault(); onsend(); }}
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
