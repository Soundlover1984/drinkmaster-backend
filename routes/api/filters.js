const express = require("express");
const ctrl = require("../../controllers/filters");


const { authenticate } = require("../../middlewares");

const router = express.Router();

router.get("/categories", authenticate, ctrl.getCategories);
router.get("/ingredients", authenticate, ctrl.getIngredients);
router.get("/glasses", authenticate, ctrl.getGlasses);


// router.get("/categories", ctrl.getCategories);
// router.get("/ingredients", ctrl.getIngredients);
// router.get("/glasses", ctrl.getGlasses);


module.exports = router;