import Footer from '../Footer/Footer';
import reviewsData from '/public/reviews.json'; 

const About = () => {
  return (
    <>
      <section className="about">
  <div className="row">
    <div className="image">
      <img src="images/about-img.svg" alt="" />
    </div>

    <div className="content">
      <h3>Why Choose Us?</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut dolorum
        quasi illo? Distinctio expedita commodi, nemo a quam error repellendus
        sint, fugiat quis numquam eum eveniet sequi aspernatur quaerat tenetur.
      </p>
      <a href="courses.html" className="inline-btn">Our Courses</a>
    </div>
  </div>

  <div className="box-container">
    <div className="box">
      <i className="fas fa-graduation-cap"></i>
      <div>
        <h3>+10k</h3>
        <p>Online Courses</p>
      </div>
    </div>

    <div className="box">
      <i className="fas fa-user-graduate"></i>
      <div>
        <h3>+40k</h3>
        <p>Brilliant Students</p>
      </div>
    </div>

    <div className="box">
      <i className="fas fa-chalkboard-user"></i>
      <div>
        <h3>+2k</h3>
        <p>Expert Tutors</p>
      </div>
    </div>

    <div className="box">
      <i className="fas fa-briefcase"></i>
      <div>
        <h3>100%</h3>
        <p>Job Placement</p>
      </div>
    </div>
  </div>
</section>


      <section className="reviews">
        <h1 className="heading">Student's Reviews</h1>
        <div className="box-container">
          {reviewsData.reviews.map((review, index) => (
            <div className="box" key={index}>
              <p>{review.text}</p>
              <div className="student">
                <img src={review.student.image} alt="student" />
                <div>
                  <h3>{review.student.name}</h3>
                  <div className="stars">
                    {[...Array(5)].map((_, starIndex) => (
                      <i
                        key={starIndex}
                        className={
                          starIndex < Math.floor(review.student.rating)
                            ? "fas fa-star"
                            : starIndex < review.student.rating
                            ? "fas fa-star-half-alt"
                            : "fas fa-star-empty"
                        }
                      ></i>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;