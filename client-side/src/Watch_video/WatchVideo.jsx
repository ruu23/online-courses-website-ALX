import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';

const WatchVideo = () => {
  const [commentsData, setCommentsData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    fetch('/comments.json') // Adjust the path as necessary
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch comments data');
        }
        return response.json();
      })
      .then((data) => {
        // Ensure the fetched data is an array
        if (Array.isArray(data)) {
          setCommentsData(data);
        } else {
          setError('Fetched data is not an array');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);  // Empty dependency array to run only once when the component mounts

  // If the data is still loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there was an error, show the error message
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>

      <section className="watch-video">
        <div className="video-container">
          <div className="video">
            <video src="/images/vid-1.mp4" controls poster="/images/post-1-1.png" id="video"></video>
          </div>
          <h3 className="title">Complete HTML tutorial (part 01)</h3>
          <div className="info">
            <p className="date"><i className="fas fa-calendar"></i><span>22-10-2022</span></p>
            <p className="date"><i className="fas fa-heart"></i><span>44 likes</span></p>
          </div>
          <div className="tutor">
            <img src="/images/pic-2.jpg" alt="tutor" />
            <div>
              <h3>john deo</h3>
              <span>developer</span>
            </div>
          </div>
          <form action="" method="post" className="flex">
            <Link to="/playlist" className="inline-btn">view playlist</Link>
            <button><i className="far fa-heart"></i><span>like</span></button>
          </form>
          <p className="description">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque labore ratione, hic exercitationem mollitia obcaecati culpa dolor placeat provident porro.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid iure autem non fugit sint. A, sequi rerum architecto dolor fugiat illo, iure velit nihil laboriosam cupiditate voluptatum facere cumque nemo!
          </p>
        </div>
      </section>

      <section className="comments">
        <h1 className="heading">5 comments</h1>

        <form action="" className="add-comment">
          <h3>add comments</h3>
          <textarea name="comment_box" placeholder="enter your comment" required maxLength="1000" cols="30" rows="10"></textarea>
          <input type="submit" value="add comment" className="inline-btn" name="add_comment" />
        </form>

        <h1 className="heading">User comments</h1>

        <div className="box-container">
          {/* Only map if commentsData is an array */}
          {Array.isArray(commentsData) && commentsData.length > 0 ? (
            commentsData.map((comment, index) => (
              <div key={index} className="box">
                <div className="user">
                  <img src={comment.user.profileImage} alt="user" />
                  <div>
                    <h3>{comment.user.name}</h3>
                    <span>{comment.user.date}</span>
                  </div>
                </div>
                <div className="comment-box">{comment.comment}</div>
                {comment.actions && (
  <form action="" className="flex-btn">
    {comment.actions.map((action, index) => (
      <input
        key={index}
        type="submit"
        value={action.label}
        name={action.action + "_comment"}
        className={`inline-${action.action}-btn`} // This generates the class dynamically
      />
    ))}
                  </form>
                )}
              </div>
            ))
          ) : (
            <p>No comments available</p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default WatchVideo;
