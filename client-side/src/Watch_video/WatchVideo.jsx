import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Footer/Footer';

const WatchVideo = () => {
  const { playlistId, videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchVideo();
  }, [playlistId, videoId]);

  const fetchVideo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/courses/${playlistId}/${videoId}`);
      setVideo(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch video');
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/courses/${playlistId}/${videoId}/comment`, {
        text: newComment
      });
      setNewComment('');
      fetchVideo();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`/courses/${playlistId}/${videoId}/like`);
      fetchVideo();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to like video');
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(`/courses/${playlistId}/${videoId}/save`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save video');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <>
      <section className="watch-video">
        <div className="video-container">
          <div className="video">
            <video src={video.video_url} controls poster={video.thumbnail} id="video"></video>
          </div>
          <h3 className="title">{video.video_title}</h3>
          <div className="info">
            <p className="date">
              <i className="fas fa-calendar"></i>
              <span>{new Date().toLocaleDateString()}</span>
            </p>
          </div>
          <form className="flex">
            <button onClick={handleSave} type="button" className="inline-btn">Save Video</button>
            <button onClick={handleLike} type="button">
              <i className="far fa-heart"></i>
              <span>Like</span>
            </button>
          </form>
          <p className="description">{video.description}</p>
        </div>
      </section>

      <section className="comments">
        <h1 className="heading">Add Comment</h1>
        <form onSubmit={handleComment} className="add-comment">
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Enter your comment"
            required
            maxLength="1000"
            rows="10"
          ></textarea>
          <button type="submit" className="inline-btn">Add Comment</button>
        </form>
      </section>

      <Footer />
    </>
  );
};

export default WatchVideo;