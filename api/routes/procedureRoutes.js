const express = require("express");
const router = express.Router();
const {
  getProcedures,
  getProceduresForSelf,
  createProcedures,
  updateProcedure,
  deleteProcedure,
} = require("../controllers/procedureController");

router.get("/get-procedures", getProcedures);
router.get("/get-procedures-for-self", getProceduresForSelf);
router.post("/create-procedure", createProcedures);
router.put("/update-procedure", updateProcedure);
router.delete("/delete-procedure/:procedureId", deleteProcedure);

module.exports = router;
