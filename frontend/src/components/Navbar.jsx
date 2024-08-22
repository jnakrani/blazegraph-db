import { FaUser } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg px-3 mb-4">
      <span className="navbar-brand fw-bolder">설정</span>

      <div className="ms-auto d-flex align-items-center">
        <div className="dropdown">
          <a
            className="nav-link dropdown-toggle text-dark"
            href="#"
            id="languageDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            한국어
          </a>
          <ul className="dropdown-menu" aria-labelledby="languageDropdown">
            <li>
              <a className="dropdown-item" href="#">
                한국어
              </a>
            </li>
          </ul>
        </div>

        <span className="navbar-divider mx-3 text-muted">|</span>

        <a href="#" className="nav-link text-dark d-flex align-items-center">
          <FaUser className="me-2" /> username
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
