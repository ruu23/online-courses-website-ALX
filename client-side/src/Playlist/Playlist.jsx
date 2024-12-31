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
        <h2 className="heading">Playlist Details</h2>
        <div className="row">
          <div className="thumb">
            <img src={playlist.thumbnail || '/images/thumb-1.png'} alt="" />
            <span>{playlist.videos?.length || 0} videos</span>
          </div>
          <div className="details">
            <h3 className="title">{playlist.title}</h3>
            <p className="description">{playlist.description}</p>
            <button className="save-playlist">
              <i className="far fa-bookmark"></i> Save Playlist
            </button>
          </div>
        </div>
      </section>

      <section className="playlist-videos">
        <h2 className="heading">Playlist Videos</h2>
        <div className="box-container">
          {playlist.videos?.map((video, index) => (
            <Link key={video.id} to={`/courses/${playlistId}/${video.id}`} className="box">
              <div className="thumb">
                <img src={getFullUrl(video.thumbnail) || '/images/html-logo.png'} alt="" />
                <span>#{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="title">{video.title}</h3>
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