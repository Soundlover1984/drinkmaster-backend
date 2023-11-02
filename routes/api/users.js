const { Router } = require("express");
const { authenticate } = require("../../middlewares");
const {
  current,
  update,
  subscribe,
  theme,
} = require("../../controllers/users");
const { uploadAvatar } = require("../../services/cloudinaryService");

const router = Router();

router.get("/current", authenticate, current);
router.patch("/update", authenticate, uploadAvatar, update);
router.post("/subscribe", authenticate, subscribe);
router.patch("/theme", authenticate, theme);

module.exports = router;
