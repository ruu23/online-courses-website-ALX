import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import About from './About/About';
import Teachers from './Teachers/Teachers';
import Contact from './Contact/Contact';
import Login from './Login/Login';
import WatchVideo from './Watch_video/WatchVideo';
import TeacherProfile from './Teacher_profile/TeacherProfile';
import Register from './Register/Register';
import Update from './Update/Update';
import Playlist from './Playlist/Playlist';
import Courses from './Courses/Courses';
import HeaderAndSideBar from './HeaderAndSideBar/HeaderAndSideBar';
import SearchResults from './SearchResults';
import { useState } from 'react';
import axios from 'axios';
import { UserProvider } from './UserContext';

function App() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    axios.get('/courses.json').then(response => {
      const data = response.data;
      const results = data.tracks.flatMap(track =>
        track.courses.filter(course =>
          course.title.toLowerCase().includes(query.toLowerCase())
        )
      );
      setSearchResults(results);
    });
  };

  return (
    <UserProvider>
      <BrowserRouter>
        <HeaderAndSideBar onSearch={handleSearch} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/:id" element={<TeacherProfile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update-profile" element={<Update />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:playlistId/:videoId" element={<WatchVideo />} />
          <Route path="/courses/:playlistId" element={<Playlist />} />
          <Route path="/search" element={<SearchResults results={searchResults} />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
