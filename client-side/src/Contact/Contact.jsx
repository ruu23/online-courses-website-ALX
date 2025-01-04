import { useState } from 'react';
import Footer from '../Footer/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    msg: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const getUserFromLocalStorage = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const user = getUserFromLocalStorage();

      if (!user || !user.user_id) {
        setError('Please login to send a message');
        return;
      }

      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.user_id,
          name: formData.name,
          email: formData.email,
          number: formData.number,
          message: formData.msg
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          number: '',
          msg: ''
        });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
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
              maxLength="50"
              className="box"
            />
            <textarea
              name="msg"
              className="box"
              placeholder="enter your message"
              value={formData.msg}
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
            <a href="tel:1234567890">123-456-7890</a>
            <a href="tel:1112223333">111-222-3333</a>
          </div>
          <div className="box">
            <i className="fas fa-envelope"></i>
            <h3>email address</h3>
            <a href="mailto:shaikhanas@gmail.com">shaikhanas@gmail.com</a>
            <a href="mailto:anasbhai@gmail.com">anasbhai@gmail.com</a>
          </div>
          <div className="box">
            <i className="fas fa-map-marker-alt"></i>
            <h3>office address</h3>
            <a href="#">flat no. 1, a-1 building, jogeshwari, mumbai, india - 400104</a>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
};

export default Contact;