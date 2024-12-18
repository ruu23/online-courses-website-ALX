import React from 'react';

const Tracks = ({ tracks, onSelectTrack }) => {
  const handleClick = (trackId) => {
    onSelectTrack(trackId);
    document.getElementById('courses-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="courses">
      <h1 className="heading">Our Tracks</h1>
      <div className="box-container">
        {tracks.map(track => (
          <div key={track.id} className="box" onClick={() => handleClick(track.id)} style={{ cursor: 'pointer' }}>
            <img src={track.image} alt={track.name} className="track-img" />
            <h3 className="title">{track.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tracks;
