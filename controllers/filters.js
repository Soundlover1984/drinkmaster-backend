const fs = require("fs/promises");
const path = require("path");
const { controllerWrapper, HttpError } = require("../helpers");
const { Ingredient } = require("../models/ingredient");

const categoriesPath = path.join(__dirname, "../", "db", "categories.json");
const glassesPath = path.join(__dirname, "../", "db", "glasses.json");

const getCategories = async (req, res) => {
  const categories = await fs.readFile(categoriesPath);
  const parsedCategories = JSON.parse(categories);
  const sortedCategories = parsedCategories.sort((a, b) => a.localeCompare(b));

  res.json(sortedCategories);
};

const getIngredients = async (req, res) => {

  const condition = !req.user.isAdult ? "No" : /^(?:Yes\b|No\b)/;
  const result = await Ingredient.find(
    {
      alcohol: condition,
    }
  ).sort({ title: 1 });
    if (!result) throw HttpError(404, "Not Found");
    res.json(result);
  };

const getGlasses = async (req, res) => {
  const glasses = await fs.readFile(glassesPath);
  const parsedGlasses = JSON.parse(glasses);
  const sortedGlasses = parsedGlasses.sort((a, b) => a.localeCompare(b));

  res.json(sortedGlasses);
};

module.exports = {
  getCategories: controllerWrapper(getCategories),
  getIngredients: controllerWrapper(getIngredients),
  getGlasses: controllerWrapper(getGlasses),
};
