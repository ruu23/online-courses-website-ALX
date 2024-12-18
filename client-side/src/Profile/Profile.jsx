import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "User",
    role: "Student",
    profile: "/public/images/pic-1.jpg",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/profile");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setUserData(data);
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
              src={userData.profile}
              alt="Profile"
            />
            <h3>{userData.name}</h3>
            <p>{userData.role}</p>
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
