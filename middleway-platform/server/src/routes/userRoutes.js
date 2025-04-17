const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUsersByIds,
  promoteUser,
  getAllUsersForAdmin 
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/all", protect, getAllUsers);
router.post("/lookup", protect, getUsersByIds);
router.get("/admin/all-users", protect, adminOnly, getAllUsersForAdmin);
router.put("/promote/:id", protect, adminOnly, promoteUser);


// Protected routes
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
