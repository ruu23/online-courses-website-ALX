import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    pass: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        // Store user ID directly
        localStorage.setItem("user_id", result.user_id);
        
        // Create userData object
        const userData = {
          user_id: result.user_id,
          user_Name: result.username,
          user_type: result.user_type,
          email: formData.email,
          imgUrl: result.img_url || '/images/pic-1.jpg',
          comments_count: result.comments_count || 0,
          likes_count: result.likes_count || 0,
          saved_videos_count: result.saved_videos_count || 0
        };
        
        localStorage.setItem("userData", JSON.stringify(userData));
        
        // Dispatch event to notify components about user data change
        window.dispatchEvent(new Event('userDataChanged'));
        
        // Redirect based on user type
        if (result.user_type === 'teacher') {
          navigate('/teachers');
        } else {
          navigate('/');
        }
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <section className="form-container">
        <form onSubmit={handleSubmit}>
          <h3>Login Now</h3>

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

          <input type="submit" value="Login Now" className="btn" />
        </form>
      </section>

      <Footer />
    </>
  );
};

export default Login;
