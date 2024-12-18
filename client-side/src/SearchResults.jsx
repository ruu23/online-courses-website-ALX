import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ results }) => {
  return (
    <section className="courses">
      <h1 className="heading">Search Results</h1>
      <div className="box-container">
        {results.length > 0 ? (
          results.map(course => (
            <div key={course.id} className="box">
              <div className="tutor">
                <img src={course.tutor.image} alt={course.tutor.name} />
                <div className="info">
                  <h3>{course.tutor.name}</h3>
                  <span>{course.tutor.date}</span>
                </div>
              </div>
              <div className="thumb">
                <img src={course.thumbnail.image} alt={course.title} />
                <span>{course.thumbnail.videos} videos</span>
              </div>
              <h3 className="title">{course.title}</h3>
              <Link to={course.link} className="inline-btn">View Playlist</Link>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </section>
  );
};

export default SearchResults;
