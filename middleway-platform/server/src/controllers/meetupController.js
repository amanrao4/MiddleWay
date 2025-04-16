const Meetup = require("../models/meetupModel");
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel'); 


// @desc    Create a new meetup
// @route   POST /api/meetups
// @access  Private
const createMeetup = asyncHandler(async (req, res) => {
  const { title, description, location, scheduledDate, participants } = req.body;

  // Find user IDs for all participant emails
  const resolvedParticipants = await Promise.all(
    participants.map(async (email) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      return { user: user._id };
    })
  );

  const meetup = new Meetup({
    title,
    description,
    location,
    scheduledDate,
    participants: resolvedParticipants,
    creator: req.user._id,
  });

  const created = await meetup.save();
  res.status(201).json(created);
});


// @desc    Get all meetups
// @route   GET /api/meetups
// @access  Private
const getMeetups = async (req, res) => {
  try {
    const meetups = await Meetup.find({
      $or: [{ creator: req.user._id }, { "participants.user": req.user._id }],
    })
      .populate("creator", "name email")
      .populate("participants.user", "name email");

    res.json(meetups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get meetup by ID
// @route   GET /api/meetups/:id
// @access  Private
const getMeetupById = async (req, res) => {
  try {
    const meetup = await Meetup.findById(req.params.id)
      .populate("creator", "name email")
      .populate("participants.user", "name email");

    if (meetup) {
      res.json(meetup);
    } else {
      res.status(404).json({ message: "Meetup not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update meetup
// @route   PUT /api/meetups/:id
// @access  Private
const updateMeetup = async (req, res) => {
  try {
    const meetup = await Meetup.findById(req.params.id);

    if (!meetup) {
      return res.status(404).json({ message: "Meetup not found" });
    }

    // Check if user is the creator of the meetup
    if (meetup.creator.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to edit this meetup" });
    }

    // Update fields
    const { title, description, location, scheduledDate, status } = req.body;

    if (title) meetup.title = title;
    if (description) meetup.description = description;
    if (location) meetup.location = location;
    if (scheduledDate) meetup.scheduledDate = scheduledDate;
    if (status) meetup.status = status;

    const updatedMeetup = await meetup.save();
    res.json(updatedMeetup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete meetup
// @route   DELETE /api/meetups/:id
// @access  Private
const deleteMeetup = async (req, res) => {
  try {
    const meetup = await Meetup.findById(req.params.id);

    if (!meetup) {
      return res.status(404).json({ message: "Meetup not found" });
    }

    // Check if user is the creator of the meetup
    if (meetup.creator.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this meetup" });
    }

    await meetup.deleteOne();
    res.json({ message: "Meetup removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update participant status
// @route   PUT /api/meetups/:id/participants/:userId
// @access  Private
const updateParticipantStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const meetup = await Meetup.findById(req.params.id);

    if (!meetup) {
      return res.status(404).json({ message: "Meetup not found" });
    }

    // Find the participant
    const participantIndex = meetup.participants.findIndex(
      (p) => p.user.toString() === req.params.userId
    );

    if (participantIndex === -1) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // Update the status
    meetup.participants[participantIndex].status = status;
    await meetup.save();

    res.json(meetup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createMeetup,
  getMeetups,
  getMeetupById,
  updateMeetup,
  deleteMeetup,
  updateParticipantStatus,
};
