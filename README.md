# Bank Slips Scanner

Backend service for uploading bank slip images/PDFs, extracting details with OCR, storing results in MongoDB, and exporting data to Excel.

## Backend Overview

- **Upload + OCR**: Accepts image/PDF uploads, preprocesses images, runs OCR, and extracts account number, amount, and date.
- **Persistence**: Stores extracted data and raw OCR text in MongoDB.
- **Export**: Generates an Excel file with slip data.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- OCR: `tesseract.js`
- Image processing: `sharp`
- PDF to image: `pdf-poppler`
- Excel export: `xlsx`

## Backend Setup

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in `backend/`:

   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

3. Start the server:

   ```bash
   node server.js
   ```

The API will be available at `http://localhost:5000`.

## API Endpoints

Base path: `/api/slip`

| Method | Endpoint  | Description |
| ------ | --------- | ----------- |
| POST   | `/upload` | Upload an image/PDF for OCR processing |
| GET    | `/export` | Download slip data as an Excel file |

### Upload Example

```bash
curl -F "slip=@/path/to/slip.jpg" http://localhost:5000/api/slip/upload
```

### Export Example

```bash
curl -o slips.xlsx http://localhost:5000/api/slip/export
```

## OCR Extraction Logic

The backend extracts:

- **Account Number**: first 6–16 digit number found
- **Amount**: matches `LKR 1,234.56` format
- **Date**: matches `DD/MM/YYYY` or `YYYY-MM-DD` formats

If required fields are missing, the status is set to `ERROR`; otherwise `VERIFIED`.

## File Uploads

Uploaded files and processed images are stored in `backend/uploads/` and served at:

```
GET /uploads/<filename>
```
