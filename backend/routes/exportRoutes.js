const express = require("express");
const { exportExcel } = require("../controllers/exportController");

const router = express.Router();

// Export Excel route
router.get("/export", exportExcel);

module.exports = router;
