import React, { useState, createContext } from "react";

export const CartContext = createContext();
export const FavoritesContext = createContext();

const ConcertContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const addToCart = (concert) => {
    setCart((prevCart) => [...prevCart, concert]);
  };

  const toggleFavorite = (concert) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === concert.id)) {
        return prevFavorites.filter((fav) => fav.id !== concert.id);
      } else {
        return [...prevFavorites, concert];
      }
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
        {children}
      </FavoritesContext.Provider>
    </CartContext.Provider>
  );
};

export default ConcertContextProvider;
