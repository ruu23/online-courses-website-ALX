import { useState } from "react";
import Footer from "../Footer/Footer";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pass: "",
    c_pass: "",
    profile: null,
    role: "student", // Default role
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
    data.append("user_type", formData.role);

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
      alert(result.message || 'Registration successful');
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
            placeholder="Enter your username"
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

          <p>Select Role <span>*</span></p>
          <select
            name="user_type"
            className="box"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
          </select>

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