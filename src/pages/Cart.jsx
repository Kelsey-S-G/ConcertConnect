import PropTypes from "prop-types";

const Cart = ({ cart }) => {
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
  ).isRequired,
};

export default Cart;
