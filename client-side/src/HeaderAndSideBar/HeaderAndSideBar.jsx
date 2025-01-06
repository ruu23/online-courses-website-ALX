import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const HeaderAndSideBar = ({ onSearch }) => {
  const [sideBarActive, setSideBarActive] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('dark-mode');
    return storedMode ? storedMode === 'enabled' : new Date().getHours() >= 18 || new Date().getHours() < 6;
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
    const handleUserDataChange = () => {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);

        if (parsedData.imgUrl) {
          const cleanPath = parsedData.imgUrl.replace(/\/static\/uploads\/static\/uploads\//, '/static/uploads/');
          parsedData.imgUrl = cleanPath.startsWith('http') 
            ? cleanPath 
            : `http://localhost:5000${cleanPath}`;
        }

        setUserData(parsedData);
      }
    };

    window.addEventListener('storage', handleUserDataChange);
    window.addEventListener('userDataChanged', handleUserDataChange);

    return () => {
      window.removeEventListener('storage', handleUserDataChange);
      window.removeEventListener('userDataChanged', handleUserDataChange);
    };
  }, []);

  const toggleSideBar = () => {
    setSideBarActive(!sideBarActive);
    document.body.classList.toggle('active', !sideBarActive);
  };

  const toggleDarkMode = () => {
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
              src={imgError ? "/public/images/pic-1.jpg" : userData.imgUrl || "/public/images/pic-1.jpg"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto"
              onError={() => setImgError(true)}
            />
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
            src={imgError ? "/public/images/pic-1.jpg" : userData.imgUrl || "/public/images/pic-1.jpg"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mx-auto"
            onError={() => setImgError(true)}
          />
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
