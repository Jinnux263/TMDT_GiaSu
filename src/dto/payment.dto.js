const PaymentDTO = (
  user_id,
  name,
  email,
  paymentID,
  address,
  cart,
  status,
) => ({
  user_id,
  name,
  email,
  paymentID,
  address,
  cart,
  status,
});

module.exports = PaymentDTO;
