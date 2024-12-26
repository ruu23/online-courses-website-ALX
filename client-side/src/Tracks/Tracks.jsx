import { Link } from 'react-router-dom';

const Tracks = () => {
  const tracks = [
    {
      id: 1,
      name: "Web Development Track",
      image: "/images/web.jpg"
    },
    {
      id: 2,
      name: "Data Analysis Track",
      image: "/images/DataAnalysis.jpg"
    },
    {
      id: 3,
      name: "Machine Learning Track",
      image: "/images/ml.jpg"
    },
    {
      id: 4,
      name: "Artificial Intelligence",
      image: "/images/ai.jpg"
    },
    {
      id: 5,
      name: "Embedded Systems",
      image: "/images/embedded.jpg"
    }
  ];

  return (
    <section className="courses">
      <h1 className="heading">Our Tracks</h1>
      <div className="box-container">
        {tracks.map(track => (
          <div key={track.id} className="box">
            <div className="thumb">
              <img src={track.image} alt={track.name} />
            </div>
            <h3 className="title">{track.name}</h3>
            {/*<Link to={`/courses/${track.id}`} className="inline-btn">
              View Courses
            </Link>*/}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tracks;
