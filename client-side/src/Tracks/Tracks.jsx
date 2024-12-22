import React from 'react';

const Tracks = () => {
  const tracks = [
    {
      id: 1,
      name: "Web Development",
      image: "public/images/web.jpg"
    },
    {
      id: 2,
      name: "Data Analysis",
      image: "public/images/DataAnalysis.jpg"
    },
    {
      id: 3,
      name: "Machine Learning",
      image: "public/images/ml.jpg"
    },
    {
      id: 4,
      name: "Artificial Intelligence",
      image: "public/images/ai.jpg"
    },
    {
      id: 5,
      name: "Embedded",
      image: "public/images/embedded.jpg"
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Our Tracks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map(track => (
          <div 
            key={track.id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
          >
            <img 
              src={track.image} 
              alt={track.name} 
              className="w-full h-48 object-cover"
            />
            <h3 className="text-xl font-semibold p-4 text-center">{track.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tracks;
