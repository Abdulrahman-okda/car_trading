// Api.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Api = ({ brand, model }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCars();
  }, [brand, model]); // يعاد الجلب عند تغيّر brand أو model

  const fetchCars = async () => {
    setLoading(true);
    setError("");
    try {
      // بناء Query params للعلامة التجارية والموديل
      const params = new URLSearchParams();
      if (brand) params.append("brand", brand);
      if (model) params.append("model", model);
      const url = `http://localhost:5000/api/cars${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const data = await response.json();
      console.log("بيانات السيارات المسترجعة:", data);
      setCars(data);
    } catch {
      setError("فشل في جلب بيانات السيارات");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (error) return <div className="error">{error}</div>;
  if (cars.length === 0)
    return <div className="text-center">لا توجد نتائج</div>;

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
              <p>السعر: {car.price} جنيه</p>
              <button className="view-btn">عرض التفاصيل</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Api;
