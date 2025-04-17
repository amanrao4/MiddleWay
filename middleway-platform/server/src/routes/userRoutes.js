const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} = require("../controllers/userController");
const { getUsersByIds } = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/all", protect, getAllUsers);
router.post("/lookup", protect, getUsersByIds);


// Protected routes
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
