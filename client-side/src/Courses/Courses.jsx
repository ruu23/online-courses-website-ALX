import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Tracks from '../Tracks/Tracks';

export default function Courses() {
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('')
      .then(response => {
        const data = response.data;
        if (data.tracks) {
          setTracks(data.tracks);
        } else {
          console.error("Unexpected data format:", data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []);

  const handleTrackSelect = (trackId) => {
    const track = tracks.find(t => t.id === trackId);
    setSelectedTrack(track);
  };

  return (
    <div>
      <Tracks tracks={tracks} onSelectTrack={handleTrackSelect} />
      {selectedTrack && (
        <section id="courses-section" className="courses">
          <h1 className="heading">{selectedTrack.name} Courses</h1>
          <div className="box-container">
            {loading ? (
              <p>Loading courses...</p>
            ) : (
              selectedTrack.courses.map(course => (
                <div key={course.id} className="box">
                  <div className="tutor">
                    <img src={course.tutor.image} alt={course.tutor.name} />
                    <div className="info">
                      <h3>{course.tutor.name}</h3>
                      <span>{course.tutor.date}</span>
                    </div>
                  </div>
                  <div className="thumb">
                    <img src={course.thumbnail.image} alt={course.title} />
                    <span>{course.thumbnail.videos} videos</span>
                  </div>
                  <h3 className="title">{course.title}</h3>
                  <Link to={course.link} className="inline-btn">View Playlist</Link>
                </div>
              ))
            )}
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
