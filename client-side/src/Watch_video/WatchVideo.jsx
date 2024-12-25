import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Footer/Footer';

const WatchVideo = () => {
  const { playlistId, videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [playlistId, videoId]);

  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000/${path}`;
  };

  const fetchVideo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/courses/${playlistId}/${videoId}`);
      setVideo(response.data);
      setIsLiked(response.data.is_liked);
      setIsSaved(response.data.is_saved);
      setLikeCount(response.data.like_count);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch video');
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/courses/${playlistId}/${videoId}/comments`);
      setComments(response.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/courses/${playlistId}/${videoId}/comment`, {
        text: newComment
      });
      setNewComment('');
      fetchComments(); // Refresh comments after posting
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/courses/${playlistId}/${videoId}/like`);
      setIsLiked(response.data.is_liked);
      setLikeCount(response.data.like_count);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to like video');
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/courses/${playlistId}/${videoId}/save`);
      setIsSaved(response.data.is_saved);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save video');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!video) return <div className="error">Video not found</div>;

  return (
    <div className="watch-page">
      <section className="watch-video">
        <div className="video-details">
          <nav className="nav">
            <Link to={`/courses/${playlistId}`} className="back-btn">
              <i className="fas fa-arrow-left"></i> Back to Playlist
            </Link>
          </nav>
          <h1 className="title">{video.title}</h1>
        </div>

        <div className="video-container">
          <video 
            controls 
            autoPlay
            poster={getFullUrl(video.thumbnail)}
            className="main-video"
          >
            <source src={getFullUrl(video.video_url)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="video-info">
          <div className="video-actions">
            <button 
              onClick={handleLike} 
              className={`action-btn ${isLiked ? 'liked' : ''}`}
            >
              <i className={`fas fa-heart ${isLiked ? 'active' : ''}`}></i>
              <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
            </button>
            <button 
              onClick={handleSave} 
              className={`action-btn ${isSaved ? 'saved' : ''}`}
            >
              <i className={`fas fa-bookmark ${isSaved ? 'active' : ''}`}></i>
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
          
          <div className="description">
            <h3>Description:</h3>
            <p>{video.description}</p>
          </div>
        </div>
      </section>

      <section className="comments-section">
        <h2 className="section-title">Comments</h2>
        <form onSubmit={handleComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
            maxLength="1000"
            rows="3"
          ></textarea>
          <button type="submit" className="submit-btn">
            Post Comment
          </button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="username">{comment.username}</span>
                  <span className="date">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default WatchVideo;