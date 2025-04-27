const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const carRoutes = require("./routes/cars");

dotenv.config();

const app = express();

// تكوين multer لرفع الملفات
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("الملف يجب أن يكون صورة"));
    }
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// رفع الصور
app.post("/api/upload", upload.array("images"), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "لم يتم رفع أي صور" });
    }

    console.log("الملفات المرفوعة:", req.files);

    const urls = req.files.map((file) => {
      // إرجاع المسار النسبي فقط
      return `/uploads/${file.filename}`;
    });

    console.log("مسارات الصور النهائية:", urls);

    res.json({ urls });
  } catch (error) {
    console.error("خطأ في معالجة الصور:", error);
    res.status(500).json({ message: "حدث خطأ في معالجة الصور" });
  }
});

// Routes
app.use("/api/cars", carRoutes);

// ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇
// هذا الجزء الجديد لتقديم ملفات React:

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
