import { useState, useEffect } from 'react';

const images = [
  { src: '/AirPurifier.jpg', caption: 'AI-Powered Pet Tech' },
  { src: '/SmartColler.jpg', caption: 'Smart Collars & Trackers' },
  { src: '/SuperFood.jpg', caption: 'Healthy Pets, Happy Life' }
];

const SimpleCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto h-[360px] bg-white flex items-center justify-center overflow-hidden rounded-2xl shadow-xl mb-2 relative mt-2">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${
            index === current ? 'opacity-100 z-10' : 'opacity-0'
          }`}
        >
          <img
            src={img.src}
            alt={img.caption}
            className="max-h-[250px] max-w-full object-contain"
          />
          <div className="absolute bottom-0 left-0 bg-[LightSteelBlue] bg-opacity-100 text-white p-3 w-full text-lg font-medium text-center">
            {img.caption}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SimpleCarousel;
