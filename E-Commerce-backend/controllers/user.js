const { User, Product } = require("../models/models");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { sign } = require("jsonwebtoken");

const registerUser = function (req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    try {
      const { name, email, password } = req.body;
      User.findOne({ email }, (err, foundUser) => {
        if (!foundUser) {
          if (email === "cmgbeokwere6@gmail.com") {
            const user = {
              name,
              email,
              role: 1,
              password: bcrypt.hashSync(password, 10),
            };
            User.create(user, (err, result) => {
              if (!err) {
                return res.json({ messsage: "User created successfully!" });
              } else {
                return res.json({ error: err });
              }
            });
          } else {
            const user = {
              name,
              email,
              password: bcrypt.hashSync(password, 10),
            };

            User.create(user, (err, result) => {
              if (!err) {
                return res.json({ messsage: "User created successfully!" });
              } else {
                return res.status(400).json({ error: err });
              }
            });
          }
        } else {
          return res.status(400).json({
            error: "User already exists",
          });
        }
      });
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  } else {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
};

const login = (req, res) => {
  // take in the user's details
  const { email, password } = req.body;

  User.findOne({ email }, (err, foundUser) => {
    if (!foundUser) {
      return res.status(400).json({ error: "User doesn't exist." });
    }
    //if user is found, make sure passwords match
    bcrypt.compare(password, foundUser.password, (err, match) => {
      if (match) {
        const token = sign({ id: foundUser._id }, process.env.JWT_SECRET);
        res.cookie("token", token, { expiresIn: "2h" });
        const { _id, name, email, history, role, cart } = foundUser;

        return res.json({
          token: "Bearer " + token,
          user: { _id, name, email, history, role, cart },
        });
      } else {
        return res.status(400).json({ error: "Password is incorrect" });
      }
    });
  });
};

const getUser = (req, res) => {
  //getting user profile
  return res.json({
    profile: req.profile,
  });
};

const addToCart = (req, res) => {
  const userId = req.profile?._id;
  const productId = req.params?.productId;
  Product.findById(productId)
    .select("-photo")
    .exec((err, foundProduct) => {
      if (!err) {
        const cartItem = {
          id: productId,
          name: foundProduct.name,
          description: foundProduct.description,
          price: foundProduct.price,
          dbQuantity: foundProduct.quantity,
        };
        User.findById(userId).exec((err, foundUser) => {
          if (!err) {
            const alreadyInCart = foundUser.cart.some(
              (item) => item.name == cartItem.name
            );
            if (!alreadyInCart) {
              foundUser.cart.push(cartItem);
              foundUser.save();
              return res.json({
                message: `${cartItem.name} added to ${foundUser.name}'s cart`,
              });
            } else {
              return res.json({ error: "Product already in cart!" });
            }
          } else {
            return res.json({ error: err });
          }
        });
      } else {
        return res.json({ error: err });
      }
    });
};

const deleteItemFromCart = (req, res) => {
  const userId = req.profile?._id; 
  const productId = req.params?.productId;

  Product.findById(productId).exec((err, foundProduct) => {
    if (!err) {
      User.findById(userId).exec((err, foundUser) => {
        if (!err) {
          for (let i = 0; i < foundUser.cart.length; i++) {
            const cartItemName = foundUser.cart[i].name;
            if (foundProduct?.name == cartItemName) {
              const newCartItems = foundUser.cart.filter(
                (product) => product.name != foundProduct.name
              );
              foundUser.cart = newCartItems;
              foundUser.save();
              return res.status(200).json({
                message: `${foundProduct.name} removed successfully from ${foundUser.name}'s cart`,
              });
            }
          }
          return res.json({ error: "Product not in cart" });
        } else {
          return res.json({ error: err });
        }
      });
    } else {
      return res.json({ error: err });
    }
  });
};

const clearCart = (req, res) => {
  const userId = req.profile._id;

  User.findByIdAndUpdate(
    userId,
    { $set: { cart: [] } },
    { new: true },
    (err, response) => {
      if (!err) {
        return res.json({ message: "Cart cleared after succesful payment!" });
      } else {
        return res.json({ error: err });
      }
    }
  );
};

const updateUser = (req, res) => {
  //updating user profile
  const userId = req.params.userId;
  User.findById(userId).exec(function (err, foundUser) {
    if (err) {
      return res.json({ error: "Error updating user" });
    }

    if (req.body.password !== undefined) {
      req.body.password = bcrypt.hashSync(req.body.password, 10); //a new hashed password
    }
    const updatedUser = _.extend(foundUser, req.body); // update all other fields including password

    updatedUser.save(function (err) {
      if (err) {
        return res.json({ error: "Error updating user" + err });
      }
      return res.json({ user: updatedUser });
    });
  });
};
module.exports = {
  registerUser,
  login,
  getUser,
  clearCart,
  addToCart,
  deleteItemFromCart,
  updateUser
};
