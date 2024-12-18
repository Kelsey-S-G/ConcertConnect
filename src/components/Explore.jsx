import React from 'react';
import PropTypes from 'prop-types';

const Explore = ({ concerts }) => {
  // Ensure concerts is an array before slicing and mapping
  if (!Array.isArray(concerts)) {
    return <div>Error: concerts is not an array</div>;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Concerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {concerts.slice(0, 4).map((concert, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">{concert.name}</h3>
              <p className="text-gray-700 mb-4">{concert.date}</p>
              <p className="text-gray-700">{concert.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

Explore.propTypes = {
  concerts: PropTypes.array.isRequired
};

export default Explore;
