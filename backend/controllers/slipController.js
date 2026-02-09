const Slip = require("../models/Slip");
const Tesseract = require("tesseract.js");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const pdfPoppler = require("pdf-poppler");

exports.uploadSlip = async (req, res) => {
  try {
    const filePath = req.file.path;
    let images = [];

    // Convert PDF to images if PDF
    if (path.extname(filePath).toLowerCase() === ".pdf") {
      const opts = {
        format: "jpeg",
        out_dir: path.dirname(filePath),
        out_prefix: "page",
        page: null
      };
      await pdfPoppler.convert(filePath, opts);

      images = fs.readdirSync(path.dirname(filePath))
        .filter(f => f.startsWith("page") && f.endsWith(".jpg"))
        .map(f => path.join(path.dirname(filePath), f));
    } else {
      images = [filePath];
    }

    let finalText = "";

    // Process each image
    for (let imgPath of images) {
      const processedPath = "uploads/processed-" + path.basename(imgPath);

      await sharp(imgPath)
        .grayscale()
        .normalize()
        .resize({ width: 1200 })
        .toFile(processedPath);

      const { data: { text } } = await Tesseract.recognize(processedPath, "eng", {
        logger: m => console.log(m.status)
      });

      finalText += "\n" + text;
    }

    // Extract Account, Amount, Date
    const accountMatch = finalText.match(/\b\d{6,16}\b/);
    const amountMatch = finalText.match(/LKR\s*([\d,]+\.\d{2})/i);
    const dateMatch = finalText.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})|(\d{4}[\/\-]\d{2}[\/\-]\d{2})/);

    const account = accountMatch ? accountMatch[0] : "NOT FOUND";
    const amount = amountMatch ? amountMatch[1].replace(/,/g, "") : "NOT FOUND";
    const date = dateMatch ? dateMatch[0] : "NOT FOUND";
    const status = (amount !== "NOT FOUND" && date !== "NOT FOUND") ? "VERIFIED" : "ERROR";

    const slip = await Slip.create({
      rawText: finalText,
      accountNumber: account,
      amount,
      date,
      status,
      image: images.join(",")
    });

    res.json(slip);

  } catch (err) {
    console.error("❌ OCR ERROR:", err);
    res.status(500).json({ message: "OCR failed", error: err.message });
  }
};
