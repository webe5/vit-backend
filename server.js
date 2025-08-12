import express from "express";
import multer from "multer";
import cors from "cors";
import Tesseract from "tesseract.js";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Function to convert paragraph to bullet points
function paragraphToBullets(paragraph) {
  const sentences = paragraph
    .split(/[.?!]\s+/)
    .filter(s => s.trim().length > 0);
  return sentences.map(s => `• ${s.trim()}`).join("\n");
}

// Route for text input
app.post("/api/text", (req, res) => {
  const { paragraph } = req.body;
  if (!paragraph) return res.status(400).json({ error: "No text provided" });
  const bullets = paragraphToBullets(paragraph);
  res.json({ bullets });
});

// Route for image upload
app.post("/api/image", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });

  try {
    const result = await Tesseract.recognize(req.file.path, "eng");
    const extractedText = result.data.text;
    const bullets = paragraphToBullets(extractedText);
    res.json({ bullets, extractedText });
  } catch (err) {
    res.status(500).json({ error: "Error processing image" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ VIT Backend running on port ${PORT}`));
