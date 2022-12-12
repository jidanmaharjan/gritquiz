const Category = require("../models/categoryModel");

exports.addCategory = async (req, res) => {
  try {
    const category = req.body.category;
    await Category.create({ name: category });
    res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = req.body.category;
    await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: category,
      },
      { runValidators: true, new: true, useFindAndModify: false }
    );
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
