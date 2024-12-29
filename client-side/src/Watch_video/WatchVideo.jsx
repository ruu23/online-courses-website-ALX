import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Footer/Footer';
import './WatchVideo.css';

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
      setComments(response.data.comments || []);
      setIsLiked(response.data.is_liked);
      setIsSaved(response.data.is_saved);
      setLikeCount(response.data.like_count);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch video');
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    
    // Get user from localStorage
    const userData = localStorage.getItem('user_id');
    if (!userData) {
      setError('Please log in to comment');
      return;
    }

    const user = JSON.parse(userData);
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/courses/${playlistId}/${videoId}/comment`,
        {
          text: newComment.trim(),
          user_id: user.user_id
        }
      );
      
      // Add the new comment to the list
      const commentData = response.data;
      setComments(prevComments => [
        ...prevComments,
        {
          id: commentData.id,
          text: commentData.text,
          user_id: commentData.user_id,
          username: commentData.username,
          created_at: commentData.created_at
        }
      ]);
      
      // Clear the input and any errors
      setNewComment('');
      setError(null);
    } catch (err) {
      console.error('Comment error:', err);
      setError(err.response?.data?.error || 'Failed to add comment');
    }
  };

  const handleLike = async () => {
    const user = JSON.parse(localStorage.getItem('user_id'));
    if (!user) {
      setError('Please log in to like videos');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/courses/${playlistId}/${videoId}/like`, {
        user_id: user.user_id
      });
      setIsLiked(response.data.is_liked);
      setLikeCount(response.data.like_count);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to like video');
    }
  };

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem('user_id'));
    if (!user) {
      setError('Please log in to save videos');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/courses/${playlistId}/${videoId}/save`, {
        user_id: user.user_id
      });
      setIsSaved(response.data.is_saved);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save video');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!video) return <div className="error">Video not found</div>;

  return (
    <div className="watch-page">
      <section className="watch-video">
        {/* Video Navigation */}
        <div className="video-details">
          <nav className="nav">
            <Link to={`/courses/${playlistId}`} className="back-btn">
              <i className="fas fa-arrow-left"></i> Back to Playlist
            </Link>
          </nav>
          <h1 className="title">{video.video_title}</h1>
          <p className="description">{video.description}</p>
        </div>

        {/* Video Player */}
        <div className="video-container">
          <video 
            src={getFullUrl(video.video_url)} 
            controls 
            autoPlay
            className="video"
          ></video>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">{error}</div>
        )}

        {/* Video Actions */}
        <div className="video-actions">
          <button 
            className={`like-btn ${isLiked ? 'active' : ''}`} 
            onClick={handleLike}
          >
            <i className={`fas fa-thumbs-up ${isLiked ? 'active' : ''}`}></i>
            <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
          </button>

          <button 
            className={`save-btn ${isSaved ? 'active' : ''}`} 
            onClick={handleSave}
          >
            <i className={`fas fa-bookmark ${isSaved ? 'active' : ''}`}></i>
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>Comments</h3>
          
          {/* Comment Form */}
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              required
              className="comment-input"
            />
            <button 
              type="submit" 
              disabled={!newComment.trim()}
              className="comment-submit"
            >
              Add Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <strong>{comment.username || `User ${comment.user_id}`}</strong>
                    <span className="comment-date">
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default WatchVideo;