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

    let user = localStorage.getItem('user_id');
    if (!user) {
      setError('Please log in to comment');
      return;
    }

    try {
      user = JSON.parse(user);
      if (!newComment.trim()) {
        setError('Comment cannot be empty');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/courses/${playlistId}/${videoId}/comment`,
        {
          text: newComment.trim(),
          user_id: user.user_id, // Ensure this matches backend expectations
        }
      );

      const newCommentData = {
        id: response.data.id,
        text: response.data.text,
        user_id: user.user_id,
        username: user.username,
        created_at: new Date().toISOString(),
      };

      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment(''); // Clear the input field after successful submission
      setError(null);
    } catch (err) {
      console.error('Comment error:', err);
      setError(err.response?.data?.message || 'Failed to add comment');
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
        user_id: user.user_id,
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
        user_id: user.user_id,
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
    <div>
      <section className="watch-video">
        <div className="video-details">
          <nav className="video-nav">
            <Link to={`/courses/${playlistId}`} className="btn-back">
              <i className="fas fa-arrow-left"></i> Back to Playlist
            </Link>
          </nav>
          <h1 className="video-title">{video.video_title}</h1>
          <p className="video-description">{video.description}</p>
        </div>

        <div className="video-container">
          <video
            src={getFullUrl(video.video_url)}
            controls
            autoPlay
            className="video-player"
          ></video>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="video-actions">
          <button
            className={`btn-like ${isLiked ? 'active' : ''}`}
            onClick={handleLike}
          >
            <i className={`fas fa-thumbs-up ${isLiked ? 'active' : ''}`}></i>
            <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
          </button>

          <button
            className={`btn-save ${isSaved ? 'active' : ''}`}
            onClick={handleSave}
          >
            <i className={`fas fa-bookmark ${isSaved ? 'active' : ''}`}></i>
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>

        <div className="comments-section">
          <h3 className="comments-heading">Comments</h3>

          <form onSubmit={handleComment} className="comments-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              required
              className="comments-input"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="btn-submit"
            >
              Add Comment
            </button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <strong>{comment.username || `User ${comment.user_id}`}</strong>
                    <span className="comment-date">
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
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
