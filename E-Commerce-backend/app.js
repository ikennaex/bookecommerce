require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { body } = require("express-validator");
const {
  requireSignIn,
  isAuthenticatedUser,
  isAdmin,
} = require("./middlewares/middlewares");
const {
  registerUser,
  login,
  getUser,
  addToCart,
  clearCart,
  deleteItemFromCart,
  updateUser,
} = require("./controllers/user");
const {
  getProducts,
  getSingleProduct,
  getRelatedProducts,
  getDistinctCategories,
  getProductPhoto,
  productSearch,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./controllers/product");

const {
  getCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("./controllers/category");

const {
  getOrders,
  getEnumValues,
  createOrder,
  updateOrder,
  getUserOrderHistory
} = require("./controllers/order");
const adminOnly = [requireSignIn, isAdmin];
const isUser = [requireSignIn, isAuthenticatedUser];
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cors());

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/logout", (req, res) => {
  // log the user out easily

  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

app.post(
  "/register",
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password must be provided")
    .isLength({ min: 6 })
    .withMessage("Password must contain 6 characters or more"),
  registerUser
);
app.post("/login", login);

app.get("/user/:userId", isUser, getUser);

// User Routes
app.post("/user/cart/:productId", requireSignIn, addToCart);

app.get("/user/clear-cart/:userId", isUser, clearCart);

app.delete("/user/cart/:productId", requireSignIn, deleteItemFromCart);

app.put("/user/:userId", isUser, updateUser);

// Product route
app.get("/products", getProducts);

app.get("/product/:productId", getSingleProduct);

app.get("/products/related/:productId", getRelatedProducts);

app.get("/products/categories", getDistinctCategories);

app.get("/product/photo/:productId", getProductPhoto);

app.post("/products/search", productSearch);

app.post("/product/create", adminOnly, createProduct);

app.patch("/product/:productId", adminOnly, updateProduct);

app.delete("/product/:productId", adminOnly, deleteProduct);

//Category routes
app.get("/categories", getCategories);

app.get("/category/:categoryId", getSingleCategory);

app.post("/category/create", adminOnly, createCategory);

app.patch("/category/:categoryId", adminOnly, updateCategory);

app.delete("/category/:categoryId", adminOnly, deleteCategory);

// Order route
app.get("/order/list", adminOnly, getOrders);

app.get("/order/status-values", adminOnly, getEnumValues);

app.post("/order/create/:userId", isUser, createOrder);

app.put("/order/:orderId", adminOnly, updateOrder);

app.get("/order/history/:userId", isUser, getUserOrderHistory);
////////////////////////////////////////////////////////////////

app.listen(process.env.PORT || 4000, () => {
  console.log("listening on port 4000");
});
