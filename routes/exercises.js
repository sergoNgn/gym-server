const {
  getAllExercises,
  saveExercise,
  deleteExercise,
} = require("../controllers/exercises_controller");
const { Router } = require("express");
const router = Router();

router.post("/", saveExercise);
router.get("/", getAllExercises);
router.delete("/:id", deleteExercise);

module.exports = router;
