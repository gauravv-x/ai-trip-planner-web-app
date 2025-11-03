"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function PopularCityList() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-12">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Get to know your iSad. </h2>
      <Carousel items={cards} />
    </div>
  );
}

/* ✅ Real and beautiful travel destinations with short introductions */
const DummyContent = ({ title, description, img }: any) => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-12 rounded-3xl mb-4 text-center">
      <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-3">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg mb-4 max-w-3xl mx-auto">
        {description}
      </p>
      <img
        src={img}
        alt="Image not found" 
        height="500"
        width="500"
        className="rounded-2xl mx-auto object-cover shadow-md md:w-[70%] w-full h-auto"
      />
    </div>
  );
};

const data = [
  {
    category: "Paris, France",
    title: "Romance and Art in the City of Lights",
    src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2600&auto=format&fit=crop",
    content: (
      <DummyContent
        title="Paris, France"
        description="Experience Paris — where every street whispers love. Walk along the Seine, visit the Louvre, and enjoy breathtaking views from the Eiffel Tower."
        img="https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1600&auto=format&fit=crop"
      />
    ),
  },
  {
    category: "New York, USA",
    title: "The City That Never Sleeps",
    src: "https://plus.unsplash.com/premium_photo-1661954654458-c673671d4a08?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: (
      <DummyContent
        title="New York, USA"
        description="Bright lights, Broadway, and Central Park — discover the heartbeat of America in New York City, where dreams are made and stories begin."
        img="https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop"
      />
    ),
  },
  {
    category: "Tokyo, Japan",
    title: "Tradition Meets Tomorrow",
    src: "https://images.unsplash.com/photo-1522547902298-51566e4fb383?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: (
      <DummyContent
        title="Tokyo, Japan"
        description="Immerse yourself in Tokyo — from ancient shrines and cherry blossoms to futuristic skylines and sushi bars. The city is a perfect balance of calm and chaos."
        img="https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=1600&auto=format&fit=crop"
      />
    ),
  },
  {
    category: "Bali, Indonesia",
    title: "The Island of Serenity",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2600&auto=format&fit=crop",
    content: (
      <DummyContent
        title="Bali, Indonesia"
        description="Golden beaches, spiritual temples, and lush green rice terraces — Bali is where nature meets peace and every sunrise feels magical."
        img="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop"
      />
    ),
  },
  {
    category: "Dubai, UAE",
    title: "Luxury in the Desert",
    src: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: (
      <DummyContent
        title="Dubai, UAE"
        description="A fusion of innovation and opulence — explore skyscrapers, luxury malls, desert adventures, and world-class dining in the heart of Dubai."
        img="https://plus.unsplash.com/premium_photo-1697729914552-368899dc4757?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600"
      />
    ),
  },
  {
    category: "Rome, Italy",
    title: "The Eternal City of History",
    src: "https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: (
      <DummyContent
        title="Rome, Italy"
        description="From the Colosseum to Vatican City, experience centuries of culture, cuisine, and architecture that define the eternal charm of Rome."
        img="https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=2600&auto=format&fit=crop"
      />
    ),
  },
  {
        category: "India",
        title: "Harbour Views - Opera House, Bondi Beach & Wildlife",
        src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        content:  <DummyContent
      title="India"
      description="A land of diversity where every corner tells a story — from the royal palaces of Rajasthan to the serene backwaters of Kerala and the majestic Himalayas. Experience a journey through traditions, flavors, and festivals like nowhere else in the world."
      img="https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600&auto=format&fit=crop"
    />
  }
];
