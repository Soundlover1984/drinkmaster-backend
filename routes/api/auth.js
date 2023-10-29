const { Router } = require("express");
const { signup, singin, singout } = require("../../controllers/auth");
const { userMiddleware, authenticate } = require("../../middlewares");

const router = Router();

router.post("/signup", userMiddleware.checkRegisterUserData, signup);
router.post("/signin", userMiddleware.checkLoginUserData, singin);
router.post("/signout", authenticate, singout);

module.exports = router;
