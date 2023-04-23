const {
  getClients,
  getClientById,
  saveClient,
  updateClient,
  deleteClient,
} = require("../controllers/clients_controller");
const { Router } = require("express");
const router = Router();

router.get("/", getClients);
router.get("/:id", getClientById);
router.post("/", saveClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
