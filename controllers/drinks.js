const { HttpError, controllerWrapper } = require("../helpers");
const {
  Drink,
  schemas,
} = require("../models/drink");
const { Ingredient } = require("../models/ingredient");


const getDrinkById = async (req, res) => {
  const { id } = req.params;
  const drinkById = await Drink.findById(id);

  if (!drinkById) {
    throw HttpError(404, "Not Found");
  }

  res.json(drinkById);
};

const getPopularDrinks = async (req, res) => {
  const isAdult = req.user && req.user.isAdult;

  let getByCondition;

  if (isAdult) {
    getByCondition = { populate: { $gte: 0 }, alcoholic: /(?:Non alcoholic)\b/ };
  } else {
    getByCondition = { populate: { $gte: 0 }, alcoholic: "Non alcoholic" };
  }

  const popularDrinks = await Drink.find(getByCondition, {
    drink: 1,
    category: 1,
    alcoholic: 1,
    populate: 1,
    description: 1,
    drinkThumb: 1
  }).sort({ populate: -1 });

  if (popularDrinks.length === 0) {
    throw HttpError(404, "No popular recipes yet");
  }

  res.json(popularDrinks);
}


// const getPopularDrinks = async (req, res) => {

//   const condition = !req.user.isAdult
//   ? "Non alcoholic"
//   : /^(?:Alcoholic\b|Non alcoholic\b)/;

//  let getByCondition = { populate: {$gte : 0}, alcoholic: condition };
//  if (isAdult) { getByCondition = { populate: {$gte : 0} } };

//  const popularDrinks = await Drink.find(getByCondition, 
//      {drink:1, category:1,alcoholic:1, populate:1, description:1, drinkThumb:1 }).sort({populate:-1})

//  if (!popularDrinks) {
//      throw HttpError(404, "No popular recipes yet");
//  }
//  res.json(popularDrinks);
// }

// const getMainPageDrinks = async (req, res) => {

// const getSearchDrinks = async (req, res) => {

// const getFavoriteDrinks = async (req, res) => {

// const getOwnDrinks = async (req, res) => {

//const addFavoriteDrink = async (req, res) => {

//const removeFavoriteDrink = async (req, res) => {

//addOwnDrink = async (req, res) => {

// removeOwnDrink = async (req, res) => {



module.exports = {
  getDrinkById: controllerWrapper(getDrinkById),
  getPopularDrinks: controllerWrapper(getPopularDrinks),
  // getMainPageDrinks: controllerWrapper(getMainPageDrinks),
  // getSearchDrinks: controllerWrapper(getSearchDrinks),
  // getFavoriteDrinks: controllerWrapper(getFavoriteDrinks),
  // getOwnDrinks: controllerWrapper(getOwnDrinks),
  // addFavoriteDrink: controllerWrapper(addFavoriteDrink),
  // removeFavoriteDrink: controllerWrapper(removeFavoriteDrink),
  // addOwnDrink: controllerWrapper(addOwnDrink),
  // removeOwnDrink: controllerWrapper(removeOwnDrink),
};