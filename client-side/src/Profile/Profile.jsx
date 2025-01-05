import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";

const Profile = () => {
  const [userData, setUserData] = useState(() => {
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : {
      user_Name: "User",
      user_type: "student",
      imgUrl: "/public/images/default-avatar.jpg",
      comments_count: 0,
      likes_count: 0,
      saved_videos_count: 0
    };
  });
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        const userData = storedUserData ? JSON.parse(storedUserData) : null;
        
        if (!userData || !userData.user_id) {
          window.location.href = '/login';
          return;
        }
        
        const response = await fetch(`http://localhost:5000/profile?user_id=${userData.user_id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();

        if (data.imgUrl) {
          let cleanPath = data.imgUrl;
          
          // Handle potential double "/static/uploads/"
          if (cleanPath.includes('/static/uploads//')) {
            cleanPath = cleanPath.replace('/static/uploads//', '/static/uploads/');
          }

          // Prepend base URL if the path is relative
          data.imgUrl = cleanPath.startsWith('http')
            ? cleanPath
            : `http://localhost:5000${cleanPath}`;
        } else {
          data.imgUrl = "/public/images/default-avatar.jpg";
        }

        setUserData(data);
        localStorage.setItem('userData', JSON.stringify(data));
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div>
      <section className="user-profile">
        <h1 className="heading">Your Profile</h1>

        <div className="info">
          <div className="user">
            <img
              src={imgError ? "/public/images/default-avatar.jpg" : userData.imgUrl || "/public/images/default-avatar.jpg"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto block"
              onError={(e) => {
                setImgError(true);
                e.target.src = "/public/images/default-avatar.jpg";
              }}
            />
            <h3>{userData.user_Name}</h3>
            <p>{userData.user_type}</p>
            <Link to="/update-profile" className="inline-btn">
              Update Profile
            </Link>
          </div>

          <div className="box-container">
            <div className="box">
              <div className="flex">
                <i className="fas fa-bookmark"></i>
                <div>
                  <span>{userData.saved_videos_count}</span>
                  <p>Saved playlists</p>
                </div>
              </div>
              <Link to="#" className="inline-btn">
                View playlists
              </Link>
            </div>

            <div className="box">
              <div className="flex">
                <i className="fas fa-heart"></i>
                <div>
                  <span>{userData.likes_count}</span>
                  <p>Videos liked</p>
                </div>
              </div>
              <Link to="#" className="inline-btn">
                View liked
              </Link>
            </div>

            <div className="box">
              <div className="flex">
                <i className="fas fa-comment"></i>
                <div>
                  <span>{userData.comments_count}</span>
                  <p>Videos commented</p>
                </div>
              </div>
              <Link to="#" className="inline-btn">
                View comments
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Profile;
