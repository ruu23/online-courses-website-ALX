import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const HeaderAndSideBar = ({ onSearch }) => {
  const [sideBarActive, setSideBarActive] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if there's a stored preference
    const storedMode = localStorage.getItem('dark-mode');
    if (storedMode) {
      return storedMode === 'enabled';
    }
    
    // Check if it's nighttime (between 6 PM and 6 AM)
    const currentHour = new Date().getHours();
    return currentHour >= 18 || currentHour < 6;
  });
  const [profileActive, setProfileActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(() => {
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : {
      user_Name: "user name",
      user_type: "student",
      imgUrl: "/public/images/pic-1.jpg"
    };
  });
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedData = localStorage.getItem('userData');
      const userData = storedData ? JSON.parse(storedData) : null;
      
      if (userData && userData.user_id) {
        try {
          const response = await fetch(`http://localhost:5000/profile?user_id=${userData.user_id}`);
          if (response.ok) {
            const data = await response.json();
            // Handle the image URL
            if (data.imgUrl) {
              const cleanPath = data.imgUrl.replace(/\/static\/uploads\/static\/uploads\//, '/static/uploads/');
              data.imgUrl = cleanPath.startsWith('http') 
                ? cleanPath 
                : `http://localhost:5000${cleanPath}`;
            }
            setUserData(data);
            // Update localStorage with latest data
            localStorage.setItem('userData', JSON.stringify(data));
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    // Initial fetch
    fetchUserData();

    // Listen for user data changes
    const handleUserDataChange = () => {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const data = JSON.parse(storedData);
        if (data.imgUrl) {
          const cleanPath = data.imgUrl.replace(/\/static\/uploads\/static\/uploads\//, '/static/uploads/');
          data.imgUrl = cleanPath.startsWith('http') 
            ? cleanPath 
            : `http://localhost:5000${cleanPath}`;
        }
        setUserData(data);
      }
    };

    window.addEventListener('userDataChanged', handleUserDataChange);
    window.addEventListener('storage', handleUserDataChange);

    return () => {
      window.removeEventListener('userDataChanged', handleUserDataChange);
      window.removeEventListener('storage', handleUserDataChange);
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Handle the image URL
        if (parsedData.imgUrl) {
          const cleanPath = parsedData.imgUrl.replace(/\/static\/uploads\/static\/uploads\//, '/static/uploads/');
          parsedData.imgUrl = cleanPath.startsWith('http') 
            ? cleanPath 
            : `http://localhost:5000${cleanPath}`;
        }
        setUserData(parsedData);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const checkTime = () => {
      const currentHour = new Date().getHours();
      const isNightTime = currentHour >= 18 || currentHour < 6;
      
      // Only change if user hasn't manually set a preference
      if (!localStorage.getItem('dark-mode-manual')) {
        setDarkMode(isNightTime);
      }
    };

    // Check every minute
    const interval = setInterval(checkTime, 60000);
    
    // Initial check
    checkTime();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('dark-mode', darkMode ? 'enabled' : 'disabled');
  }, [darkMode]);

  const toggleSideBar = () => {
    setSideBarActive(!sideBarActive);
    document.body.classList.toggle('active', !sideBarActive);
  };

  const toggleDarkMode = () => {
    // When user manually toggles, store this preference
    localStorage.setItem('dark-mode-manual', 'true');
    setDarkMode(!darkMode);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
    navigate('/search');
  };

  return (
    <>
      <header className="header">
        <section className="flex">
          <Link to="/" className="logo">Educa.</Link>
          <form onSubmit={handleSearchSubmit} className={`search-form ${searchActive ? 'active' : ''}`}>
            <input
              type="text"
              name="search_box"
              required
              placeholder="search courses..."
              maxLength="100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="fas fa-search"></button>
          </form>
          <div className="icons">
            <div id="menu-btn" className="fas fa-bars" onClick={toggleSideBar}></div>
            <div id="search-btn" className="fas fa-search" onClick={() => setSearchActive(!searchActive)}></div>
            <div id="user-btn" className="fas fa-user" onClick={() => setProfileActive(!profileActive)}></div>
            <div id="toggle-btn" className={`fas ${darkMode ? 'fa-moon' : 'fa-sun'}`} onClick={toggleDarkMode}></div>
          </div>
          <div className={`profile ${profileActive ? 'active' : ''}`}>
            <img 
              src={userData.imgUrl} 
              className="w-24 h-24 rounded-full object-cover mx-auto" 
              alt="" 
              onError={() => setImgError(true)}
            />
            {imgError && (
              <img 
                src="/public/images/pic-1.jpg" 
                className="w-24 h-24 rounded-full object-cover mx-auto" 
                alt=""
              />
            )}
            <h3 className="name">{userData.user_Name}</h3>
            <p className="role">{userData.user_type}</p>
            <Link to="/profile" className="btn">view profile</Link>
            <div className="flex-btn">
              <Link to="/login" className="option-btn">login</Link>
              <Link to="/register" className="option-btn">register</Link>
            </div>
          </div>
        </section>
      </header>

      <div className={`side-bar ${sideBarActive ? 'active' : ''}`}>
        <div id="close-btn" onClick={toggleSideBar}>
          <i className="fas fa-times"></i>
        </div>
        <div className="profile">
          <img 
            src={userData.imgUrl} 
            className="w-24 h-24 rounded-full object-cover mx-auto" 
            alt="Profile" 
            onError={() => setImgError(true)}
          />
          {imgError && (
            <img 
              src="/public/images/pic-1.jpg" 
              className="w-24 h-24 rounded-full object-cover mx-auto" 
              alt=""
            />
          )}
          <h3 className="name">{userData.user_Name}</h3>
          <p className="role">{userData.user_type}</p>
          <Link to="/profile" className="btn">view profile</Link>
        </div>
        <nav className="navbar">
          <Link to="/"><i className="fas fa-home"></i><span>home</span></Link>
          <Link to="/about"><i className="fas fa-question"></i><span>about</span></Link>
          <Link to="/courses"><i className="fas fa-graduation-cap"></i><span>courses</span></Link>
          <Link to="/teachers"><i className="fas fa-chalkboard-user"></i><span>teachers</span></Link>
          <Link to="/contact"><i className="fas fa-headset"></i><span>contact us</span></Link>
        </nav>
      </div>
    </>
  );
};

export default HeaderAndSideBar;