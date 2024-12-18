import { useContext } from "react";
import { CartContext } from "../context/ConcertContextProvider";

const Cart = () => {
  const { cart } = useContext(CartContext);

  return (
    <div>
      <p>Number of items in cart: {cart ? cart.length : 0}</p>
      <ul>
        {cart && cart.map((concert) => (
          <li key={concert.id}>
            {concert.name} - {concert.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
