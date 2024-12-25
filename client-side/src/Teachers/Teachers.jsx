import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer/Footer";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/teachers");
      setTeachers(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTeachers(filtered);
  };

  return (
    <>
      <section className="teachers">
        <h1 className="heading">Expert Teachers</h1>

        <form onSubmit={handleSearch} className="search-tutor">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tutors..."
            maxLength="100"
          />
          <button type="submit" className="fas fa-search"></button>
        </form>

        <div className="box-container">
          <div className="box offer">
            <h3>Become a Tutor</h3>
            <p>Join our teaching community and share your knowledge.</p>
            <Link to="/register" className="inline-btn">Get Started</Link>
          </div>

          {teachers.map((teacher) => (
            <div className="box" key={teacher.id}>
              <div className="tutor">
                <img src={teacher.img_url} alt={teacher.name} />
                <div>
                  <h3>{teacher.name}</h3>
                  <span>{teacher.subject}</span>
                </div>
              </div>
              <p>{teacher.bio}</p>
              <Link to={`/teachers/${teacher.id}`} className="inline-btn">
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