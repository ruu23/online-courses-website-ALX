import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Footer from '../Footer/Footer';

const Playlist = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/courses/${playlistId}`);
        setPlaylist(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch playlist');
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000/${path}`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!playlist) return <div>Playlist not found</div>;

  return (
    <div>
      <section className="playlist-details">
        <h1 className="heading">Playlist Details</h1>
        <div className="row">
          <div className="column">
            <div className="thumb">
              <span>{playlist.videos?.length || 0} videos</span>
            </div>
          </div>
          <div className="column">
            <div className="details">
              <h3>{playlist.title}</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="playlist-videos">
        <h1 className="heading">Playlist Videos</h1>
        <div className="box-container">
        {playlist.videos?.map(video => (
          <Link
              key={video.id} 
              to={`/courses/${playlistId}/${video.id}`}
              className="box"
            >
              <div className="video-container">
                <video 
                  poster={getFullUrl(video.thumbnail)}
                  className="video"
                >
                  <source src={getFullUrl(video.video_url)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="play-button">
                  <i className="fas fa-play"></i>
                </div>
              </div>
              <h3>{video.title}</h3>
              <p>{video.description}</p>
            </Link>
          ))}  
          {playlist.videos?.length === 0 && (
            <div className="box">
              <p>No videos available in this playlist.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Playlist;