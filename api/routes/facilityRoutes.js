const express = require("express");
const {
  getFacilities,
  getFacilitiesForSelf,
  createFacility,
  updateFacility,
  deleteFacility,
} = require("../controllers/facilityController");
const router = express.Router();

router.get("/get-facilities", getFacilities);
router.get("/get-facilities-for-self", getFacilitiesForSelf);
router.post("/create-facility", createFacility);
router.put("/update-facility", updateFacility);
router.delete("/delete-facility/:facilityId", deleteFacility);

module.exports = router;
