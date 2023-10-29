const { Router } = require("express");
const { authenticate } = require("../../middlewares");
const { current, update, subscribe } = require("../../controllers/users");
const { uploadAvatar } = require("../../services/cloudinaryService");

const router = Router();

router.get("/current", authenticate, current);
router.patch("/update", authenticate, uploadAvatar, update);
router.post("/subscribe", authenticate, subscribe);

module.exports = router;
