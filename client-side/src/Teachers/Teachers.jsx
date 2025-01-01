import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import teachersData from "./teachers.json";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState([]);

  useEffect(() => {
    setTeachers(teachersData.teachers);
    setFilteredTeachers(teachersData.teachers);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = teachers.filter(teacher => 
      teacher.user_Name.toLowerCase().includes(term.toLowerCase()) ||
      teacher.user_type.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredTeachers(filtered);
  };

  return (
    <div>
      <section className="teachers">
        <h1 className="heading">Expert Teachers</h1>

        <form className="search-tutor" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="search tutors..."
            maxLength="100"
          />
          <button type="submit" className="fas fa-search"></button>
        </form>

        <div className="box-container">
          <div className="box offer">
            <h3>Become A Tutor</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, itaque ipsam fuga ex et aliquam.</p>
            <Link to="/register" className="inline-btn">
              <button>Get Started</button>
            </Link>
          </div>
          {filteredTeachers.map((teacher) => (
            <div className="box" key={teacher._id}>
              <div className="tutor">
                <img 
                  src={teacher.imgUrl || "/images/pic-1.jpg"} 
                  alt=""
                />
                <div>
                  <h3>{teacher.user_Name}</h3>
                  <span>{teacher.user_type}</span>
                </div>
              </div>
              <div>
                <p>total playlists : <span>{teacher.playlists_count}</span></p>
                <p>total videos : <span>{teacher.videos_count}</span></p>
                <p>total likes : <span>{teacher.likes_count}</span></p>
              </div>
              <Link to={`/teacher/profile/${teacher._id}`}>
                <button className="inline-btn">View Profile</button>
              </Link>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Teachers;