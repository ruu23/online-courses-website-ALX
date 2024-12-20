import { useState } from "react";
import Footer from "../Footer/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email: email,
      pass: password,
    };

    try {
      const response = await fetch("http://localhost:5000/login", { // Make sure the URL matches your backend
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Welcome, ${data.username}`);
        // Handle successful login, store user data, redirect, etc.
        // For example, store user ID in localStorage
        localStorage.setItem('user_id', data.user_id);
        // Optionally redirect to profile or home page
        // window.location.href = "/profile"; // Or use React Router
      } else {
        alert(data.message);  // Show error message
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during login.");
    }
  };

  return (
    <div>
      <section className="form-container">
        <form onSubmit={handleLoginSubmit}>
          <h3>Login</h3>

          <p>Your Email <span>*</span></p>
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <p>Your Password <span>*</span></p>
          <input
            type="password"
            placeholder="Enter your password"
            required
            className="box"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="submit"
            value="Login"
            className="btn"
          />
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
