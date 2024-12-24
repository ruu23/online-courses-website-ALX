import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);

  // Fetch profile and courses data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await fetch(''); //http://localhost:5000/teacherProfile
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);

        const coursesResponse = await fetch('http://localhost:5000/courses');
        const coursesData = await coursesResponse.json();
        setCourses(coursesData.courses);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <section className="teacher-profile">
        <div className="profile-details">
          <h1>Profile Details</h1>
          <div className="profile-info">
            <h2>{profile.name}</h2>
            <p>{profile.role}</p>
          </div>
          <ul className="stats">
            <li>Total Playlists: {profile.totalPlaylists}</li>
            <li>Total Videos: {profile.totalVideos}</li>
            <li>Total Likes: {profile.totalLikes}</li>
            <li>Total Comments: {profile.totalComments}</li>
          </ul>
        </div>
      </section>

      <section className="courses">
        <h1>Our Courses</h1>
        <div className="courses-container">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="thumb">
                <span>{course.videos} videos</span>
              </div>
              <h3 className="title">{course.title}</h3>
              <Link to={`/playlist/${course.id}`} className="inline-btn">
                View Playlist
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TeacherProfile;
