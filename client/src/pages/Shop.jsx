import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./shop.css";

const Shop = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cars");
      if (response.ok) {
        const data = await response.json();
        console.log("بيانات السيارات المسترجعة:", data); // للتأكد من البيانات
        setCars(data);
      } else {
        setError("فشل في جلب بيانات السيارات");
      }
    } catch (err) {
      setError("حدث خطأ أثناء جلب بيانات السيارات");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="shop-container">
      <h1>المتجر</h1>
      <div className="cars-grid">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <Link to={`/shop/${car.id}`}>
              {car.images && car.images.length > 0 ? (
                <img
                  src={car.images[0].image_url}
                  alt={car.name}
                  onError={(e) => {
                    console.error(
                      "خطأ في تحميل الصورة:",
                      car.images[0].image_url
                    );
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              ) : (
                <img src="https://via.placeholder.com/150" alt="لا توجد صورة" />
              )}
              <h3>{car.name}</h3>
              <p>السعر: {car.price} </p>
              <button className="view-btn">عرض التفاصيل</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
