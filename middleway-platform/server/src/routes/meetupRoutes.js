const express = require("express");
const router = express.Router();
const {
  createMeetup,
  getMeetups,
  getMeetupById,
  updateMeetup,
  deleteMeetup,
  updateParticipantStatus,
} = require("../controllers/meetupController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createMeetup).get(protect, getMeetups);

router
  .route("/:id")
  .get(protect, getMeetupById)
  .put(protect, updateMeetup)
  .delete(protect, deleteMeetup);

router.route("/:id/participants/:userId").put(protect, updateParticipantStatus);

module.exports = router;
