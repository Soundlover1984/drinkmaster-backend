const { Router } = require("express");

const router = Router();

router.get("/current");
router.patch("/update");
router.post("/subscribe");

module.exports = router;
