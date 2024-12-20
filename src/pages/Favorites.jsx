import { useContext } from "react";
import { FavoritesContext } from "../context/ConcertContextProvider";
import { Card, CardContent, CardHeader, CardTitle } from "../components/cards/card.jsx";
import { Calendar, MapPin, Clock, DollarSign } from "lucide-react";

const Favorites = () => {
  const { favorites } = useContext(FavoritesContext);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Favorited Concerts</h2>
      {!favorites || favorites.length === 0 ? (
        <p>No favorited concerts.</p>
      ) : (
        favorites.map((concert) => (
          <Card key={concert.id} className="mb-4">
            <CardHeader className="space-y-1 pl-6">
              <CardTitle className="text-2xl font-extrabold">{concert.name}</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(concert.date)}</span>
                <MapPin className="w-4 h-4" />
                <span>{concert.location}</span>
                <Clock className="w-4 h-4" />
                <span>{concert.time}</span>
                <DollarSign className="w-4 h-4" />
                <span>{concert.price}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p>{concert.details}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Favorites;
