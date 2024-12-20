import { useState } from "react";
import Footer from "../Footer/Footer";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pass: "",
    c_pass: "",
    profile: null,
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
  
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirm_password", confirmPassword);
    formData.append("user_type", userType);  // Add the role
    formData.append("profile", profileImage);  // Add the profile image file
  
    try {
      const response = await fetch("/register", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Registration successful");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
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
