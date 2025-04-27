import React from "react";
import a2 from "../image/Gana_trading.png";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer border-primary border-bottom border-5">
      <div className="footer-container ">
        <div className="footer-logo">
          <img src={a2} width={300} alt="Gana Trading Logo" />
        </div>
        <div className="footer-social">
          <h4>تابعنا</h4>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://wa.me/201234567890"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
        <div className="footer-contact">
          <h4>تواصل معنا</h4>
          <p>
            <FaPhoneAlt /> 01012345678
          </p>
          <p>
            <FaPhoneAlt /> 01234567890
          </p>
          <p>
            <FaEnvelope /> info@ganatrading.com
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>جميع الحقوق محفوظة &copy; 2025 Gana Trading</p>
      </div>
    </footer>
  );
};

export default Footer;
