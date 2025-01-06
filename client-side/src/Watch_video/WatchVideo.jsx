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

  // Updated getUserFromLocalStorage to handle multiple storage formats
  const getUserFromLocalStorage = () => {
    try {
      // First try to get direct user_id
      const directUserId = localStorage.getItem('user_id');
      if (directUserId) {
        return { user_id: directUserId };
      }

      // Then try to get from userData object
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        if (userData && userData.user_id) {
          return { user_id: userData.user_id };
        }
      }

      // If no user data found
      return null;
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/courses/${playlistId}/${videoId}`);
        setVideo(response.data);
        setComments(response.data.comments || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch video');
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [playlistId, videoId]);

  const handleComment = async (e) => {
    e.preventDefault();
    const user = getUserFromLocalStorage();
    
    if (!user || !user.user_id) {
      setError('Please log in to comment');
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/courses/${playlistId}/${videoId}/comment`,
        {
          text: newComment.trim(),
          user_id: user.user_id
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const newCommentData = {
        id: response.data.id,
        text: response.data.text,
        user_id: user.user_id,
        username: response.data.username,
        created_at: response.data.created_at
      };

      setComments(prev => [...prev, newCommentData]);
      setNewComment('');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
    }
  };

  const handleEditComment = async (commentId, updatedText) => {
    const user = getUserFromLocalStorage();
    
    if (!user || !user.user_id) {
      setError('Please log in to edit comments');
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/courses/${playlistId}/${videoId}/comment/${commentId}`,
        {
          text: updatedText,
          user_id: user.user_id,
          playlist_id: playlistId
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.comment) {
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, text: response.data.comment.text }
              : comment
          )
        );
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to edit comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const user = getUserFromLocalStorage();
    
    if (!user || !user.user_id) {
      setError('Please log in to delete comments');
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/courses/${playlistId}/${videoId}/comment/${commentId}`,
        {
          data: { user_id: user.user_id },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete comment');
    }
  };

  const handleLike = async () => {
    const user = getUserFromLocalStorage();
    
    if (!user || !user.user_id) {
      setError('Please log in to like videos');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/courses/${playlistId}/${videoId}/like`,
        { user_id: user.user_id },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setIsLiked(response.data.is_liked);
      setLikeCount(response.data.like_count);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to like video');
    }
  };

  const handleSave = async () => {
    const user = getUserFromLocalStorage();
    
    if (!user || !user.user_id) {
      setError('Please log in to save videos');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/courses/${playlistId}/${videoId}/save`,
        { user_id: user.user_id },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setIsSaved(response.data.is_saved);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save video');
    }
  };

  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000/${path}`;
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
        // Redirect or update UI as needed
      } else {
        console.error(data.message);
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to log in');
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
            <video src={getFullUrl(video.video_url)} controls autoPlay></video>
          </div>

          <h3 className="title">{video.video_title}</h3>

          <div className="info">
            <p className="text-sm">
              <i className="fas fa-heart"></i>
              <span>{likeCount} likes</span>
            </p>
          </div>

          <div className="flex">
            <button
              className={`like-btn ${isLiked ? 'active' : ''}`}
              onClick={handleLike}
            >
              <i className={`fas fa-heart ${isLiked ? 'active' : ''}`}></i>
              <span>Like</span>
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
        <h1 className="heading">Add Comment</h1>
        <form onSubmit={handleComment} className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
            className="w-full p-2 border rounded"
          />
          <button 
            type="submit" 
            className="inline-btn"
            disabled={!newComment.trim()}
          >
            Add Comment
          </button>
        </form>

        <h1 className="heading mt-8">Comments</h1>
        <div className="box-container">
          {comments.length === 0 ? (
            <p className="text-center">No comments yet</p>
          ) : (
            comments.map((comment) => {
              const user = getUserFromLocalStorage();
              return (
                <div key={comment.id} className="box">
                  <div className="user">
                    <div>
                      <h3>{comment.username}</h3>
                      <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="comment-box">{comment.text}</p>
                  {user && user.user_id === comment.user_id && (
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
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default WatchVideo;