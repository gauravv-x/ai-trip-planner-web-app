import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export function TripDurationUI({ onSelectedOption }: { onSelectedOption: (v: string) => void }) {
  const [days, setDays] = useState(3); // default trip duration

  const increment = () => setDays((prev) => prev + 1);
  const decrement = () => setDays((prev) => (prev > 1 ? prev - 1 : 1));

  const handleConfirm = () => {
    onSelectedOption(`${days} Days`);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 mt-2 p-3 sm:p-4 border rounded-xl sm:rounded-2xl bg-white">
      <h2 className="text-base sm:text-lg font-bold text-center">Select Trip Duration</h2>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Decrement button */}
        <Button
          variant="outline"
          className="rounded-full h-9 w-9 sm:h-10 sm:w-10 text-lg sm:text-xl font-bold hover:border-primary hover:text-primary"
          onClick={decrement}
        >
          –
        </Button>

        {/* Days counter */}
        <span className="text-xl sm:text-2xl font-bold min-w-[80px] text-center">{days} Days</span>

        {/* Increment button */}
        <Button
          variant="outline"
          className="rounded-full h-9 w-9 sm:h-10 sm:w-10 text-lg sm:text-xl font-bold hover:border-primary hover:text-primary"
          onClick={increment}
        >
          +
        </Button>
      </div>

      {/* Confirm button */}
      <Button
        onClick={handleConfirm}
        className="mt-1 sm:mt-2 bg-primary text-white rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 text-sm sm:text-base w-full sm:w-auto"
      >
        Confirm
      </Button>
    </div>
  );
}

export default TripDurationUI;
