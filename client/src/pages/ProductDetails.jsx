import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cars/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log("بيانات السيارة المسترجعة:", data);
        console.log("بيانات السيارات المشابهة:", data.similarCars);

        // تحويل مسارات الصور إلى مسارات مطلقة
        const carWithFullImageUrls = {
          ...data.car,
          images: data.car.images.map((img) => ({
            ...img,
            image_url: img.image_url.startsWith("http")
              ? img.image_url
              : `http://localhost:5000${img.image_url}`,
          })),
          features:
            typeof data.car.features === "string"
              ? JSON.parse(data.car.features)
              : data.car.features,
        };

        // تحويل مسارات الصور للسيارات المشابهة
        const similarCarsWithFullImageUrls = data.similarCars.map((car) => ({
          ...car,
          images: car.images.map((img) => ({
            ...img,
            image_url: img.image_url.startsWith("http")
              ? img.image_url
              : `http://localhost:5000${img.image_url}`,
          })),
        }));

        setCar(carWithFullImageUrls);
        setSimilarCars(similarCarsWithFullImageUrls);
      } else {
        setError("فشل في جلب تفاصيل السيارة");
      }
    } catch (err) {
      console.error("خطأ في جلب تفاصيل السيارة:", err);
      setError("حدث خطأ أثناء جلب تفاصيل السيارة");
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === car.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? car.images.length - 1 : prevIndex - 1
    );
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!car) return <div className="error">السيارة غير موجودة</div>;

  return (
    <div className="shop-container">
      <div className="product-details">
        <div className="car-details">
          <div className="car-images">
            <div className="main-image">
              {car.images && car.images.length > 0 ? (
                <>
                  <img
                    src={car.images[currentImageIndex].image_url}
                    alt={car.name}
                    onClick={() => openLightbox(currentImageIndex)}
                    onError={(e) => {
                      console.error(
                        "خطأ في تحميل الصورة:",
                        car.images[currentImageIndex].image_url
                      );
                      e.target.src = "https://via.placeholder.com/400";
                    }}
                  />
                  {car.images.length > 1 && (
                    <>
                      <button className="prev-btn" onClick={prevImage}>
                        السابق
                      </button>
                      <button className="next-btn" onClick={nextImage}>
                        التالي
                      </button>
                    </>
                  )}
                </>
              ) : (
                <img src="https://via.placeholder.com/400" alt="لا توجد صورة" />
              )}
            </div>
            <div className="thumbnails">
              {car.images &&
                car.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.image_url}
                    alt={`${car.name} ${index + 1}`}
                    className={index === currentImageIndex ? "active" : ""}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      openLightbox(index);
                    }}
                    onError={(e) => {
                      console.error("خطأ في تحميل الصورة:", image.image_url);
                      e.target.src = "https://via.placeholder.com/100";
                    }}
                  />
                ))}
            </div>
          </div>

          <div className="car-info">
            <h1>{car.name}</h1>
            {/* هنا نعرض الماركة والموديل */}
            <p className="brand">الماركة: {car.brand}</p>
            <p className="model">الموديل: {car.model}</p>
            <p className="price">السعر: {car.price} </p>
            <p className="description">{car.description}</p>
            <div className="features">
              <h2>المميزات</h2>
              <table className="features-table">
                <tbody>
                  {Array.isArray(car.features) && car.features.length > 0 ? (
                    car.features
                      .reduce((rows, feature, index) => {
                        if (index % 2 === 0) {
                          // بداية صف جديد
                          rows.push([feature]);
                        } else {
                          // نضيف للصف الحالي عمود ثاني
                          rows[rows.length - 1].push(feature);
                        }
                        return rows;
                      }, [])
                      .map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>{row[0]}</td>
                          <td>{row[1] || ""}</td>{" "}
                          {/* إذا مافي مميزات ثانية نخليها فاضية */}
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="2">لا توجد مميزات متاحة</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Lightbox */}
        {showLightbox && (
          <div className="lightbox" onClick={closeLightbox}>
            <div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={closeLightbox}>
                ×
              </button>
              <img
                src={car.images[currentImageIndex].image_url}
                alt={car.name}
                onError={(e) => {
                  console.error(
                    "خطأ في تحميل الصورة:",
                    car.images[currentImageIndex].image_url
                  );
                  e.target.src = "https://via.placeholder.com/800";
                }}
              />
              {car.images.length > 1 && (
                <>
                  <button className="lightbox-prev" onClick={prevImage}>
                    السابق
                  </button>
                  <button className="lightbox-next" onClick={nextImage}>
                    التالي
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {similarCars.length > 0 && (
        <div className="similar-cars">
          <h2>سيارات مشابهة</h2>
          <div className="similar-cars-grid">
            {similarCars.map((similarCar) => (
              <div key={similarCar.id} className="similar-car-card">
                <Link to={`/shop/${similarCar.id}`}>
                  {similarCar.images && similarCar.images.length > 0 ? (
                    <img
                      src={similarCar.images[0].image_url}
                      alt={similarCar.name}
                      onError={(e) => {
                        console.error(
                          "خطأ في تحميل الصورة:",
                          similarCar.images[0].image_url
                        );
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/150"
                      alt="لا توجد صورة"
                    />
                  )}
                  <h3>{similarCar.name}</h3>
                  <p>السعر: {similarCar.price} جنيه</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
