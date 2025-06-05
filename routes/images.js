const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const UserImage = require("../models/UserImage");
const { protect, authorize } = require("../middleware/auth");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Upload image
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const image = await UserImage.create({
      user: req.user._id,
      imageUrl,
      title,
      description,
    });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user's own images
router.get("/my-images", protect, async (req, res) => {
  try {
    const images = await UserImage.find({ user: req.user._id });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all images (admin and super_admin only)
router.get(
  "/all",
  protect,
  authorize("admin", "super_admin"),
  async (req, res) => {
    try {
      const images = await UserImage.find().populate("user", "name email");
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Delete image (super_admin only)
router.delete("/:id", protect, authorize("super_admin"), async (req, res) => {
  try {
    // Find the image first to check if it exists
    const image = await UserImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete the image using findByIdAndDelete
    await UserImage.findByIdAndDelete(req.params.id);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
