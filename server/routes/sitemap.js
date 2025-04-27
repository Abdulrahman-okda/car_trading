// routes/sitemap.js

const express = require("express");
const { SitemapStream } = require("sitemap");
const Car = require("../models/Car"); // استخدام الموديل نفسه
const router = express.Router();

router.get("/sitemap.xml", async (req, res, next) => {
  try {
    // جلب كل السيارات
    const cars = await Car.getAll();

    // تهيئة الـ sitemap stream مع دومينك
    const smStream = new SitemapStream({
      hostname: "https://your-domain.com", // غيّرها إلى دومين موقعك
    });

    res.header("Content-Type", "application/xml");

    // رابط الصفحة الرئيسية وصفحة المتجر
    smStream.write({ url: "/", changefreq: "daily", priority: 1.0 });
    smStream.write({ url: "/shop", changefreq: "weekly", priority: 0.8 });

    // روابط تفاصيل كل سيارة
    cars.forEach((car) => {
      smStream.write({
        url: `/shop/${car.id}`,
        changefreq: "monthly",
        priority: 0.7,
      });
    });

    smStream.end();
    smStream.pipe(res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
