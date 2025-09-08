"use client"
import HeroVideoDialog from '@/components/magicui/hero-video-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@clerk/nextjs';
import { Client } from '@clerk/nextjs/server';
import { ArrowDown, Globe2, Landmark, Plane, Send } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React from 'react';

export const suggestions = [
    {
        title: "Create New trip",
        icon :<Globe2 className='text-blue-200 h-5 w-5' />
    },
    {
        title: "Inspire me where to go",
        icon :<Plane className='text-green-500 h-5 w-5' />
    },
    {
        title: "Discover Hidden Gems",
        icon :<Landmark className='text-orange-500 h-5 w-5' />
    },
    {
        title: "Adventure Destination",
        icon :<Globe2 className='text-yellow-600 h-5 w-5' />
    }
]


function Hero(onSelectOption:any) {
    
    const {user} = useUser();

    const router = useRouter();

    const onsend=()=>{
        if(!user) {
            router.push('/sign-in');
            return;
        }
        // Navigate to trip planning page
        router.push('/create-new-trip');
    }  

    return (
    <div className="mt-24 w-full flex justify-center">
        <div className="max-w-4xl w-full flex-col flex items-center text-center space-y-6">
            <h1 className="text-xl md:text-5xl font-bold mb-4">
                Hey, I'm your Personal <span className="text-primary">Trip Planner!</span>
            </h1>
            <p className="text-lg whitespace-nowrap">
                Tell me what you want, and I'll handle the rest: Flights, Hotels, Trip Planning - all in seconds
            </p>
          <div className="w-[86%] border rounded-2xl p-4 relative ">
                <Textarea
                    placeholder="Create your trip from Paris to New York"
                    className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none"
                />
                <Button size={"icon"} className="absolute right-6 bottom-6" onClick={() => onsend()}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
            {/* Suggestion list */}
                <div className='flex gap-5 mt-2'>
                    {suggestions.map((suggestion, index) => (
                        <div onClick={()=>onSelectOption(suggestion.title)}
                            key={index} className="flex items-center p-2 border rounded-full cursor-pointer hover:bg-primary hover:text-white"
                        >
                            {suggestion.icon}
                            <h2 className='text-sm ml-2'>{suggestion.title}</h2>
                        </div>
                    ))}
                 </div>
             <div className='flex items-center justify-center flex-col'>
                <h2 className='my-7 mt-10 flex gap-2 text-center'>Not Sure where to start?<strong>See how it works</strong><ArrowDown/></h2>
            {/* Video Section */}
               <HeroVideoDialog 
                    className="block dark:hidden"
                    animationStyle="from-center"
                    videoSrc="https://www.example.com/dummy-video"
                    thumbnailSrc="/placeholder.jpg"
                    thumbnailAlt="Dummy Video Thumbnail"
                />
           </div>
        </div>
    </div>
    );

}


export default Hero;