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
    mainPageDrinks: drinks});
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
      quantityTotal: resultCount,
      data: drinks,
  });
}

const getPopularDrinks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const condition = !req.user.isAdult
  ? "Non alcoholic"
  : /^(?:Alcoholic\b|Non alcoholic\b)/;

  const result = await Drink.aggregate([
    {
      $addFields: {
        popularity: {
          $cond: {
            if: { $isArray: "$users" },
            then: { $size: "$users" },
            else: 0,
          },
        },
      },
    },
    {
      $sort: { popularity: -1 }, 
    },
  ]).match({ alcoholic: condition })
    .skip(skip)
    .limit(limit);

  res.json(result);
};


const addFavoriteDrink = async (req, res) => {
const { id } = req.params;
const { _id: userId } = req.user;
const drink = await Drink.findById(id);
if (!drink) {
  throw HttpError(404, "Not Found");
}
if (!drink.users) {
  drink.users = [];
}
const isFavorite = drink.users.includes(userId);
let result;
if (isFavorite) {
  throw HttpError(409, `${drink.drink} is already in your favorites.`);
} else {
  result = await Drink.findByIdAndUpdate(
    drink._id,
    { $push: { users: userId } },
    { new: true }
  );
}
res.json({ result });};



const getFavoriteDrinks = async (req, res) => {
  const { _id: userId } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const result = await Drink.find({
    users: {
      $elemMatch: {
        $eq: userId,
      },
    },
  }).sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalFavoriteDrinks = await Drink.countDocuments({
    users: {
      $elemMatch: {
        $eq: userId,
      },
    },
  });

  res.json({ total: totalFavoriteDrinks, drinks: result });
};

const removeFavoriteDrink = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  const drink = await Drink.findById(id);

  if (!drink) {
    throw HttpError(404, "Not Found");
  }

  const isFavorite = drink.users.includes(userId);

  let result;

  if (isFavorite) {
    result = await Drink.findByIdAndUpdate(
      drink._id,
      {
        $pull: { users: userId },
      },
      { new: true }
    );
  } else {
    throw HttpError(403, `${drink.drink} is not in your favorites.`);
  }

  res.json({ result });
};

// const addOwnDrink = async (req, res) =>  {
//   const { _id: owner } = req.user;
//   const { ingredients } = req.body;
//   const parsedIngredients = JSON.parse(ingredients);

//   let drinkThumb = "";
//   if (req.file) {drinkThumb = req.file.path;}

//   const ingredientsArr = [];

//   for (const ingredient of parsedIngredients) {
//     const ingredientInfo = await Ingredient.findById(ingredient.ingredientId);

//     if (!ingredientInfo) {
//       throw HttpError(404, "Not Found");
//     }

//     const { _id: ingredientId, title } = ingredientInfo;

//     ingredientsArr.push({
//       title,
//       ...ingredient,
//       ingredientId,
//     });
//   }

//   const drinkDB = {...req.body,
//     owner,
//     drinkThumb,
//     ingredients: ingredientsArr,}

  
//   const { error } = schemas.addDrinkSchema.validate(drinkDB);
//   if (error) throw HttpError(400, error.message);

//   const result = await Drink.create(drinkDB);

//   res.status(201).json(result);
// };

const addOwnDrink = async (req, res) => {
  const { _id: owner } = req.user;
  let { ingredients } = req.body;

  if (typeof ingredients === 'string') {
    ingredients = JSON.parse(ingredients);
  }

  let drinkThumb = "";
  if (req.file) {
    drinkThumb = req.file.path;
  }

  const ingredientsArr = [];

  for (const ingredient of ingredients) {
    const ingredientInfo = await Ingredient.findById(ingredient.ingredientId);

    if (!ingredientInfo) {
      throw new HttpResponseError(404, "Not Found");
    }

    const { _id: ingredientId, title } = ingredientInfo;

    ingredientsArr.push({
      title,
      ...ingredient,
      ingredientId,
    });
  }

  const drinkDB = {
    ...req.body,
    owner,
    drinkThumb,
    ingredients: ingredientsArr,
  };

  const { error } = schemas.addDrinkSchema.validate(drinkDB);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  const result = await Drink.create(drinkDB);

  res.status(201).json(result);
};




// const getOwnDrinks = async (req, res) => {

// removeOwnDrink = async (req, res) => {




module.exports = {
  getDrinkById: controllerWrapper(getDrinkById),
  getMainPageDrinks: controllerWrapper(getMainPageDrinks),
  getSearchDrinks: controllerWrapper(getSearchDrinks),
  addFavoriteDrink: controllerWrapper(addFavoriteDrink),
  getPopularDrinks: controllerWrapper(getPopularDrinks),
  getFavoriteDrinks: controllerWrapper(getFavoriteDrinks),
  removeFavoriteDrink: controllerWrapper(removeFavoriteDrink),
  // getOwnDrinks: controllerWrapper(getOwnDrinks),
  addOwnDrink: controllerWrapper(addOwnDrink),
  // removeOwnDrink: controllerWrapper(removeOwnDrink),
};