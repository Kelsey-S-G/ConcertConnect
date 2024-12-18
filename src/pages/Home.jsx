import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Explore from '../components/Explore';

const Home = () => {
  // State to store the fetched concerts data
  const [upcomingConcerts, setUpcomingConcerts] = useState([]);

  // Fetch concerts from the database on component mount
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetch('/api/concerts/get_concerts'); // Change this URL based on your actual endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch concerts');
        }
        const data = await response.json();
        setUpcomingConcerts(data);
      } catch (error) {
        console.error('Error fetching concerts:', error);
      }
    };

    fetchConcerts();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div>
      <section className="relative">
        <Hero />
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-100 to-transparent" />
      </section>

      <Explore concerts={upcomingConcerts} /> {}

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-blue-900 text-white py-12"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Concert Community
          </h2>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;

