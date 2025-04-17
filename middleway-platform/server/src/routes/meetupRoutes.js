const express = require("express");
const router = express.Router();

const {
  createMeetup,
  getMeetups,
  getMeetupById,
  updateMeetup,
  deleteMeetup,
  updateParticipantStatus,
  getMeetupsForModerators, 
} = require("../controllers/meetupController");

const { protect, moderatorOnly } = require("../middleware/authMiddleware");

router.get("/moderator", protect, moderatorOnly, getMeetupsForModerators);

router.route("/").post(protect, createMeetup).get(protect, getMeetups);

router
  .route("/:id")
  .get(protect, getMeetupById)
  .put(protect, updateMeetup)
  .delete(protect, deleteMeetup);

router.route("/:id/participants/:userId").put(protect, updateParticipantStatus);

module.exports = router;
