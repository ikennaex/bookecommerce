const { Category } = require("../models/models");

const getCategories = (req, res) => {
  // getting all categories
  Category.find().exec(function (err, foundCategories) {
    if (err || !foundCategories) {
      return res.status(400).json({ error: "No category found" });
    }

    return res.json({ categories: foundCategories });
  });
};

const getSingleCategory = (req, res) => {
  //getting a particular category
  const categoryId = req.params.categoryId;

  Category.findById(categoryId).exec(function (err, foundCategory) {
    if (err || !foundCategory) {
      return res.status(400).json({ error: "Category not found." });
    }

    res.json({ Category: foundCategory });
  });
};

const createCategory = (req, res) => {
  // creating new categories
  const category = {
    name: req.body.category,
  };
  Category.create(category, (err, result) => {
    if (!err) {
      return res.json({ messsage: "Category created successfully!" });
    } else {
      return res.json({ error: err });
    }
  });
};

const updateCategory = (req, res) => {
  //updating an existing category

  const categoryId = req.params.categoryId;

  Category.updateOne(
    { _id: categoryId },
    { name: req.body.name },
    function (err, result) {
      if (err) {
        return res.json({ error: "Error updating category." });
      }

      res.json({ message: "Successfully updated category." });
    }
  );
};

const deleteCategory = (req, res) => {
  // deleting a category

  const categoryId = req.params.categoryId;

  Category.deleteOne({ _id: categoryId }, function (err, result) {
    if (err) {
      return res.json({ error: "Error deleting category." });
    }

    res.json({ message: "Deleted category successfully." });
  });
};
module.exports = {
  getCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
