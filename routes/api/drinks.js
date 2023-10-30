const express = require("express");
const ctrl = require("../../controllers/drinks");

const {
  authenticate, isValidId, validateQuery,
} = require("../../middlewares");

const { schemas } = require("../../models/drink");

const router = express.Router();



router.get("/mainpage", authenticate, ctrl.getMainPageDrinks);
router.get("/popular", authenticate, ctrl.getPopularDrinks);
router.get("/search", authenticate, ctrl.getSearchDrinks);
// router.post("/own/add", authenticate, ctrl.addOwnDrink);
// router.delete("/own/remove/:id", authenticate, ctrl.removeOwnDrink);
// router.get("/own/all", authenticate, ctrl.getOwnDrinks);
// router.delete("/favorite/remove/:id", authenticate, ctrl.removeFavoriteDrink);
// router.get("/favorite/all", authenticate, ctrl.getFavoriteDrinks);
router.get("/:id", authenticate, isValidId, ctrl.getDrinkById);
router.post("/favorite/add/:id", authenticate, ctrl.addFavoriteDrink);



module.exports = router;