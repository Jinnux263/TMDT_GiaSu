const Payments = require('../models/payments.model');
const Users = require('../models/users.model');
const Products = require('../models/products.model');
const utils = require('../utils.js')
 
class PaymentsController {
   async getPayments(req, res) {
       try {
           // const payments = await Payments.find();
           const payments = await utils.getAll('/Payments')
           return res.json(payments);
       } catch (err) {
           return res.status(500).json({ msg: err.message });
       }
   }
 
   async createPayment(req, res) {
       try {
           // const user = await Users.findById(req.user.id).select('-password');
           const user = await utils.getById('/Users', req.user.id);
           if (!user) {
               return res.status(400).json({ msg: 'User not found' });
           }
 
           const { cart, paymentID, address } = req.body;
           console.log("=======cart====", cart)
           const { id, name, email } = user;
           const addPayment = {
               user_id: id,
               name,
               email,
               cart,
               id: paymentID,
               address,
               created_at: `${new Date()}`
           }
           await utils.add('/Payments', addPayment)
 
           // const newPayment = new Payments({
           //     user_id: _id,
           //     name,
           //     email,
           //     cart,
           //     paymentID,
           //     address,
           // });
           // await newPayment.save();
 
           // cart.filter((item) => {
           //     return rentedProduct(item.id, item.quantity, item.rented);
           // });
 
           // return res.json({ newPayment });
           return res.json({ msg: 'Thanh toán thành công' });
       } catch (err) {
           return res.status(500).json({ msg: err.message });
       }
   }
}
 
const rentedProduct = async (id, quantity, oldRented) => {
   await Products.findByIdAndUpdate(
       { _id: id },
       {
           rented: quantity + oldRented,
       },
   );
};
 
module.exports = new PaymentsController();
 

