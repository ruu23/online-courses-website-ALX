import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import { useUser } from '../UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
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
    console.log('Login form submitted'); // Debugging line

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Server Response:', result); // Log the server response
      console.log('Inspecting Server Response:', JSON.stringify(result, null, 2)); // Inspect server response
      if (response.ok) {
        // Store all user data in one place
        const userData = {
          user_id: result.user_id !== undefined ? result.user_id : null, // Handle undefined
          user_Name: result.username || "Unknown User", // Fallback to default if undefined
          user_type: result.user_type || "student", // Default to "student" if not provided
          email: formData.email,
          imgUrl: result.img_url
            ? `http://localhost:5000/static/uploads/${result.img_url}` // Ensure correct path
            : "http://localhost:5000/static/uploads/default-avatar.jpg", // Default avatar
        };
        console.log('Full Backend Response:', result);
        console.log('Processed User Data:', userData);
        setUser(userData); // Update user state
        localStorage.setItem("userData", JSON.stringify(userData)); // Persist user data
        localStorage.setItem("user_id", userData.user_id || "N/A");
        localStorage.setItem("img_url", userData.imgUrl || "N/A");
        localStorage.setItem("username", userData.user_Name || "Guest");
        navigate('/profile'); // Redirect to profile page
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error("Error during login:", error); // Log any errors that occur
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
