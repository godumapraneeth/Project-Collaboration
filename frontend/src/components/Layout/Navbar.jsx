import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/html.jpg";


const ProfileMenu = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <img
          src={
            user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name
            )}&background=random`
          }
          alt={`${user.name} avatar`}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-400 hover:ring-indigo-500 transition"
        />
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50
          transform origin-top-right transition-all duration-200 ease-out
          ${
            isOpen
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          }`}
        role="menu"
      >
        <div className="px-4 py-2 text-sm text-gray-600 border-b">
          Signed in as <br />
          <strong className="font-medium text-gray-800">{user.name}</strong>
        </div>
        <Link
          to="/dashboard"
          onClick={() => setIsOpen(false)}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
          role="menuitem"
        >
          Dashboard
        </Link>
        <Link
          to="/profile"
          onClick={() => setIsOpen(false)}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          Edit Profile
        </Link>
        <button
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-md"
          role="menuitem"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

/**
 * Main Navbar component
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinkClasses =
    "block px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const inactiveClasses =
    "text-gray-300 hover:bg-slate-700 hover:text-white";
  const activeClasses = "bg-slate-900 text-white";

  return (
    <nav className="bg-slate-800 shadow-md sticky top-0 z-50 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand with Logo */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center space-x-2"
          >
            <img
              src={logo}
              alt="ProjectCollab Logo"
              className="w-8 h-8 rounded-md shadow-sm"
            />
            <span className="text-xl font-bold text-white hover:text-gray-300 transition">
              ProjectCollab
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`${navLinkClasses} ${
                    location.pathname.startsWith("/dashboard")
                      ? activeClasses
                      : inactiveClasses
                  }`}
                >
                  Dashboard
                </Link>
                <ProfileMenu user={user} logout={logout} />
              </>
            ) : (
              <Link
                to="/login"
                className={`${navLinkClasses} ${inactiveClasses}`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`${navLinkClasses} ${
                  location.pathname.startsWith("/dashboard")
                    ? activeClasses
                    : inactiveClasses
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className={`${navLinkClasses} ${inactiveClasses}`}
              >
                Edit Profile
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`${navLinkClasses} ${inactiveClasses}`}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
