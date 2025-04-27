const Car = require("../models/Car");

const carController = {
  getAllCars: async (req, res) => {
    try {
      // 1. جلب جميع السيارات
      const cars = await Car.getAll();
      console.log("السيارات المسترجعة:", cars);

      // 2. إضافة الصور لكل سيارة
      const carsWithImages = await Promise.all(
        cars.map(async (car) => {
          const images = await Car.getCarImages(car.id);
          console.log(`صور السيارة ${car.id}:`, images);

          // تحويل مسارات الصور إلى مسارات مطلقة
          const fullImageUrls = images.map((img) => {
            const cleanUrl = img.image_url.replace(
              /^http:\/\/localhost:5000/g,
              ""
            );
            return {
              ...img,
              image_url: `http://localhost:5000${cleanUrl}`,
            };
          });

          return { ...car, images: fullImageUrls };
        })
      );

      console.log("السيارات مع الصور:", carsWithImages);

      // 3. قراءة فلاتر البحث من query params
      const { brand, model } = req.query;
      let filtered = carsWithImages;

      // 4. تطبيق فلترة العلامة التجارية
      if (brand) {
        filtered = filtered.filter(
          (c) => c.brand && c.brand.toLowerCase().includes(brand.toLowerCase())
        );
      }

      // 5. تطبيق فلترة الموديل
      if (model) {
        filtered = filtered.filter(
          (c) => c.model && c.model.toLowerCase().includes(model.toLowerCase())
        );
      }

      // 6. إرجاع النتيجة المفلترة (أو كاملة إذا لم تُرسل فلاتر)
      res.json(filtered);
    } catch (error) {
      console.error("خطأ في جلب السيارات:", error);
      res.status(500).json({ message: "حدث خطأ في جلب السيارات" });
    }
  },

  getCarById: async (req, res) => {
    try {
      const car = await Car.getById(req.params.id);
      if (!car) {
        return res.status(404).json({ message: "السيارة غير موجودة" });
      }

      const images = await Car.getCarImages(req.params.id);
      console.log(`صور السيارة ${req.params.id}:`, images);

      // تحويل مسارات الصور إلى مسارات مطلقة
      const fullImageUrls = images.map((img) => {
        // إزالة أي تكرار في المسار
        const cleanUrl = img.image_url.replace(/^http:\/\/localhost:5000/g, "");
        return {
          ...img,
          image_url: `http://localhost:5000${cleanUrl}`,
        };
      });

      const similarCars = await Car.getSimilarCars(req.params.id);
      console.log("السيارات المشابهة:", similarCars);

      res.json({
        car: { ...car, images: fullImageUrls },
        similarCars: similarCars.map((car) => ({
          ...car,
          images: car.images
            ? car.images.map((img) => {
                const cleanUrl = img.image_url.replace(
                  /^http:\/\/localhost:5000/g,
                  ""
                );
                return {
                  ...img,
                  image_url: `http://localhost:5000${cleanUrl}`,
                };
              })
            : [],
        })),
      });
    } catch (error) {
      console.error("خطأ في جلب تفاصيل السيارة:", error);
      res.status(500).json({ message: "حدث خطأ في جلب تفاصيل السيارة" });
    }
  },

  createCar: async (req, res) => {
    try {
      console.log("بيانات السيارة المرسلة:", req.body); // للتأكد من البيانات المرسلة
      const carId = await Car.create(req.body);
      res.status(201).json({ id: carId, message: "تم إضافة السيارة بنجاح" });
    } catch (error) {
      console.error("خطأ في إضافة السيارة:", error);
      res
        .status(500)
        .json({ message: "حدث خطأ في إضافة السيارة: " + error.message });
    }
  },

  updateCar: async (req, res) => {
    try {
      await Car.update(req.params.id, req.body);
      res.json({ message: "تم تحديث السيارة بنجاح" });
    } catch (error) {
      console.error("خطأ في تحديث السيارة:", error);
      res.status(500).json({ message: "حدث خطأ في تحديث السيارة" });
    }
  },

  deleteCar: async (req, res) => {
    try {
      await Car.delete(req.params.id);
      res.json({ message: "تم حذف السيارة بنجاح" });
    } catch (error) {
      console.error("خطأ في حذف السيارة:", error);
      res.status(500).json({ message: "حدث خطأ في حذف السيارة" });
    }
  },
};

module.exports = carController;
