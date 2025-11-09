"use client";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { ArrowDown, Globe2, Landmark, Plane, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const suggestions = [
  {
    title: "Create New trip",
    icon: <Globe2 className="text-blue-200 h-5 w-5" />,
  },
  {
    title: "Inspire me where to go",
    icon: <Plane className="text-green-500 h-5 w-5" />,
  },
  {
    title: "Discover Hidden Gems",
    icon: <Landmark className="text-orange-500 h-5 w-5" />,
  },
  {
    title: "Adventure Destination",
    icon: <Globe2 className="text-yellow-600 h-5 w-5" />,
  },
];

function Hero() {
  const { user } = useUser();
  const router = useRouter();
  const [userInput, setUserInput] = useState<string>("");

  // ✅ Function to trigger send
  const onsend = () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    if (!userInput.trim()) return;

    // Save to localStorage so Chatbox can read it
    localStorage.setItem("initialUserInput", userInput.trim());

    // Navigate to Chatbox page
    router.push("/create-new-trip");
  };

  // ✅ Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onsend();
    }
  };

  return (
    <div className="mt-12 sm:mt-16 md:mt-24 w-full flex justify-center px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl w-full flex-col flex items-center text-center space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 px-2">
          Hey, I'm your Personal{" "}
          <span className="text-primary">Trip Planner!</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg px-4">
          Tell me what you want, and I'll handle the rest: Flights, Hotels, Trip
          Planning - all in seconds
        </p>

        {/* ✅ Input box */}
        <div className="w-full sm:w-[90%] md:w-[86%] border rounded-xl sm:rounded-2xl p-3 sm:p-4 relative">
          <Textarea
            placeholder="Create your trip from Paris to New York"
            className="w-full h-24 sm:h-28 bg-transparent border-none focus-visible:ring-0 shadow-none text-sm sm:text-base pr-12 sm:pr-14"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            size={"icon"}
            className="absolute right-3 sm:right-4 md:right-6 bottom-3 sm:bottom-4 md:bottom-6 cursor-pointer hover:scale-105 transition h-8 w-8 sm:h-10 sm:w-10"
            onClick={onsend}
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* ✅ Suggestion list */}
        <div className="flex gap-2 sm:gap-3 md:gap-5 mt-2 flex-wrap justify-center px-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => setUserInput(suggestion.title)}
              className="flex items-center p-1.5 sm:p-2 border rounded-full cursor-pointer hover:bg-primary hover:text-white transition text-xs sm:text-sm"
            >
              <span className="h-4 w-4 sm:h-5 sm:w-5">{suggestion.icon}</span>
              <h2 className="ml-1 sm:ml-2 whitespace-nowrap">{suggestion.title}</h2>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center flex-col px-4">
          <h2 className="my-4 sm:my-7 mt-6 sm:mt-10 flex flex-col sm:flex-row gap-1 sm:gap-2 text-center text-sm sm:text-base">
            <span>Not sure where to start?</span>
            <span className="flex items-center justify-center gap-1">
              <strong>See how it works</strong>
              <ArrowDown className="h-4 w-4" />
            </span>
          </h2>
          <div className="w-full max-w-2xl">
            <HeroVideoDialog
              className="block dark:hidden w-full"
              animationStyle="from-center"
              videoSrc="https://drive.google.com/file/d/1s-PIRNGu0IVdXWiERlsDjwHi4yjvcPrW/preview"
              thumbnailSrc="/Demo.png"
              thumbnailAlt="Dummy Video Thumbnail"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
