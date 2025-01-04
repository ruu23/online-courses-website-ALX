const Contact = () => {
  return (
    <>
      <section className="contact">
        <div className="row">
          <div className="image">
            <img src="/images/contact-img.svg" alt="contact" />
          </div>
          <form action="" method="post">
            <h3>get in touch</h3>
            <input type="text" placeholder="enter your name" name="name" required maxLength="50" className="box" />
            <input type="email" placeholder="enter your email" name="email" required maxLength="50" className="box" />
            <input type="number" placeholder="enter your number" name="number" required maxLength="50" className="box" />
            <textarea name="msg" className="box" placeholder="enter your message" required maxLength="1000" cols="30" rows="10"></textarea>
            <input type="submit" value="send message" className="inline-btn" name="submit" />
          </form>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="number">Phone Number (Optional):</label>
          <input
            type="tel"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
      </section>

      <footer className="footer">
        &copy; copyright @ 2022 by <span>mr. web designer</span> | all rights reserved!
      </footer>
    </>
  );
};

export default ContactForm;
