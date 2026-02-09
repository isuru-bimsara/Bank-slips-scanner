const express = require("express");
const multer = require("multer");
const { uploadSlip } = require("../controllers/slipController");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Upload route
router.post("/upload", upload.single("slip"), uploadSlip);

module.exports = router;
