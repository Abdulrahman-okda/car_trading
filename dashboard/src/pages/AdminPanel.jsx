import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminPanel() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    description: "",
    images: [],
    features: {},
  });
  const [editingId, setEditingId] = useState(null);
  const [imageUrls, setImageUrls] = useState([
    "https://via.placeholder.com/150",
  ]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/cars", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(response.data);
      setLoading(false);
    } catch (error) {
      console.error("حدث خطأ في جلب السيارات:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: value,
      },
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
    setFormData((prev) => ({
      ...prev,
      images: newImageUrls.filter((url) => url.trim() !== ""),
    }));
  };

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, "https://via.placeholder.com/150"]);
  };

  const removeImageUrlField = (index) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
    setFormData((prev) => ({
      ...prev,
      images: newImageUrls.filter((url) => url.trim() !== ""),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/cars/${editingId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/cars", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchCars();
      resetForm();
    } catch (error) {
      console.error("حدث خطأ في حفظ السيارة:", error);
    }
  };

  const handleEdit = (car) => {
    setFormData({
      name: car.name,
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      description: car.description,
      image_url: car.image_url,
      features: JSON.parse(car.features),
    });
    setEditingId(car.id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCars();
    } catch (error) {
      console.error("حدث خطأ في حذف السيارة:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      model: "",
      year: "",
      price: "",
      description: "",
      image_url: "",
      features: {},
    });
    setEditingId(null);
  };

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  return (
    <div className="admin-panel">
      <h1>لوحة التحكم</h1>

      <form onSubmit={handleSubmit} className="car-form">
        <h2>{editingId ? "تعديل سيارة" : "إضافة سيارة جديدة"}</h2>

        <div className="form-group">
          <label>اسم السيارة:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>الماركة:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>الموديل:</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>السنة:</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>السعر:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>الوصف:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>رابط الصورة:</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>المميزات:</label>
          <div className="features-inputs">
            {Object.entries(formData.features).map(([key, value]) => (
              <div key={key} className="feature-input">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => {
                    const newFeatures = { ...formData.features };
                    delete newFeatures[key];
                    newFeatures[e.target.value] = value;
                    setFormData((prev) => ({ ...prev, features: newFeatures }));
                  }}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleFeatureChange(key, e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleFeatureChange("ميزة جديدة", "")}
            >
              إضافة ميزة
            </button>
          </div>
        </div>

        <button type="submit">{editingId ? "تحديث" : "إضافة"}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            إلغاء
          </button>
        )}
      </form>

      <div className="cars-list">
        <h2>السيارات</h2>
        <table>
          <thead>
            <tr>
              <th>الصورة</th>
              <th>الاسم</th>
              <th>الماركة</th>
              <th>الموديل</th>
              <th>السعر</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>
                  <img src={car.image_url} alt={car.name} />
                </td>
                <td>{car.name}</td>
                <td>{car.brand}</td>
                <td>{car.model}</td>
                <td>{car.price} ريال</td>
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
  );
}

export default AdminPanel;
