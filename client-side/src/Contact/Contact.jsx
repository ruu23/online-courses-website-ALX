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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // submission logic
    console.log('Form submitted:', formData);
    setMessage('Message sent successfully!');
    // Clear form
    setFormData({
      name: '',
      email: '',
      number: '',
      msg: ''
    });
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
              type="number" 
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
            <a href="mailto:shaikhanas@gmail.com">shaikhanas@gmail.come</a>
            <a href="mailto:anasbhai@gmail.com">anasbhai@gmail.come</a>
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
