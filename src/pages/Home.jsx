import { motion } from 'framer-motion';
import Hero from '../components/Hero';

const Home = () => {
  return (
    <div>
      <section className="relative">
        <Hero />
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-100 to-transparent" />
      </section>

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
          <p className="mb-8 text-lg">
            Stay updated with the latest news, events, and achievements
          </p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Get Started
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;