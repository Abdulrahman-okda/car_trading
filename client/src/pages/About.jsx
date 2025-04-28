import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import "./About.css";

const About = () => {
  return (
    <>
      <Helmet>
        <title>من نحن | شركة تصدير السيارات الكوريه</title>
        <meta
          name="description"
          content="Gana Trading  شركة متخصصة في تصدير السيارات الحديثة والمستعملة بأعلى جودة."
        />
        <meta
          name="keywords"
          content="سيارات, سيارات مستعملة, سيارات حديثة, معرض سيارات , تصدير سيارات, Gana Trading , سيارات كورية"
        />
        <meta name="author" content="Gana Trading" />
      </Helmet>
      <div className="about-page pt-2">
        {/* الهيدر بخلفية صورة */}
        <section className="about-hero">
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              تعرف علينا
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              خبرة سنوات في تقديم أفضل السيارات الحديثة والمستعملة وخدمة عملاء
              استثنائية.
            </motion.p>
          </div>
        </section>

        {/* احصائيات بشكل Grid */}
        <section className="about-stats container">
          <motion.div
            className="stat"
            whileInView={{ scale: 1.05 }}
            initial={{ scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3>+4000</h3>
            <p>سيارة مباعة</p>
          </motion.div>
          <motion.div
            className="stat"
            whileInView={{ scale: 1.05 }}
            initial={{ scale: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3>+3300</h3>
            <p>عميل سعيد</p>
          </motion.div>
          <motion.div
            className="stat"
            whileInView={{ scale: 1.05 }}
            initial={{ scale: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3>+10</h3>
            <p>سنوات خبرة</p>
          </motion.div>
        </section>

        {/* خط الزمن Timeline بشكل عصري */}
        <section className="timeline-section container">
          <h2>رحلتنا</h2>
          <div className="timeline">
            <motion.div
              className="timeline-item"
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="timeline-content">
                <span>2015</span>
                <p>بداية تأسيس شركتنا وافتتاح أول معرض سيارات رئيسي.</p>
              </div>
            </motion.div>

            <motion.div
              className="timeline-item"
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="timeline-content">
                <span>2018</span>
                <p>توسيع نشاطنا وافتتاح فروع جديدة في مختلف المدن.</p>
              </div>
            </motion.div>

            <motion.div
              className="timeline-item"
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="timeline-content">
                <span>2022</span>
                <p>تحقيق إنجاز 4000+ سيارة مباعة وزيادة ولاء العملاء.</p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
