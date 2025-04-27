import React from "react";
import { Link } from "react-router-dom";
import "./head.css";
import a1 from "../image/Gana Car.png";

function Head() {
  return (
    <header className="mb-4 text-info bg-back ">
      <nav
        className=" navbar navbar-expand-lg bg-dark border-primary border-bottom border-5 fixed-top bg-opacity-75 text-info"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <Link className="navbar-brand fs-2 p-0" to="/">
            <img src={a1} alt="Gana trading" width={120} />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-lg-auto mb-2 mb-lg-0 text-center">
              <li className="nav-item mt-2 mt-lg-0">
                <Link className="nav-link active " aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="About">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link " to="/shop">
                  Shop
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Head;

//  import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   return (
//     <nav className="navbar">
//       <div className="container">
//         <Link to="/" className="logo">متجر السيارات</Link>
//         <div className="nav-links">
//           <Link to="/">الرئيسية</Link>
//           <Link to="/about">من نحن</Link>
//           <Link to="/shop">المتجر</Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
