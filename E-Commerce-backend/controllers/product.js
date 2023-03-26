const { Product } = require("../models/models");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const getProducts = (req, res) => {
  let { limit, arrival } = req.query;

  // if they want to sort by sales (using the sold field)
  Product.find()
    .select("-photo")
    .populate("category") // populate (expand) the category field in the product schema
    .sort({
      createdAt: arrival,
    })
    .limit(limit ? limit : "")
    .then((products) => {
      return res.send(products);
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ error: "Error getting products: " + err.message });
    });
};

const getSingleProduct = (req, res) => {
  let productId = req.params.productId;

  Product.findById(productId)
    .populate("category", "_id name")
    .exec(function (err, foundProduct) {
      if (err || !foundProduct) {
        return res.status(400).json({ error: "Product not found." });
      }
      // foundProduct.photo = undefined;
      return res.json({ product: foundProduct });
    });
};

const getRelatedProducts = (req, res) => {
  let limit = req.query.limit;
  const productId = req.params.productId;

  Product.findById(productId).exec((err, foundProduct) => {
    if (!err && foundProduct) {
      //find the product by its id in the database
      const category = foundProduct.category;
      Product.find({ category: category, name: { $ne: foundProduct.name } }) //find all products with the same category and exempt the found product with "$ne"
        .select("-photo")
        .populate("category", "_id name")
        .limit(limit ? limit : "")
        .exec((err, foundProducts) => {
          if (!err && foundProducts) {
            return res.json({ products: foundProducts });
          } else {
            return res
              .status(400)
              .json({ error: "No products in this category!" });
          }
        });
    } else {
      return res.status(400).json({ error: "No found Product" });
    }
  });
};

const getDistinctCategories = (req, res) => {
  Product.distinct("category").exec((err, categories) => {
    //get the distinct or unique categories present in the products collection
    if (!err && categories) {
      return res.json({ categories: categories });
    }
    res.status(400).json({ error: "No categories found!" });
  });
};

const getProductPhoto = (req, res) => {
  //send the product image to client
  const productId = req.params.productId;

  Product.findById(productId).exec((err, foundProduct) => {
    if (!err && foundProduct) {
      if (foundProduct.photo.data) {
        res.set("Content-Type", foundProduct.photo.contentType);
        return res.send(foundProduct.photo.data);
      }
    } else {
      return res.status(400).json({ error: "Product not found!" });
    }
  });
};

const productSearch = (req, res) => {
  //for when the client makes a random product search
  let { q, sales, limit, min, max } = req.query;

  Product.find({
    $text: { $search: q },
    price: { $gte: min ? min : 0, $lte: max ? max : 10000 },
  })
    .select("-photo")
    .sort({ sold: sales ? sales : "desc" })
    .populate("category", "_id name")
    .limit(limit ? limit : "")
    .exec((err, products) => {
      if (!err && products.length !== 0) {
        return res.json({
          size: products.length,
          products,
        });
      } else {
        return res.status(400).json({ error: "No products found" });
      }
    });
};

const createProduct = (req, res) => {
  let form = new formidable.IncomingForm(); //use the IncomingForm() constructor
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    // parse the incoming data
    if (err) {
      return res.status(400).json({ message: err });
    }

    const { name, price, category, shipping, quantity, description } = fields;

    if (
      !name ||
      !price ||
      !category ||
      !shipping ||
      !quantity ||
      !description
    ) {
      return res.json({
        error: "Missing fields. Please fill all required fields.",
      });
    }
    const product = new Product(fields); // create the product

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res
          .status(400)
          .json({ message: "Image should be less than 1mb in size." });
      } // check if a photo is being sent
      // console.log("the fields: ", fields); // fields like name, description, quantity
      // console.log("the files: ", files); // files like images. videos etc
      product.photo.data = fs.readFileSync(files.photo.filepath); // store the photo
      product.photo.contentType = files.photo.mimetype; //store the type of the photo
    }

    product.save((err) => {
      if (err) {
        return res.json({ error: "Error uploading image: " + err.message });
      }
      return res.json({ message: "Product uploaded successfully." });
    });
  });
};

const updateProduct = (req, res) => {
  //updating a product

  let productId = req.params.productId;
  let form = new formidable.IncomingForm(); //use the IncomingForm() constructor
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    // parse the incoming data
    if (err) {
      return res.status(400).json({ message: err });
    }

    Product.findById(productId).exec(function (err, foundProduct) {
      if (err) {
        return res.json({ error: "Error updating product" });
      }

      const updatedProduct = _.extend(foundProduct, fields); // updates the properties of the found product with the fields object

      if (files.photo) {
        if (files.photo.size > 1000000) {
          return res
            .status(400)
            .json({ message: "Image should be less than 1mb in size." });
        }
        updatedProduct.photo.data = fs.readFileSync(files.photo.filepath);
        updatedProduct.photo.contentType = files.photo.mimetype;
      }
      updatedProduct.save(function (err) {
        if (err) {
          return res.json({ error: "Error updating product" + err });
        }
        res.json({ message: "Updated product successfully." });
      });
    });
  });
};

const deleteProduct = (req, res) => {
  let productId = req.params.productId;
  Product.deleteOne({ _id: productId }, function (err, result) {
    if (err) {
      return res.json({ error: "Error deleting product." });
    }
    res.json(result);
  });
};
module.exports = {
  getProducts,
  getSingleProduct,
  getRelatedProducts,
  getDistinctCategories,
  getProductPhoto,
  productSearch,
  createProduct,
  updateProduct,
  deleteProduct,
};
