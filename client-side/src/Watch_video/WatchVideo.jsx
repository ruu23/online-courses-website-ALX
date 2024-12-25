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
              className="box" 
              to={`/courses/${playlistId}/${video.id}`}
            >
              <i className="fas fa-play"></i>
              <img src={video.thumbnail} alt={video.title} />
              <h3>{video.title}</h3>
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