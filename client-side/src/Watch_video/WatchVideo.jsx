import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/courses/${playlistId}/${videoId}`);
        const data = response.data;
        
        setVideo(data);
        setComments(data.comments || []);
        
        // Get user to check if video is liked
        const user = getUserFromLocalStorage();
        if (user && data.likes && Array.isArray(data.likes)) {
          setIsLiked(data.likes.includes(user.user_id));
        } else {
          setIsLiked(false);
        }
        
        // Set the like count from the server
        setLikeCount(data.like_count || 0);
        setIsSaved(data.is_saved || false);
        setLoading(false);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch video');
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [playlistId, videoId]);

  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000/${path}`;
  };

  const getUserFromLocalStorage = () => {
    try {
      // First try to get the user ID directly
      const userId = localStorage.getItem('user_id');
      if (userId) {
        return { user_id: userId };
      }
      
      // If not found, try to get from userData
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed && parsed.user_id) {
          return { user_id: parsed.user_id };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      return null;
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    const user = getUserFromLocalStorage();
    if (!user) {
      setError('Please log in to comment');
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`http://localhost:5000/courses/${playlistId}/${videoId}/comment`, {
        text: newComment.trim(),
        user_id: user.user_id,
        img:user.imgUrl
      });

      const newCommentData = {
        id: response.data.id,
        text: response.data.text,
        user_id: user.user_id,
        username: response.data.username,
        created_at: response.data.created_at,
      };

      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment('');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
    }
  };

  const handleEditComment = async (commentId, updatedText) => {
    const user = getUserFromLocalStorage();
    if (!user) {
      setError('Please log in to edit comments');
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:5000/courses/${playlistId}/${videoId}/comment/${commentId}`, {
        text: updatedText,
        user_id: user.user_id,
      });

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, text: response.data.text } : comment
        )
      );
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to edit comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const user = getUserFromLocalStorage();
    if (!user) {
      setError('Please log in to delete comments');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/courses/${playlistId}/${videoId}/comment/${commentId}`);
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete comment');
    }
  };

  const handleLike = async () => {
    const user = getUserFromLocalStorage();
    if (!user) {
      setError('Please log in to like videos');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/courses/${playlistId}/${videoId}/like`, {
        user_id: user.user_id,
      });

      // Update like status and count from server response
      setIsLiked(response.data.is_liked);
      setLikeCount(response.data.like_count);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to like video');
    }
  };

  const handleSave = async () => {
    const user = getUserFromLocalStorage();
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
      setError(err.response?.data?.error || 'Failed to save video');
    }
  };

  if (loading) return <div className="heading">Loading...</div>;
  if (error) return <div className="heading">{error}</div>;
  if (!video) return <div className="heading">Video not found</div>;

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
            <p>
              <i className="fas fa-calendar"></i>
              <span>Posted on: </span>
              {new Date(video.created_at).toLocaleDateString()}
            </p>
            <p>
              <i className="fas fa-heart"></i>
              <span>{likeCount} Likes</span>
            </p>
          </div>

          <div className="flex">
            <button
              className={`like-btn ${isLiked ? 'active' : ''}`}
              onClick={handleLike}
            >
              <i className={`fas fa-heart ${isLiked ? 'active' : ''}`}></i>
              <span className={isLiked ? 'active' : ''}>{likeCount} {likeCount === 0 ? 'Like' : 'Likes'}</span>
            </button>

            <button 
              className={`inline-btn ${isSaved ? 'active' : ''}`} 
              onClick={handleSave}
            >
              <i className={`fas fa-bookmark ${isSaved ? 'active' : ''}`}></i>
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="comments">
        <h1 className="heading">Comments</h1>

        <form onSubmit={handleComment} className="add-comment">
          <h3 style={{ fontWeight: "bold" }}>Add Comments</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <button 
            type="submit" 
            value="add comment"
            disabled={!newComment.trim()}
            className="inline-btn"
          >
            Add Comment
          </button>
        </form>

        <h1 className="heading">User Comments</h1>
        <div className="box-container">
          {comments.length === 0 ? (
            <h3>No comments yet. Be the first to comment!</h3>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="box">
                <div className="user">
                  <img src={comment.img || "/images/pic-2.jpg"} alt=""/>
                  <div>
                    <h3 style={{ fontWeight: "bold" }}>{comment.username || `User ${comment.user_id}`}</h3>
                    <span>
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <p className="comment-box">{comment.text}</p>
                <div className="flex-btn">
                  <button 
                    onClick={() => {
                      const updatedText = prompt('Edit your comment:', comment.text);
                      if (updatedText) handleEditComment(comment.id, updatedText);
                    }}
                    className="inline-option-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteComment(comment.id)} 
                    className="inline-delete-btn"
                  >
                    Delete
                  </button>
                </div>
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