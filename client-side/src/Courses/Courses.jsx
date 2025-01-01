import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Tracks from '../Tracks/Tracks';


export default function Courses() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/courses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPlaylists(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching courses:", error);
        if (error.message.includes('Failed to fetch')) {
          setError('Cannot connect to server. Please check if the server is running.');
        } else {
          setError('Failed to load courses. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      {/* Tracks section always appears */}
      <Tracks />
      
      {/* Courses section */}
      <section className="courses">
        <h1 className="heading">Available Courses</h1>
        <div className="box-container">
          {loading ? (
            <div className="box">
              <p className='heading'>Loading courses...</p>
            </div>
          ) : error ? (
            <div className="box">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="inline-btn"
              >
                Try Again
              </button>
            </div>
          ) : playlists.length === 0 ? (
            <div className="box">
              <p className='heading'>No courses available at the moment.</p>
            </div>
          ) : (
            playlists.map(playlist => (
              <div key={playlist.id} className="box">
                <div className='thumb'>
                  <img 
                    src={`http://localhost:5000/${playlist.thumbnail}`} 
                    alt={playlist.title}
                    onError={(e) => {
                      e.target.src = '/placeholder-course.png'; // Add a placeholder image
                      e.target.onerror = null; // Prevent infinite loop
                    }}
                  />
                  <span>6 videos</span>
                </div>
                  <h3 className="title" style={{fontWeight: 'bold'}}>{playlist.title}</h3>
                  <Link to={`/courses/${playlist.id}`} className="inline-btn">
                    View Playlist
                  </Link>
              </div>
            ))
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}