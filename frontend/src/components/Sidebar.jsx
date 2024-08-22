import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBook, FiDownload, FiSettings, FiBarChart2, FiShare2 } from "react-icons/fi";
import { BiBulb } from "react-icons/bi";
import { FaChartBar } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import { IoCubeOutline } from "react-icons/io5";
import { TfiExport } from "react-icons/tfi";
import allImages from "../constant/images";
import "../assets/css/sidebar.css";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    { name: "설정", path: "/", icon: <FiSettings className="me-2" /> },
    {
      name: "데이터 업로드",
      path: "/upload",
      icon: <TfiExport className="me-2" />,
    },
    { name: "Namespace", path: "#", icon: <FiBook className="me-2" /> },
    { name: "SPARQL", path: "#", icon: <BiBulb className="me-2" /> },
    { name: "통계", path: "#", icon: <FiBarChart2 className="me-2" /> },
    { name: "그래프 탐색", path: "#", icon: <FiShare2 className="me-2" /> },
    {
      name: "나의 프로세스",
      path: "#",
      icon: <IoCubeOutline className="me-2" />,
    },
  ];
  useEffect(() => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname
    );
    setActiveItem(currentItem?.name || "");
  }, [location.pathname]);
  const handleNavigation = (path, name) => {
    setActiveItem(name);
    navigate(path);
  };

  return (
    <div
      className="d-flex flex-column pt-3 bg-dark app__main-nav"
      style={{ width: "250px", height: "150vh" }}
    >
      <p className="mb-5 mt-3">
        <img src={allImages.logo} className="bg-light" alt="" /> Hike Lab.
      </p>
      <ul className="nav nav-pills flex-column mb-auto">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`nav-item mb-3 ${
              activeItem === item.name ? "active" : ""
            }`}
          >
            <a
              href="#"
              className="nav-link"
              onClick={() => handleNavigation(item.path, item.name)}
            >
              {item.icon} {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
