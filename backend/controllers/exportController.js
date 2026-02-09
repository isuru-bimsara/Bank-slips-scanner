const Slip = require("../models/Slip");
const XLSX = require("xlsx");

exports.exportExcel = async (req, res) => {
  try {
    const slips = await Slip.find().lean();

    if (!slips.length) return res.status(404).send("No slips found to export");

    const data = slips.map(slip => ({
      Account: slip.accountNumber,
      Amount: slip.amount,
      Date: slip.date,
      Status: slip.status
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data, { header: ["Account","Amount","Date","Status"] });

    // Column widths
    ws["!cols"] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];

    // Bold headers & borders
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cell_address]) continue;
      ws[cell_address].s = {
        font: { bold: true },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        }
      };
    }

    // Borders for all rows
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cell_address]) continue;
        ws[cell_address].s = {
          alignment: { horizontal: "center" },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Slips");
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=slips.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);

  } catch (err) {
    console.error("❌ Export Error:", err);
    res.status(500).send("Export failed");
  }
};
