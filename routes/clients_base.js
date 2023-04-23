const {
  getByClientId,
  saveNewBase,
  updateBase,
} = require("../controllers/clients_base_controller");
const { Router } = require("express");
const router = Router();

router.get("/:clientId", getByClientId);
router.post("/:clientId", saveNewBase);
router.patch("/:clientId", updateBase);

module.exports = router;
