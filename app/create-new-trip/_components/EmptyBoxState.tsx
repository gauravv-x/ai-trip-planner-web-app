import { suggestions } from '@/app/_components/Hero'


function EmptyBoxState({onSelectOption}: any) {
  return (
    <div className='mt-7'>
        <h2 className='font-bold text-3xl text-center'>Start Planning new <strong className='text-primary'>Trip</strong> AI</h2>
        <p className='text-center text-gray-400'>Discover Personalized Travel itineraries, find the best destinations, and plan your dream vacations effortlessly with
            the power of AI. Let our smart assistant do the hard work while you enjoy the journey.</p>
    
    <div className='flex flex-col gap-5 mt-7'>
                    {suggestions.map((suggestion, index) => (
                        <div key={index} 
                        onClick={()=>onSelectOption(suggestion.title)}
                            className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl cursor-pointer transition-all duration-200 hover:border-primary hover:text-primary hover:bg-primary/5 shadow-sm hover:shadow-md"
                        >
                            {suggestion.icon}
                            <h2 className='text-lg'>{suggestion.title}</h2>
                        </div>
                    ))}
                </div>

    </div>
  )
}

export default EmptyBoxState