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
        setLoading(true);
        const response = await fetch("/api/concerts/get_concerts", {
          headers: { "Cache-Control": "no-cache" },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch concert data");
        }
        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.concerts)) {
          // Sort based on the status field from the database
          const sorted = data.concerts.reduce(
            (acc, concert) => {
              if (concert.status === 'upcoming') {
                acc.upcoming.push(concert);
              } else {
                acc.past.push(concert);
              }
              return acc;
            },
            { upcoming: [], past: [] }
          );

          // Sort upcoming concerts by date (earliest first)
          sorted.upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

          // Sort past concerts by date (most recent first)
          sorted.past.sort((a, b) => new Date(b.date) - new Date(a.date));

          setUpcomingConcerts(sorted.upcoming);
          setPastConcerts(sorted.past);
        } else {
          throw new Error("Invalid data format received from server");
        }
      } catch (err) {
        console.error("Error fetching concerts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
    const intervalId = setInterval(fetchConcerts, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date TBD";
    // Ensure we're working with a string in YYYY-MM-DD format
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day); // month is 0-based in JS
    
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr || timeStr === '00:00:00') return "Time TBD";
    
    // Handle MySQL time format (HH:MM:SS)
    const [hours, minutes] = timeStr.split(':');
    
    // Create date object for today with the specified time
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const ConcertCard = ({ concert, isPast }) => {
    const [showDetails, setShowDetails] = useState(false);
    
    // Fixed id comparison for cart
    const isInCart = cart.some(item => item.id === concert.id);
    
    // Fixed id comparison for favorites
    const isFavorite = favorites.some(fav => fav.id === concert.id);

    return (
      <Card className="group hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-800" />
        <CardHeader className="space-y-1 pl-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-800">
              {concert.genre || "Genre TBD"}
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
            <Clock className="w-4 h-4 text-blue-800" />
            <span>{formatTime(concert.time)}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="h-5 w-5 text-blue-800" />
              <span className="font-medium">{concert.location || "Location TBD"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <DollarSign className="h-5 w-5 text-blue-800" />
              <span className="font-medium">{concert.price || "Price TBD"}</span>
            </div>
            {!isPast && (
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleCart(concert)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isInCart 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => toggleFavorite(concert)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isFavorite
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-yellow-400 hover:bg-yellow-500 text-white'
                  }`}
                >
                  {isFavorite ? 'Unfavorite' : 'Favorite'}
                </button>
              </div>
            )}
            {isPast && (
              <>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-primary flex items-center space-x-1"
                >
                  <span>{showDetails ? 'Hide Details' : 'View Details'}</span>
                  <ChevronRight className={`w-4 h-4 transform transition-transform ${
                    showDetails ? 'rotate-90' : ''
                  }`} />
                </button>
                {showDetails && <p>{concert.details || "No details available"}</p>}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  ConcertCard.propTypes = {
    concert: PropTypes.shape({
      concert_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      date: PropTypes.string,
      time: PropTypes.string,
      location: PropTypes.string,
      details: PropTypes.string,
      genre: PropTypes.string,
      price: PropTypes.string,
      status: PropTypes.string
    }).isRequired,
    isPast: PropTypes.bool,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-800 data-[state=active]:text-white">
            Upcoming Concerts ({upcomingConcerts.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-blue-800 data-[state=active]:text-white">
            Past Concerts ({pastConcerts.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-8">
          {upcomingConcerts.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No upcoming concerts available</p>
          ) : (
            upcomingConcerts.map((concert) => (
              <ConcertCard key={concert.concert_id} concert={concert} />
            ))
          )}
        </TabsContent>
        <TabsContent value="past" className="space-y-8">
          {pastConcerts.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No past concerts available</p>
          ) : (
            pastConcerts.map((concert) => (
              <ConcertCard key={concert.concert_id} concert={concert} isPast />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Concerts;
