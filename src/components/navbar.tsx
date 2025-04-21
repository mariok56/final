import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { Footer } from "../screens/footer/footer";
import { ScrollToTop } from "./scrollup";
import { useAuthStore } from "../store/authStore";

export const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get authentication state and logout function from Zustand store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Shop", path: "/shop" },
    { name: "Contact", path: "/contact" },
  ];

  const handleBookNowClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/booking");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when changing route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // User logout handler
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <ScrollToTop />
      
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-black py-3" 
            : "bg-black py-6"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img className="w-[42px] h-7" alt="Logo" src="/logo.svg" />
            <img
              className="w-[41px] h-[13px] ml-1.5"
              alt="Saloon"
              src="/saloon.svg"
            />
          </Link>

          <button
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-['Poppins',Helvetica] font-bold text-[15px] leading-[16px] transition-colors ${
                  location.pathname === item.path ? "text-[#fbb034]" : "text-white hover:text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-transparent border-2 border-white text-white hover:bg-white/20"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="bg-transparent border-2 border-white text-white hover:bg-white/20"
                >
                  Register
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLogout}
                className="bg-transparent border-2 border-white text-white hover:bg-white/20"
              >
                Logout
              </Button>
            )}
            <Button
              onClick={handleBookNowClick}
              className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-['Poppins',Helvetica] font-bold text-[15px] px-6 py-4 rounded-none"
            >
              Book Now
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black p-6 md:hidden">
            <nav className="flex flex-col space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-['Poppins',Helvetica] font-bold text-[15px] ${
                    location.pathname === item.path
                      ? "text-[#fbb034]"
                      : "text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-800">
                {!isAuthenticated ? (
                  <>
                    <Button
                      onClick={() => navigate("/login")}
                      className="w-full mb-3 bg-transparent border-2 border-white text-white hover:bg-white/20"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => navigate("/register")}
                      className="w-full mb-3 bg-transparent border-2 border-white text-white hover:bg-white/20"
                    >
                      Register
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleLogout}
                    className="w-full mb-3 bg-transparent border-2 border-white text-white hover:bg-white/20"
                  >
                    Logout
                  </Button>
                )}
                <Button
                  onClick={handleBookNowClick}
                  className="w-full bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-['Poppins',Helvetica] font-bold text-[15px] py-4 rounded-none"
                >
                  Book Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from being hidden under fixed header */}
      <div className="h-24"></div>

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};