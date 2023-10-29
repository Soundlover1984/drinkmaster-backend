const { HttpError, controllerWrapper } = require("../helpers");
const {
  Drink,
  schemas,
} = require("../models/drink");
const { Ingredient } = require("../models/ingredient");
const path = require("path");
const fs = require("fs/promises");
const categoriesPath = path.join(__dirname, "../", "db", "categories.json");



const getDrinkById = async (req, res) => {
  const { id } = req.params;
  const drinkById = await Drink.findById(id);

  if (!drinkById) {
    throw HttpError(404, "Not Found");
  }

  res.json(drinkById);
};


const getMainPageDrinks = async (req, res) => {
  const {isAdult} = req.user;
  const drinks = {};
  const categories = await fs.readFile(categoriesPath);
  const parsedCategories = JSON.parse(categories);
  for (const category of parsedCategories) {
    drinks[category] = await Drink.find(
      !isAdult
        ? {
            category,
            alcoholic: "Non alcoholic",
          }
        : { category }
    )
      .sort({ createdAt: -1 })
      .limit(3);
  }

  res.json(drinks);
};


// const getSearchDrinks = async (req, res) => {

// const getFavoriteDrinks = async (req, res) => {

// const getOwnDrinks = async (req, res) => {

//const addFavoriteDrink = async (req, res) => {

//const removeFavoriteDrink = async (req, res) => {

//addOwnDrink = async (req, res) => {

// removeOwnDrink = async (req, res) => {

// const getPopularDrinks = async (req, res) => {
  
// }



module.exports = {
  getDrinkById: controllerWrapper(getDrinkById),
  // getPopularDrinks: controllerWrapper(getPopularDrinks),
  getMainPageDrinks: controllerWrapper(getMainPageDrinks),
  // getSearchDrinks: controllerWrapper(getSearchDrinks),
  // getFavoriteDrinks: controllerWrapper(getFavoriteDrinks),
  // getOwnDrinks: controllerWrapper(getOwnDrinks),
  // addFavoriteDrink: controllerWrapper(addFavoriteDrink),
  // removeFavoriteDrink: controllerWrapper(removeFavoriteDrink),
  // addOwnDrink: controllerWrapper(addOwnDrink),
  // removeOwnDrink: controllerWrapper(removeOwnDrink),
};