// Hero_1.jsx
import React, { useState } from "react";
import "./hero.css";
import Api from "./Home/Api";

function Hero_1() {
  // استخدمت نفس المتغيرات لكن لنقلها إلى Api
  let [gender, setGender] = useState("");
  let [mode, setModel] = useState("");

  let sendModel = (e) => {
    setModel(e.target.value);
  };
  let sendgender = (e) => {
    setGender(e.target.value);
  };

  return (
    <div className="pt-2">
      <section className="hero mb-5">
        <div className="hero-overlay" />
        <div className="hero-content container">
          <h1 className="display-3 fw-medium ">ابحث عن سيارتك المثالية</h1>
          <p className="lead">
            <span className="fw-bolder gradient-text">Gana Trading </span> أفضل
            العروض معنا
          </p>
          <form
            className="row g-2 justify-content-center"
            onSubmit={(e) => {
              e.preventDefault();
              // لا حاجة للـ alert بعد التعديل
            }}
          >
            <div className="col-md-4">
              <input
                type="text"
                onChange={sendgender}
                value={gender}
                className="form-control"
                placeholder="البحث عن الماركة"
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                onChange={sendModel}
                value={mode}
                className="form-control"
                placeholder="البحث عن الموديل"
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                بحث
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* نمرر العلامة التجارية والموديل إلى Api */}
      <Api brand={gender} model={mode} />
    </div>
  );
}

export default Hero_1;
