const mongoose = require("mongoose");

const slipSchema = new mongoose.Schema({
  rawText: String,
  accountNumber: String,
  amount: String,
  date: String,
  status: String,
  image: String
});

const Slip = mongoose.model("Slip", slipSchema);
module.exports = Slip; // ✅ Important
