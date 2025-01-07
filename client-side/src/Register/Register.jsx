import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import { useUser } from '../UserContext';

const Register = () => {
  const { setUser } = useUser();
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

    if (formData.pass !== formData.c_pass) {
      alert("Passwords do not match!");
      return;
    }

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

      const result = await response.json();
      
      if (response.ok) {
        // Store user ID directly
        localStorage.setItem("user_id", result.user_id);
        
        // Create userData object
        const userData = {
          user_id: result.user_id,
          user_Name: formData.name,
          user_type: formData.user_type,
          email: formData.email,
          imgUrl: formData.profile ? URL.createObjectURL(formData.profile) : '/images/pic-1.jpg',
          comments_count: 0,
          likes_count: 0,
          saved_videos_count: 0
        };
        
        setUser(userData); // Update user context
        localStorage.setItem("userData", JSON.stringify(userData));
        
        // Dispatch event to notify components about user data change
        window.dispatchEvent(new Event('userDataChanged'));
        
        // Redirect based on user type
        if (formData.user_type === 'teacher') {
          navigate('/teachers');
        } else {
          navigate('/');
        }
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, pass: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('img_url', data.imgUrl);
        alert(data.message || 'Register successed');
        // Redirect or update UI as needed
      } else {
        console.error(data.message);
        // Display error message to user
      }
    } catch (error) {
      console.error('Error:', error);
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

          <p>Select Profile <span>*</span></p>
          <input
            type="file"
            name="profile"
            accept="image/*"
            required
            className="box"
            onChange={handleChange}
          />

          <p>Select User Type <span>*</span></p>
          <select
            name="user_type"
            className="box"
            required
            onChange={handleChange}
            value={formData.user_type}
          >
            <option value="">Select Type</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <input type="submit" value="Register Now" className="btn" />
        </form>
      </section>

      <Footer />
    </>
  );
};

export default Register;