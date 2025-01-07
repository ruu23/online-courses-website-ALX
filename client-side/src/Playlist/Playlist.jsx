import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Footer from '../Footer/Footer';

const Playlist = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/courses/${playlistId}`);
        setPlaylist(response.data);
        setIsSaved(response.data.is_saved || false); // Assuming the backend provides this field
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

  const handleSavePlaylist = async () => {
    const user = JSON.parse(localStorage.getItem('user_id'));
    if (!user) {
      alert('Please log in to save playlists');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/courses/${playlistId}/save`, {
        user_id: user.user_id,
      });

      setIsSaved(response.data.is_saved);
      alert(response.data.message);
    } catch (err) {
      console.error('Error saving playlist:', err);
      alert(err.response?.data?.message || 'Failed to save playlist');
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, pass: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('img_url', data.imgUrl);
        alert('Login successful!');
      } else {
        console.error(data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error logging in. Please try again.');
    }
  };

  if (loading) return <div className='heading'>Loading...</div>;
  if (error) return <div className='heading'>Error: {error}</div>;
  if (!playlist) return <div className='heading'>Playlist not found</div>;

  return (
    <div>
      <section className="playlist-details">
        <h2 className="heading">Playlist Details</h2>
        <div className="row">
          <div className='column'>
            <form action="" method="post" className="save-playlist">
              <button 
                className={` ${isSaved ? 'saved' : ''}`} 
                onClick={handleSavePlaylist}
                type='submit'
              >
                <i className={`far ${isSaved ? 'fa-check-circle' : 'fa-bookmark'}`}></i> 
                <span>{isSaved ? 'Saved' : 'Save Playlist'}</span>
              </button>
            </form>
            <div className="thumb">
              <img 
                src={`http://localhost:5000/${playlist.videos[0]?.thumbnail}`}  
                alt="Playlist Thumbnail" 
                onError={(e) => {
                  e.target.src = '/images/fallback-thumbnail.png';
                  e.target.onerror = null; 
                }} 
              />
              <span>{playlist.videos?.length || 0} videos</span>
            </div>
            {console.log('Playlist Data:', playlist)}
            {console.log('Thumbnail URL:', getFullUrl(playlist.videos[0]?.thumbnail))}
          </div>
          <div className="column flex items-start mb-[250px]">
            <div className="details">
              <h3 style={{ fontWeight: "bold" }}>{playlist.title}</h3>
              <p className="text-gray-600">{playlist.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="playlist-videos">
        <h2 className="heading">Playlist Videos</h2>
        <div className="box-container">
          {playlist.videos?.map((video) => (
            <Link key={video.id} to={`/courses/${playlistId}/${video.id}`} className="box">
              <i className="fas fa-play"></i>
              <img src={getFullUrl(video.thumbnail) || '/images/html-logo.png'} alt="" />
              <h3 style={{ fontWeight: "bold" }}>{video.title}</h3>
            </Link>
          ))}
          {playlist.videos?.length === 0 && (
            <div className="box">
              <p className='heading'>No videos available in this playlist.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Playlist;
