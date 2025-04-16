const mongoose = require("mongoose");

const meetupSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "declined"],
          default: "pending",
        },
      },
    ],
    location: {
      name: String,
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["planned", "in-progress", "completed", "cancelled"],
      default: "planned",
    },
  },
  {
    timestamps: true,
  }
);

const Meetup = mongoose.model("Meetup", meetupSchema);

module.exports = Meetup;
