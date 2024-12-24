import { useState } from "react";
import Footer from "../Footer/Footer";

const Update = () => {
  const [formData, setFormData] = useState({
    username: "",  // Changed from name to username to match backend
    email: "",
    old_pass: "",
    new_pass: "",
    c_pass: "",  // Note: Backend expects c_password
  });
  const [profilePic, setProfilePic] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("old_pass", formData.old_pass);
    form.append("new_pass", formData.new_pass);
    form.append("c_pass", formData.c_pass);  // Changed to match backend expectation
    if (profilePic) {
      form.append("img_url", profilePic);  // Changed to match backend field name
    }

    try {
      const userId = localStorage.getItem('user_id');
      
      if (!userId) {
        alert("Please log in to update your profile");
        return;
      }

      const response = await fetch(`http://localhost:5000/update-profile/${userId}`, {
        method: "PATCH",
        body: form  // Remove Content-Type header to let browser set it with boundary
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error || "An error occurred");
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
          <h3>Update Profile</h3>

          <p>Update Name</p>
          <input
            type="text"
            name="username"  // Changed from name to username
            value={formData.username}
            placeholder="Shaikh Anas"
            maxLength="50"
            className="box"
            onChange={handleChange}
          />

          <p>Update Email</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="shaikh@gmail.com"
            maxLength="50"
            className="box"
            onChange={handleChange}
          />

          <p>Previous Password</p>
          <input
            type="password"
            name="old_pass"
            value={formData.old_pass}
            placeholder="Enter your old password"
            maxLength="20"
            className="box"
            onChange={handleChange}
          />

          <p>New Password</p>
          <input
            type="password"
            name="new_pass"
            value={formData.new_pass}
            placeholder="Enter your new password"
            maxLength="20"
            className="box"
            onChange={handleChange}
          />

          <p>Confirm Password</p>
          <input
            type="password"
            name="c_pass"
            value={formData.c_pass}
            placeholder="Confirm your new password"
            maxLength="20"
            className="box"
            onChange={handleChange}
          />

          <p>Update Pic</p>
          <input
            type="file"
            accept="image/*"
            className="box"
            onChange={handleFileChange}
          />

          <input type="submit" value="Update Profile" className="btn" />
        </form>
      </section>

      <Footer />
    </>
  );
};

export default Update;