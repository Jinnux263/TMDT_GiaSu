export const PaymentDTO = (
  user_id,
  name,
  email,
  paymentID,
  address,
  cart,
  status,
) => {
  return {
    user_id,
    name,
    email,
    paymentID,
    address,
    cart,
    status,
  };
};
