import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pass: "",
    c_pass: "",
    profile: null,
    user_type: "",

  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("pass", formData.pass);
    data.append("c_pass", formData.c_pass);
    data.append("profile", formData.profile);
    data.append("user_type", formData.user_type);

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Registration failed');
        return;
      }

      const result = await response.json();
      if (result.id) {
        localStorage.setItem('user_id', result.id);
        // Store user data for immediate display
        const userData = {
          user_Name: formData.name,
          user_type: formData.user_type,
          email: formData.email,
          imgUrl: formData.profile ? URL.createObjectURL(formData.profile) : '/images/pic-1.jpg',
          comments_count: 0,
          likes_count: 0,
          saved_videos_count: 0
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Dispatch a custom event to notify components about the user data change
        window.dispatchEvent(new Event('userDataChanged'));
        
        // Redirect based on user type
        if (formData.user_type === 'teacher') {
          navigate('/teachers');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <section className="form-container">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h3>Register Now</h3>

          <p>Your Name <span>*</span></p>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            required
            maxLength="50"
            className="box"
            onChange={handleChange}
          />

          <p>Your Email <span>*</span></p>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            maxLength="50"
            className="box"
            onChange={handleChange}
          />

          <p>Your Password <span>*</span></p>
          <input
            type="password"
            name="pass"
            placeholder="Enter your password"
            required
            maxLength="20"
            className="box"
            onChange={handleChange}
          />

          <p>Confirm Password <span>*</span></p>
          <input
            type="password"
            name="c_pass"
            placeholder="Confirm your password"
            required
            maxLength="20"
            className="box"
            onChange={handleChange}
          />

          <div className="flex">
            <div className="box">
              <p>Select your role <span>*</span></p>
              <select 
                name="user_type" 
                className="select" 
                required
                value={formData.user_type}
                onChange={handleChange}
              >
                <option value="" disabled selected>Select your role</option>
                <option value="student">student</option>
                <option value="teacher">teacher</option>
              </select>
            </div>
          </div>

          <p>Select Profile <span>*</span></p>
          <input
            type="file"
            accept="image/*"
            required
            className="box"
            name="profile"
            onChange={handleChange}
          />

          <input
            type="submit"
            value="Register New"
            name="submit"
            className="btn"
          />
        </form>
      </section>

      <Footer />
    </>
  );
};

export default Register;