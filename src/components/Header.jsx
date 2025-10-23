import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      const section = document.getElementById("mainSection");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      navigate("/");
    }
  };

  return (
    <header className="w-full bg-[#1A202C] text-white flex justify-between items-center px-6 py-3 shadow-md">
      {/* Logo Section */}
      <div
        onClick={handleLogoClick}
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      >
        <img
          src="https://i.ibb.co/kg3RQQ1S/LogoHR.png"
          alt="Haryana Roadways"
          style={{ height: "40px", marginRight: "8px" }}
        />
        <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Haryana Roadways
        </span>
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul className="flex gap-6 text-lg">
          <li>
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/plan-journey"
              className="hover:text-blue-400 transition-colors"
            >
              Plan Journey
            </Link>
          </li>
          <li>
            <Link
              to="/live-tracking"
              className="hover:text-blue-400 transition-colors"
            >
              Live Tracking
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
