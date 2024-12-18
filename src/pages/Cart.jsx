import { useContext } from "react";
import PropTypes from "prop-types";
import { CartContext } from "./Concerts";

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

Cart.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
    })
  ),
};

export default Cart;
