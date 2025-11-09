import React from 'react'

export const SelectTravelersList = [
    {
        id: 1,
        title: 'Just Me',
        desc: 'A solo traveler in exploration',
        icon: '✈️',
        people: '1',
    },
    {
        id: 2,
        title: 'A Couple',
        desc: 'Two travelers in tandem',
        icon: '🥂',
        people: '2 People',
    },
    {
        id: 3,
        title: 'Family',
        desc: 'A group of fun-loving adventurers',
        icon: '🏡',
        people: '3 to 5 People',
    },
    {
        id: 4,
        title: 'Friends',
        desc: 'A bunch of thrill-seekers',
        icon: '⛵️',
        people: '5 to 10 People',
    },
];

function GroupSizeUI({onSelectedOption}: any) {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 items-center mt-1'>
      {SelectTravelersList.map((item, index) => (
        <div key={index} className='p-2 sm:p-3 border rounded-xl sm:rounded-2xl bg-white hover:border-primary cursor-pointer transition-all flex flex-col items-center text-center'
        onClick={() => onSelectedOption(item.title+':'+item.people)}
        >
          <h2 className="text-2xl sm:text-3xl">{item.icon}</h2>
          <h2 className="text-xs sm:text-sm md:text-base font-semibold mt-1"> {item.title}</h2>
          <p className="text-xs text-gray-500 hidden sm:block mt-1">{item.desc}</p>
        </div>
      ))}
    </div>
  )
}

export default GroupSizeUI