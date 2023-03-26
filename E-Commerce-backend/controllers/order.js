const { Order, User, Product } = require("../models/models");

const getOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name email address")
    .sort({
      createdAt: "asc",
    })
    .exec((err, foundOrders) => {
      if (!err) {
        // console.log(foundOrders)
        return res.json({ orders: foundOrders });
      } else {
        return res.status(400).json({ error: err });
      }
    });
};

const getEnumValues = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

const createOrder = (req, res) => {
  const userId = req.profile._id;
  const { order, amount, address, reference } = req.body;
  User.findById(userId).exec((err, foundUser) => {
    if (!err) {
      const userEmail = foundUser.email;
      order.forEach((item) => {
        //update the quantity of product left
        Product.findOneAndUpdate(
          { name: item.name },
          { $inc: { quantity: -item.quantity, sold: +item.quantity } },
          { new: true },
          (err, response) => {
            if (!err) {
              console.log("Creating Order...")
            } else {
              console.log(err);
            }
          }
        );
      });
      // then create the order
      Order.create(
        {
          products: order,
          amount,
          email: userEmail,
          address,
          reference,
          user: userId,
        },
        (err, result) => {
          if (!err) {
            //then push the entire details of that user's order to the user's history
            Order.find({ user: userId }).exec((err, foundOrders) => {
              if (!err) {
                foundUser.history = foundOrders;
                foundUser.save();
              }
            });
            return res
              .status(201)
              .json({ message: "Order created successfully!" });
          } else {
            return res.status(500).json({ error: err });
          }
        }
      );
    } else {
      return res.json({ error: err });
    }
  });
};

const updateOrder = (req, res) => {
  const orderId = req.params.orderId;
  const newStatus = req.body.orderStatus;
  Order.findByIdAndUpdate(
    orderId,
    { status: newStatus },
    { new: true },
    (err, result) => {
      if (!err) {
        return res.json({ message: `Order status updated to ${newStatus}` });
      } else {
        return res.json({ error: err });
      }
    }
  );
};

const getUserOrderHistory = (req, res) => {
  const userId = req.params.userId;

  Order.find({ user: userId }).exec((err, foundOrders) => {
    if (!err) {
      return res.json({ foundOrders });
    } else {
      return res.send(err);
    }
  });
};
module.exports = {
  getOrders,
  getEnumValues,
  createOrder,
  updateOrder,
  getUserOrderHistory,
};
