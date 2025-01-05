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
      if (response.ok) {
        // Store all user data in one place
        const userData = {
          user_id: result.user_id,
          user_Name: result.username,
          user_type: result.user_type,
          email: formData.email,
          imgUrl: result.img_url ? 
            (result.img_url.startsWith('http') ? result.img_url : `http://localhost:5000${result.img_url}`) : 
            null,
        };
        console.log('User Data:', userData); // Log the user data
        setUser(userData); // Update user state
        localStorage.setItem('userData', JSON.stringify(userData)); // Persist user data
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
