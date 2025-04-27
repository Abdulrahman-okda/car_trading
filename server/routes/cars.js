const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");

// مسارات عامة
router.get("/", carController.getAllCars);
router.get("/:id", carController.getCarById);

// مسارات تحتاج إلى مصادقة
router.post("/", carController.createCar);
router.put("/:id", carController.updateCar);
router.delete("/:id", carController.deleteCar);

module.exports = router;
