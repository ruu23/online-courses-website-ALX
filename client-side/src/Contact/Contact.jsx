import { useState } from 'react';
import Footer from '../Footer/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    message: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields before sending the request
    if (!formData.name || !formData.email || !formData.number || !formData.message) {
      setError('All fields are required.');
      setMessage('');
      return;
    }

    try {
      const userId = localStorage.getItem('user_id');

      if (!userId) {
        setError('Please log in to send a message.');
        setMessage('');
        return;
      }

      // Check if the email already exists
      const existingContactResponse = await fetch(`http://localhost:5000/contact/check-email?email=${formData.email}`);
      
      if (existingContactResponse.ok) {
        const existingData = await existingContactResponse.json();
        if (existingData.exists) {
          setError('This email is already associated with another contact.');
          setMessage('');
          return;
        }
      }

      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          name: formData.name,
          email: formData.email,
          number: formData.number,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Message sent successfully!');
        setError('');
        setFormData({ name: '', email: '', number: '', message: '' });
      } else {
        const errorMessage = data.error || 'Failed to send message. Please try again.';
        setError(errorMessage);
        setMessage('');
      }
    } catch (err) {
      setError('Failed to send message. Please check your connection and try again.');
      setMessage('');
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
        // Redirect or update UI as needed
      } else {
        console.error(data.message);
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error logging in. Please try again later.');
    }
  };

  return (
    <>
      <section className="contact">
        <div className="row">
          <div className="image">
            <img src="/images/contact-img.svg" alt="contact" />
          </div>
          
          <form onSubmit={handleSubmit}>
            <h3>get in touch</h3>
            
            {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            {message && <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>}
            
            <input
              type="text"
              placeholder="enter your name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength="50"
              className="box"
            />

            <input
              type="email"
              placeholder="enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength="50"
              className="box"
            />

            <input
              type="tel"
              placeholder="enter your number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
              maxLength="15"
              className="box"
            />

            <textarea
              name="message"
              className="box"
              placeholder="enter your message"
              value={formData.message}
              onChange={handleChange}
              required
              maxLength="1000"
              cols="30"
              rows="10"
            ></textarea>

            <input type="submit" value="send message" className="inline-btn" />
          </form>
        </div>

        <div className="box-container">
          <div className="box">
            <i className="fas fa-phone"></i>
            <h3>phone number</h3>
            <a href="tel:01550805897">01550805897</a>
            <a href="tel:01550805897">01011637857</a>
          </div>
          
          <div className="box">
            <i className="fas fa-envelope"></i>
            <h3>email address</h3>
            <a href="mailto:bidohani13@gmail.com">bidohani13@gmail.com</a>
            <a href="mailto:amira.sayedza@gmail.com">amira.sayedza@gmail.com</a>
          </div>
          
          <div className="box">
            <i className="fas fa-map-marker-alt"></i>
            <h3>office address</h3>
            <a href="#">Ground Floor, Building Number 3, St. No 208, Degla Maadi, Cairo</a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;