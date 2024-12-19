import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Explore = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetch("/api/concerts/get_concerts");
        if (!response.ok) {
          throw new Error('Failed to fetch concerts');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setConcerts(data.concerts);
        } else {
          throw new Error(data.message || 'Failed to fetch concerts');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Upcoming Concerts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {concerts.slice(0, 4).map((concert) => (
            <div
              key={concert.id}
              className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
            >
              <div className="mb-4">
                <span className="inline-block px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                  {concert.genre}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {concert.name}
              </h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <span className="mr-2">📅</span>
                  {new Date(concert.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {concert.time && (
                  <p className="flex items-center">
                    <span className="mr-2">🕒</span>
                    {new Date(`2000-01-01T${concert.time}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric'
                    })}
                  </p>
                )}
                <p className="flex items-center">
                  <span className="mr-2">📍</span>
                  {concert.location}
                </p>
                <p className="flex items-center font-semibold text-gray-900">
                  <span className="mr-2">💰</span>
                  {concert.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

Explore.propTypes = {
  concerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string,
      location: PropTypes.string.isRequired,
      genre: PropTypes.string,
      price: PropTypes.string
    })
  )
};

export default Explore;
