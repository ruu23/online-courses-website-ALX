import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Footer/Footer';

const TeacherProfile = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/teachers/${id}`);
        setTeacher(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!teacher) return <p>Teacher not found</p>;

  return (
    <>
      <section className="teacher-profile">
        <div className="profile-details">
          <h1>Profile Details</h1>
          <div className="profile-info">
            <img src={teacher.img_url} alt={teacher.name} className="profile-image" />
            <div className="info">
              <h2>{teacher.name}</h2>
              <p>{teacher.subject}</p>
              <p>{teacher.email}</p>
              <p className="bio">{teacher.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {teacher.courses && (
        <section className="courses">
          <h1>Courses</h1>
          <div className="courses-container">
            {teacher.courses.map((course) => (
              <div key={course.id} className="course-card">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <Footer />
    </>
  );
};

export default TeacherProfile;