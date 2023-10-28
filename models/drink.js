const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");


const drinkSchema = new Schema(
  {
    drink: {
      type: String,
      unique: true,
      required: [true, "Set name for drink"],
    },
    drinkAlternate: {
      type: String,
      default: "Sorry, not specified",
    },
    category: {
      type: String,
      enum: [
        "Beer",
        "Cocktail",
        "Cocoa",
        "Coffee/Tea",
        "Homemade Liqueur",
        "Ordinary Drink",
        "Other/Unknown",
        "Punch/Party Drink",
        "Shake",
        "Shot",
        "Soft Drink",
      ],
      required: [true, "Set category for drink"],
    },
    IBA: {
      type: String,
      default: "Sorry, not specified",
    },
    alcoholic: {
      type: String,
      enum: ["Alcoholic", "Non alcoholic"],
      required: [true, "Specify alcoholic or non-alcoholic drink"],
    },
    glass: {
      type: String,
      enum: [
        "Balloon Glass",
        "Beer Glass",
        "Beer mug",
        "Beer pilsner",
        "Brandy snifter",
        "Champagne flute",
        "Cocktail glass",
        "Coffee mug",
        "Collins glass",
        "Copper Mug",
        "Cordial glass",
        "Coupe Glass",
        "Highball glass",
        "Hurricane glass",
        "Irish coffee cup",
        "Jar",
        "Margarita glass",
        "Margarita/Coupette glass",
        "Martini Glass",
        "Mason jar",
        "Nick and Nora Glass",
        "Old-fashioned glass",
        "Parfait glass",
        "Pint glass",
        "Pitcher",
        "Pousse cafe glass",
        "Punch bowl",
        "Shot glass",
        "Whiskey Glass",
        "Whiskey sour glass",
        "White wine glass",
        "Wine Glass",
      ],
      required: [true, "Set type glass for drink"],
    },
    description: {
      type: String,
      required: [true, "Set description for drink"],
    },
    instructions: {
      type: String,
      required: [true, "Set short instructions for drink"],
    },
    drinkThumb: {
      type: String,
    },
    ingredients: [
      {
        _id: false,
        title: {
          type: String,
        },
        measure: {
          type: String,
        },
        ingredientId: {
          type: Schema.Types.ObjectId,
          ref: "ingredients",
        },
      },
    ],
    shortDescription: {
        type: String,
        required: [true, "Set short description for drink"],
      },
    favorite: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    populate: {
      type: Number,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

drinkSchema.post("save", handleMongooseError);

const Drink = model("recipes", drinkSchema);


const addDrinkSchema = Joi.object({
  drink: Joi.string().empty().required().messages({
    "string.empty": `value with no content is not permissible`,
    "any.required": `missing required field recipe drink`,
  }),
  category: Joi.string()
    .valid(
    "Ordinary Drink",
    "Cocktail",
    "Shake",
    "Other/Unknown",
    "Cocoa",
    "Shot",
    "Coffee / Tea",
    "Homemade Liqueur",
    "Punch / Party Drink",
    "Beer",
    "Soft Drink")
    .empty()
    .required()
    .messages({
      "string.empty": `value with no content is not permissible`,
      "any.required": `missing required field drink category`,
      "string.only": `only the specific category values are permissible`,
    }),
  IBA: Joi.string(),
  tags: Joi.string(),
  alcoholic: Joi.string()
    .valid("Alcoholic", "Non alcoholic")
    .required()
    .messages({
      "string.only": `only the specific category values are permissible`,
      "any.required": `missing required field 'alcoholic' of drinks`,
    }),
  glass: Joi.string()
    .valid(
    "Highball glass",
    "Cocktail glass",
    "Old-fashioned glass",
    "Whiskey Glass",
    "Collins glass",
    "Pousse cafe glass",
    "Champagne flute",
    "Whiskey sour glass",
    "Cordial glass",
    "Brandy snifter",
    "White wine glass",
    "Nick and Nora Glass",
    "Hurricane glass",
    "Coffee mug",
    "Shot glass",
    "Jar",
    "Irish coffee cup",
    "Punch bowl",
    "Pitcher",
    "Pint glass",
    "Copper Mug",
    "Wine Glass",
    "Beer mug",
    "Margarita / Coupette glass",
    "Beer pilsner",
    "Beer Glass",
    "Parfait glass",
    "Mason jar",
    "Margarita glass",
    "Martini Glass",
    "Balloon Glass",
    "Coupe Glass")
    .required()
    .messages({
      "string.only": `only the specific category values are permissible`,
      "any.required": `missing required field 'glass' of drinks`,
    }),
  description: Joi.string().empty().required().messages({
    "string.empty": `value with no content is not permissible`,
    "any.required": `missing required field drink ObjectId`,
  }),
  shortDescription: Joi.string().empty().required().messages({
    "string.empty": `value with no content is not permissible`,
    "any.required": `missing required field drink ObjectId`,
  }),
  instructions: Joi.string().empty().required().messages({
    "string.empty": `value with no content is not permissible`,
    "any.required": `missing required field drink ObjectId`,
  }),
  drinkThumb: Joi.string(),
  ingredients: Joi.array().items(
    Joi.object({
      title: Joi.string().empty().required().messages({
        "string.empty": `value with no content is not permissible`,
        "any.required": `missing required field ingredient tytle`,
      }),
      measure: Joi.string().empty().required().messages({
        "string.empty": `value with no content is not permissible`,
        "any.required": `missing required field ingredient measure`,
      }),
      ingredientId: Joi.string().empty().required().messages({
        "string.empty": `value with no content is not permissible`,
        "any.required": `missing required field ingredient ingredientId`,
      }),
    })
  ),
  owner: Joi.object().empty().required().messages({
    "string.empty": `value with no content is not permissible`,
    "any.required": `missing required field drink ObjectId`,
  }),
});

const addDeleteIdSchema = Joi.object({
  id: Joi.string().required().messages({
    "any.required": `missing required field drink ObjectId`,
  }),
});

const countDrinkSchema = Joi.object({
  count: Joi.string().valid("1", "2", "3").required().messages({
    "any.only": `Only 1, 2 or 3 values were allowed for field 'count'`,
    "any.required": `missing required field 'count' of drinks`,
  }),
});

const searchDrinkSchema = Joi.object({
  q: Joi.string().allow(""),
  category: Joi.string()
    .allow("")
    .valid( 
    "Ordinary Drink",
    "Cocktail",
    "Shake",
    "Other/Unknown",
    "Cocoa",
    "Shot",
    "Coffee / Tea",
    "Homemade Liqueur",
    "Punch / Party Drink",
    "Beer",
    "Soft Drink")
    .messages({
      "any.only": `only the specific category values are permissible`,
    }),
  ingredient: Joi.string().allow(""),
  page: Joi.number().integer().min(1).required().messages({
    "number.base": `field page must be a number`,
    "number.min": `field page must be greater than or equal to 1`,
    "any.required": `missing required field page`,
  }),
  limit: Joi.number().integer().min(9).required().messages({
    "number.base": `field limit must be a number`,
    "number.min": `field limit must be greater than or equal to 9`,
    "any.required": `missing required field limit`,
  }),
})
  .unknown()
  .messages({
    "object.unknown": "Unknown parameters",
  });

const schemas = {
  addDrinkSchema,
  addDeleteIdSchema,
  countDrinkSchema,
  searchDrinkSchema,
};

module.exports = { Drink , schemas };