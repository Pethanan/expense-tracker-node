const Order = require("../models/order");
const Razorpay = require("razorpay");

exports.getPurchasePremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log(process.env.RAZORPAY_KEY_SECRET);
    console.log(process.env.RAZORPAY_KEY_SECRET);
    console.log(process.env.RAZORPAY_KEY_SECRET);
    console.log(process.env.RAZORPAY_KEY_SECRET);

    console.log(rzp);
    const amount = 2500;
    console.log(amount);
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      console.log(err);
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to create order", error: err });
      }

      try {
        await req.user.createOrder({ orderId: order.id, status: "PENDING" });
        return res.json({ order, key_id: rzp.key_id });
      } catch (err) {
        return res
          .status(500)
          .json({ message: "Failed to create order", error: err });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong", error: err });
  }
};

exports.postUpdateTransactionStatus = async (req, res) => {
  try {
    console.log("entered here");
    const { paymentId, orderId } = req.body;
    Order.findOne({ where: { orderId: orderId } })
      .then((order) => {
        return order.update({ paymentId: paymentId, status: "SUCCESSFUL" });
      })
      .then((result) => {
        return req.user.update({ premiumUser: true });
      })
      .then(() => {
        return res
          .status(202)
          .json({ success: true, message: "sucessful transaction" });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    throw new Error(err);
  }
};
