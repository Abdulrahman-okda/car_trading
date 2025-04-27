const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

class Car {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM cars");
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM cars WHERE id = ?", [id]);
    return rows[0];
  }

  static async getCarImages(carId) {
    const [rows] = await pool.query(
      "SELECT * FROM car_images WHERE car_id = ?",
      [carId]
    );
    return rows;
  }

  // static async getSimilarCars(id) {
  //   const [rows] = await pool.query(
  //     `
  //       SELECT c.* FROM cars c
  //       JOIN similar_cars sc ON c.id = sc.similar_car_id
  //       WHERE sc.car_id = ?
  //     `,
  //     [id]
  //   );
  //   return rows;
  // }
  static async getSimilarCars(id) {
    const [rows] = await pool.query(
      `
        SELECT c.*, ci.image_url FROM cars c
        LEFT JOIN car_images ci ON c.id = ci.car_id
        JOIN similar_cars sc ON c.id = sc.similar_car_id
        WHERE sc.car_id = ?
      `,
      [id]
    );

    // تنظيم البيانات بحيث يتم تجميع الصور مع كل سيارة
    const carsWithImages = rows.reduce((acc, car) => {
      const carIndex = acc.findIndex((c) => c.id === car.id);

      if (carIndex === -1) {
        acc.push({
          ...car,
          images: car.image_url
            ? [{ image_url: `http://localhost:5000${car.image_url}` }]
            : [],
        });
      } else {
        acc[carIndex].images.push({
          image_url: `http://localhost:5000${car.image_url}`,
        });
      }

      return acc;
    }, []);

    return carsWithImages;
  }

  static async create(carData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      console.log("بيانات السيارة قبل الحفظ:", carData);

      if (!carData.name || !carData.price) {
        throw new Error("الاسم والسعر مطلوبان");
      }

      const [result] = await connection.query(
        "INSERT INTO cars (name, brand, model, year, price, description, features) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          carData.name,
          carData.brand || "",
          carData.model || "",
          parseInt(carData.year) || 2024,
          parseFloat(carData.price),
          carData.description || "",
          JSON.stringify(carData.features || []),
        ]
      );

      const carId = result.insertId;
      console.log("معرف السيارة الجديدة:", carId);

      if (carData.images && carData.images.length > 0) {
        console.log("الصور المراد حفظها:", carData.images);

        const imageValues = carData.images.map((image_url) => {
          const cleanUrl = image_url.replace(/^http:\/\/localhost:5000/g, "");
          return [carId, cleanUrl];
        });

        console.log("قيم الصور للادخال:", imageValues);

        await connection.query(
          "INSERT INTO car_images (car_id, image_url) VALUES ?",
          [imageValues]
        );
      }

      // ✅ إضافة السيارات المشابهة تلقائياً بعد إنشاء السيارة
      const [similarCars] = await connection.query(
        `SELECT id FROM cars WHERE id != ? AND brand = ? AND model = ?`,
        [carId, carData.brand, carData.model]
      );

      if (similarCars.length > 0) {
        const similarRelations = [];

        similarCars.forEach((similarCar) => {
          similarRelations.push([carId, similarCar.id]); // الجديدة -> قديمة
          similarRelations.push([similarCar.id, carId]); // قديمة -> جديدة
        });

        await connection.query(
          "INSERT INTO similar_cars (car_id, similar_car_id) VALUES ?",
          [similarRelations]
        );
      }

      await connection.commit();
      return carId;
    } catch (error) {
      await connection.rollback();
      console.error("خطأ في حفظ السيارة:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update(id, carData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        "UPDATE cars SET name = ?, brand = ?, model = ?, year = ?, price = ?, description = ?, features = ? WHERE id = ?",
        [
          carData.name,
          carData.brand,
          carData.model,
          carData.year,
          carData.price,
          carData.description,
          JSON.stringify(carData.features),
          id,
        ]
      );

      if (carData.images && carData.images.length > 0) {
        await connection.query("DELETE FROM car_images WHERE car_id = ?", [id]);

        const imageValues = carData.images.map((image_url) => {
          const cleanUrl = image_url.replace(/^http:\/\/localhost:5000/g, "");
          return [id, cleanUrl];
        });

        await connection.query(
          "INSERT INTO car_images (car_id, image_url) VALUES ?",
          [imageValues]
        );
      }

      // ✅ تحديث السيارات المشابهة بعد التعديل
      await connection.query(
        "DELETE FROM similar_cars WHERE car_id = ? OR similar_car_id = ?",
        [id, id]
      );

      const [similarCars] = await connection.query(
        `SELECT id FROM cars WHERE id != ? AND brand = ? AND model = ?`,
        [id, carData.brand, carData.model]
      );

      if (similarCars.length > 0) {
        const similarRelations = [];

        similarCars.forEach((similarCar) => {
          similarRelations.push([id, similarCar.id]);
          similarRelations.push([similarCar.id, id]);
        });

        await connection.query(
          "INSERT INTO similar_cars (car_id, similar_car_id) VALUES ?",
          [similarRelations]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query("DELETE FROM car_images WHERE car_id = ?", [id]);
      await connection.query(
        "DELETE FROM similar_cars WHERE car_id = ? OR similar_car_id = ?",
        [id, id]
      );
      await connection.query("DELETE FROM cars WHERE id = ?", [id]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Car;
