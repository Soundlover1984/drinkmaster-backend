const { HttpError, controllerWrapper } = require("../helpers");
const {
  Drink,
  schemas,
} = require("../models/drink");
const User  = require("../models/user");
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
  const totalCount = await Drink.count();
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
  res.json({
    code: 200,
    message: 'Success operation',
    totalDrinks: totalCount,
    quantity: drinks.length,
    data: drinks});
};


const getSearchDrinks = async (req, res) => {
  const { isAdult } = req.user;
  const { page = 1, limit = 10 } = req.query;
  let skip = (page - 1) * limit;
 
  const keys = Object.keys(req.query);
  let paramSearch = {};
  for (const key of keys) {
      if (key === 'drink' || key === 'category' || key === 'ingredients.title') {
          paramSearch = { ...paramSearch, [key]: { $regex: new RegExp(req.query[key], "i") } }
      };
  }

  let getByCondition = { ...paramSearch, alcoholic: "Non alcoholic" };
  if (isAdult) { getByCondition = { ...paramSearch } };

  const resultCount = await Drink.find(getByCondition).count();
  if (skip >= resultCount) { if (resultCount < limit) { skip = 0 } else { skip = resultCount - limit } }

  const drinks = await Drink.find(getByCondition,
      { drink: 1, drinkThumb: 1, category: 1, alcoholic: 1, populate: 1 }, { skip, limit }).sort({ populate: -1 })

  if (!drinks || !drinks.length) {
      throw HttpError(404, "Not found, try again");
  }
  res.status(200).json({
      code: 200,
      message: 'Success operation',
      quantityPerPage: drinks.length,
      quantityTotal: resultCount,
      data: drinks,
  });
}

const getPopularDrinks = async (req, res) => {
  const { isAdult } = req.user;
 
    let getByCondition = { populate: {$gte : 0}, alcoholic: "Non alcoholic" };
    if (isAdult) { getByCondition = { populate: {$gte : 0} } };

    const drinks = await Drink.find(getByCondition, 
        {drink:1, category:1,alcoholic:1, populate:1, description:1, drinkThumb:1 }).sort({populate:-1})

    if (!drinks) {
        throw HttpError(404, "No popular drinks yet");
    }
    res.status(200).json({
        code: 200,
        message: 'Success operation',
        data: drinks,
    });
}

const addFavoriteDrink = async (req, res) => {
   const {id} = req.body;
    const userId = req.user.id;
    const drink = await Drink.findById(id);
    const user = await User.findById({_id: userId});
    const firstFavoriteAnswer = user.firstFavorite;
    const idx = drink.favorites.findIndex(elem => elem === userId );
    if ( idx < 0) { drink.favorites.push(userId);
        if (drink.populate) { drink.populate += 1 } else {drink.populate = 1}
        await drink.save() 
        if (user.firstFavorite) { user.firstFavorite = false; await user.save(); }
    } else {
            throw HttpError(404, 'Drink has already been added!');
        }
    res.status(201).json({
        code: 201,
        message: 'Success operation',
        firstFavorite: firstFavoriteAnswer,
        data: drink,
    });
}

// const getFavoriteDrinks = async (req, res) => {

// const getOwnDrinks = async (req, res) => {

//const removeFavoriteDrink = async (req, res) => {

//addOwnDrink = async (req, res) => {

// removeOwnDrink = async (req, res) => {




module.exports = {
  getDrinkById: controllerWrapper(getDrinkById),
  getMainPageDrinks: controllerWrapper(getMainPageDrinks),
  getSearchDrinks: controllerWrapper(getSearchDrinks),
  getPopularDrinks: controllerWrapper(getPopularDrinks),
  addFavoriteDrink: controllerWrapper(addFavoriteDrink),
  // getFavoriteDrinks: controllerWrapper(getFavoriteDrinks),
  // getOwnDrinks: controllerWrapper(getOwnDrinks),
  // removeFavoriteDrink: controllerWrapper(removeFavoriteDrink),
  // addOwnDrink: controllerWrapper(addOwnDrink),
  // removeOwnDrink: controllerWrapper(removeOwnDrink),
};