const Order = require("../models/order");
const Razorpay = require("razorpay");
const SequelizeDB = require("../util/database");

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
  const t = await SequelizeDB.transaction();

  try {
    console.log("entered here");
    const { paymentId, orderId } = req.body;
    const order = Order.findOne({
      where: { orderId: orderId, transaction: t },
    });
    await t.commit();
    const result = order.update({
      paymentId: paymentId,
      status: "SUCCESSFUL",
      transaction: t,
    });

    await t.commit();
    await req.user.update({ premiumUser: true, transaction: t });

    await t.commit();
    return res
      .status(202)
      .json({ success: true, message: "sucessful transaction" });
  } catch (err) {
    await t.rollback();
    throw new Error(err);
  }
};
