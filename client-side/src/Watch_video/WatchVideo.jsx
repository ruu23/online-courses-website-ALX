import { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import axios from 'axios';
import Footer from '../Footer/Footer';
import '../App.css';

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
    
    const user = JSON.parse(localStorage.getItem('user_id'));
    if (!user) {
      setError('Please log in to comment');
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`http://localhost:5000/courses/${playlistId}/${videoId}/comment`, {
        text: newComment.trim(),
        user_id: user.user_id,
      });

      const newCommentData = {
        id: response.data.id,
        text: response.data.text,
        user_id: user.user_id,
        username: user.username,
        created_at: new Date().toISOString(),
      };

      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment('');
      setError(null);
    } catch (err) {
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
        user_id: user,
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
        <div className="video-container">
          <div className="video">
            <video 
              src={getFullUrl(video.video_url)} 
              controls 
              autoPlay
            ></video>
          </div>
          
          <h3 className="title">{video.video_title}</h3>
          
          <div className="info">
            <p><i className="fas fa-calendar"></i><span>Posted on: </span>{new Date(video.created_at).toLocaleDateString()}</p>
            <p><i className="fas fa-heart"></i><span>Likes: </span>{likeCount}</p>
          </div>

          <div className="tutor">
            <img src={getFullUrl(video.tutor_image) || '/default-avatar.png'} alt="tutor" />
            <div>
              <h3>{video.tutor_name || 'Instructor'}</h3>
              <span>Course Instructor</span>
            </div>
          </div>

          <div className="description">
            <p>{video.description}</p>
          </div>

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
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        <div className="comments">
          <h3 className="">Comments</h3>
          
          <form onSubmit={handleComment} className="add-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              required
            />
            <button 
              type="submit" 
              disabled={!newComment.trim()}
              className="btn-submit"
            >
              Add Comment
            </button>
          </form>

          <div className="box-container">
            {comments.length === 0 ? (
              <h3>No comments yet. Be the first to comment!</h3>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="box">
                  <div className="user">
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
                  <p className="comment-box">{comment.text}</p>
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
