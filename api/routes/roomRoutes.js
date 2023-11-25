const express = require("express");
const router = express.Router();
const {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

router.get("/get-rooms", getRooms);
router.post("/create-room", createRoom);
router.put("/update-room", updateRoom);
router.delete("/delete-room/:roomId", deleteRoom);

module.exports = router;
