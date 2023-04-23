const { getCategories } = require("../controllers/categories_controller");
const { Router } = require("express");
const router = Router();

router.get("/", getCategories);

module.exports = router;
