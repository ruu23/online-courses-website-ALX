import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";

const Profile = () => {
  const [userData, setUserData] = useState({
    user_Name: "User",
    role: "Student", // Default role, can be overwritten by backend
    imgUrl: "/public/images/pic-1.jpg",
  });
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        
        if (!userId) {
          // Handle case where user is not logged in
          // Maybe redirect to login page
          return;
        }
        const response = await fetch(`http://localhost:5000/profile?user_id=${userId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.imgUrl && !data.imgUrl.startsWith('http')) {
          data.imgUrl = `http://localhost:5000${data.imgUrl}`;
        }
        // Ensure role and name are properly set
        setUserData({
          user_Name: data.username || "User",  // Assuming username field from backend
          role: data.role || "Student",         // Assuming role field from backend
          imgUrl: data.imgUrl || "/public/images/pic-1.jpg", // Default image if none provided
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <section className="user-profile">
        <h1 className="heading">Your Profile</h1>

        <div className="info">
          <div className="user">
            <img
              src={imgError ? "/public/images/pic-1.jpg" : userData.imgUrl}
              alt="Profile"
              onError={(e) => {
                setImgError(true);
                e.target.src = "/public/images/pic-1.jpg";
              }}
            />
            <h3>{userData.user_Name}</h3>
            <p>{userData.role}</p> {/* Displaying the role */}
            <Link to="/update-profile" className="inline-btn">
              Update Profile
            </Link>
          </div>

          <div className="box-container">
            <div className="box">
              <div className="flex">
                <i className="fas fa-bookmark"></i>
                <div>
                  <span>0</span>
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
                  <span>0</span>
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
                  <span>0</span>
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
