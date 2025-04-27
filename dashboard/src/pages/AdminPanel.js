import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const navigate = useNavigate();

  // بيانات السيارة الجديدة
  const [carData, setCarData] = useState({
    name: "",
    price: "",
    description: "",
    features: [""],
    images: [],
    brand: "",
    model: "",
    year: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCars();
  }, [navigate]);

  const fetchCars = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cars", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...carData.features];
    newFeatures[index] = value;
    setCarData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("الصور المرفوعة:", data.urls);

        // تحويل المسارات النسبية إلى مسارات مطلقة
        const fullUrls = data.urls.map((url) => {
          // إزالة أي تكرار في المسار
          const cleanUrl = url.replace(/^http:\/\/localhost:5000/, "");
          return `http://localhost:5000${cleanUrl}`;
        });

        setCarData((prev) => ({
          ...prev,
          images: [...prev.images, ...fullUrls],
        }));
      } else {
        const errorData = await response.json();
        console.error("خطأ في رفع الصور:", errorData);
        setError(errorData.message || "فشل في رفع الصور");
      }
    } catch (err) {
      console.error("خطأ في رفع الصور:", err);
      setError("حدث خطأ أثناء رفع الصور: " + err.message);
    }
  };

  const addFeatureField = () => {
    setCarData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeatureField = (index) => {
    const newFeatures = carData.features.filter((_, i) => i !== index);
    setCarData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCar
        ? `http://localhost:5000/api/cars/${editingCar.id}`
        : "http://localhost:5000/api/cars";

      const method = editingCar ? "PUT" : "POST";

      // تحضير البيانات قبل الإرسال
      const carDataToSend = {
        name: carData.name,
        price: parseFloat(carData.price),
        description: carData.description,
        features: carData.features.filter((feature) => feature.trim() !== ""),
        images: carData.images,
        brand: carData.brand || "",
        model: carData.model || "",
        year: carData.year || 2024,
      };

      console.log("بيانات السيارة المرسلة:", carDataToSend); // للتأكد من البيانات

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(carDataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("استجابة الخادم:", result); // للتأكد من الاستجابة
        fetchCars();
        setShowForm(false);
        setEditingCar(null);
        setCarData({
          name: "",
          price: "",
          description: "",
          features: [""],
          images: [],
          brand: "",
          model: "",
          year: "",
        });
      } else {
        const errorData = await response.json();
        console.error("خطأ في الاستجابة:", errorData);
        setError(errorData.message || "فشل في حفظ البيانات");
      }
    } catch (err) {
      console.error("خطأ في إرسال البيانات:", err);
      setError("حدث خطأ أثناء حفظ البيانات: " + err.message);
    }
  };

  const handleEdit = async (car) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cars/${car.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("فشل في جلب بيانات السيارة");
      }

      const data = await response.json();
      console.log("بيانات السيارة المسترجعة:", data);

      // تحويل features إلى مصفوفة إذا كانت سلسلة نصية
      const features =
        typeof data.car.features === "string"
          ? JSON.parse(data.car.features)
          : Array.isArray(data.car.features)
          ? data.car.features
          : [""];

      // تنظيف مسارات الصور
      const cleanImages = data.car.images.map((img) => {
        // إزالة أي تكرار في المسار
        const cleanUrl = img.image_url.replace(/^http:\/\/localhost:5000/g, "");
        return `http://localhost:5000${cleanUrl}`;
      });

      setEditingCar(car);
      setCarData({
        name: data.car.name,
        price: data.car.price,
        description: data.car.description || "",
        features: features,
        images: cleanImages,
        brand: data.car.brand || "",
        model: data.car.model || "",
        year: data.car.year || "",
      });
      setShowForm(true);
    } catch (error) {
      console.error("خطأ في تحرير السيارة:", error);
      setError("حدث خطأ أثناء تحرير السيارة");
    }
  };

  const handleDelete = async (carId) => {
    if (window.confirm("هل أنت متأكد من حذف هذه السيارة؟")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cars/${carId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          fetchCars();
        } else {
          setError("فشل في حذف السيارة");
        }
      } catch (err) {
        setError("حدث خطأ أثناء حذف السيارة");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="header">
          <h1>لوحة التحكم</h1>
          <button onClick={handleLogout}>تسجيل الخروج</button>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setEditingCar(null);
            setCarData({
              name: "",
              price: "",
              description: "",
              features: [""],
              images: [],
              brand: "",
              model: "",
              year: "",
            });
          }}
        >
          إضافة سيارة جديدة
        </button>

        {showForm && (
          <form className="car-form" onSubmit={handleSubmit}>
            <h2>{editingCar ? "تعديل سيارة" : "إضافة سيارة جديدة"}</h2>

            <div className="form-group">
              <label>اسم السيارة</label>
              <input
                type="text"
                name="name"
                value={carData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>السعر</label>
              <input
                type="number"
                name="price"
                value={carData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>الوصف</label>
              <textarea
                name="description"
                value={carData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* --- الحقول المطلوبة --- */}
            <div className="form-group">
              <label>الماركة</label>
              <input
                type="text"
                name="brand"
                value={carData.brand}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>الموديل</label>
              <input
                type="text"
                name="model"
                value={carData.model}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* --- نهاية الحقول المطلوبة --- */}
            <div className="form-group">
              <label>المميزات</label>
              {Array.isArray(carData.features) &&
                carData.features.map((feature, index) => (
                  <div key={index} className="feature-input">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      placeholder="أدخل ميزة جديدة"
                    />
                    {index === carData.features.length - 1 && (
                      <button type="button" onClick={addFeatureField}>
                        +
                      </button>
                    )}
                    {carData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeatureField(index)}
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
            </div>

            <div className="form-group">
              <label>الصور</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div className="uploaded-images">
                {carData.images && carData.images.length > 0 ? (
                  carData.images.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img
                        src={image}
                        alt={`صورة ${index + 1}`}
                        onError={(e) => {
                          console.error("خطأ في تحميل الصورة:", image);
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCarData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }));
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  ))
                ) : (
                  <p>لا توجد صور</p>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit">حفظ</button>
              <button type="button" onClick={() => setShowForm(false)}>
                إلغاء
              </button>
            </div>
          </form>
        )}

        <div className="cars-list">
          <h2>قائمة السيارات</h2>
          <table>
            <thead>
              <tr>
                <th>الصورة</th>
                <th>الاسم</th>
                <th>السعر</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td>
                    <div className="car-images-preview">
                      {car.images && car.images.length > 0 ? (
                        car.images.map((image, index) => (
                          <img
                            key={index}
                            src={image.image_url}
                            alt={`${car.name} ${index + 1}`}
                            onError={(e) => {
                              console.error(
                                "خطأ في تحميل الصورة:",
                                image.image_url
                              );
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        ))
                      ) : (
                        <img
                          src="https://via.placeholder.com/150"
                          alt="لا توجد صور"
                        />
                      )}
                    </div>
                  </td>
                  <td>{car.name}</td>
                  <td>{car.price} جنيه</td>
                  <td>
                    <button onClick={() => handleEdit(car)}>تعديل</button>
                    <button onClick={() => handleDelete(car.id)}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
