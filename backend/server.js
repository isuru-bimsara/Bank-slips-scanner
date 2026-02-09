const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const slipRoutes = require("./routes/slipRoutes");
const exportRoutes = require("./routes/exportRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded files

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error", err));

// Routes
app.use("/api/slip", slipRoutes);
app.use("/api/slip", exportRoutes); // export route uses same base path

app.listen(process.env.PORT, () => console.log(`🚀 Server running on ${process.env.PORT}`));
