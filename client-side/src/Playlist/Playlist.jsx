import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Footer from '../Footer/Footer';

const Playlist = () => {
  const { id } = useParams(); // Get the playlist ID from the URL
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('')
      .then(response => {
        const playlists = response.data.playlists;
        const selectedPlaylist = playlists.find(pl => pl.id === parseInt(id));
        if (selectedPlaylist) {
          setPlaylist(selectedPlaylist);
        } else {
          console.error("Playlist not found");
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching playlist data:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!playlist) {
    return <p>Playlist not found.</p>;
  }

  return (
    <div>
      <section className="playlist-details">
        <h1 className="heading">Playlist Details</h1>

        <div className="row">
          <div className="column">
            <form action="" method="post" className="save-playlist">
              <button type="submit"><i className="far fa-bookmark"></i> <span>Save Playlist</span></button>
            </form>
            <div className="thumb">
              <img src={playlist.thumbnail.image} alt={playlist.title} />
              <span>{playlist.thumbnail.videos} videos</span>
            </div>
          </div>

          <div className="column">
            <div className="tutor">
              <img src={playlist.tutor.image} alt={playlist.tutor.name} />
              <div>
                <h3>{playlist.tutor.name}</h3>
                <span>{playlist.tutor.date}</span>
              </div>
            </div>

            <div className="details">
              <h3>{playlist.title}</h3>
              <p>{playlist.description}</p>
              <Link to="/teacher_profile" className="inline-btn">View Profile</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="playlist-videos">
        <h1 className="heading">Playlist Videos</h1>

        <div className="box-container">
          {playlist.videos.map(video => (
            <Link key={video.id} className="box" to={video.link}>
              <i className="fas fa-play"></i>
              <img src={video.image} alt={video.title} />
              <h3>{video.title}</h3>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Playlist;
