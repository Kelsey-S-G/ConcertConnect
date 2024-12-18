import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/cards/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../components/cards/card.jsx";
import { Calendar, MapPin, Clock, ChevronRight, DollarSign } from "lucide-react";
import { CartContext, FavoritesContext } from "../context/ConcertContextProvider";

const Concerts = () => {
  const { cart, toggleCart } = useContext(CartContext);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const [upcomingConcerts, setUpcomingConcerts] = useState([]);
  const [pastConcerts, setPastConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetch("/api/concerts/get_concerts");
        if (!response.ok) {
          throw new Error("Failed to fetch concert data");
        }
        const data = await response.json();
        setUpcomingConcerts(data.upcoming || []);
        setPastConcerts(data.past || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const ConcertCard = ({ concert, isPast }) => {
    const [showDetails, setShowDetails] = useState(false);

    const isInCart = cart.some((item) => item.id === concert.id);

    return (
      <Card className="group hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-800" />
        <CardHeader className="space-y-1 pl-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-800">
              {concert.genre}
            </span>
            {!isPast && (
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 rounded-full">
                Upcoming
              </span>
            )}
          </div>
          <CardTitle className="text-2xl font-extrabold flex items-center group-hover:text-blue-800 transition-colors">
            {concert.name}
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4 text-blue-800" />
            <span>{formatDate(concert.date)}</span>
            <MapPin className="w-4 h-4 text-blue-800" />
            <span>{concert.location}</span>
            <Clock className="w-4 h-4 text-blue-800" />
            <span>{concert.time}</span>
            <DollarSign className="w-4 h-4 text-blue-800" />
            <span>{concert.price}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="h-5 w-5 text-blue-800" />
              <span className="font-medium">{concert.location}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <DollarSign className="h-5 w-5 text-blue-800" />
              <span className="font-medium">{concert.price}</span>
            </div>
            {!isPast ? (
              <>
                <button
                  onClick={() => toggleCart(concert)}
                  className={`px-4 py-2 rounded-md ${isInCart ? 'bg-red-400 text-white' : 'bg-blue-400 text-white'}`}
                >
                  {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => toggleFavorite(concert)}
                  className="bg-yellow-400 text-white px-4 py-2 rounded-md ml-2"
                >
                  {favorites.some((fav) => fav.id === concert.id) ? "Unfavorite" : "Favorite"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-primary flex items-center space-x-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                {showDetails && <p>{concert.details}</p>}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  ConcertCard.propTypes = {
    concert: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      details: PropTypes.string,
      genre: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
    }).isRequired,
    isPast: PropTypes.bool,
  };

  if (loading) return <p>Loading concerts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-800 data-[state=active]:text-white">
            Upcoming Concerts
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-blue-800 data-[state=active]:text-white">
            Past Concerts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-8">
          {upcomingConcerts.map((concert) => (
            <ConcertCard key={concert.id} concert={concert} />
          ))}
        </TabsContent>
        <TabsContent value="past" className="space-y-8">
          {pastConcerts.map((concert) => (
            <ConcertCard key={concert.id} concert={concert} isPast />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Concerts;

