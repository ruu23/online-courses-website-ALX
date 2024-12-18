import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer/Footer";
import { useState, useEffect } from "react";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("");
        console.log("Fetched data:", response.data);
        setTeachers(response.data || []);
      } catch (error) {
        console.error("Error fetching teachers data:", error);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <>

      <section className="teachers">
        <h1 className="heading">Expert Teachers</h1>

        <form className="search-tutor">
          <input
            type="text"
            name="search_box"
            placeholder="Search tutors..."
            required
            maxLength="100"
          />
          <button type="submit" className="fas fa-search"></button>
        </form>

        <div className="box-container">
          <div className="box offer">
            <h3>Become a Tutor</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
              itaque ipsam fuga ex et aliquam.
            </p>
            <Link to="/register" className="inline-btn">
              Get Started
            </Link>
          </div>

          {Array.isArray(teachers) && teachers.map((teacher) => (
            <div className="box" key={teacher.id}>
              <div className="tutor">
                <img src={teacher.image} alt={teacher.name} />
                <div>
                  <h3>{teacher.name}</h3>
                  <span>{teacher.role}</span>
                </div>
              </div>
              <p>Total playlists: <span>{teacher.playlists}</span></p>
              <p>Total videos: <span>{teacher.videos}</span></p>
              <p>Total likes: <span>{teacher.likes}</span></p>
              <Link to={teacher.profileLink} className="inline-btn">
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Teachers;
