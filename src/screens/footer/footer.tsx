import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <Link to="/" className="flex items-center mb-6">
              <img className="w-[42px] h-7" alt="Logo" src="/logo.svg" />
              <img
                className="w-[41px] h-[13px] ml-1.5"
                alt="Saloon"
                src="/saloon.svg"
              />
            </Link>
            <p className="text-gray-400 mb-6">
              Premium hair salon providing expert cuts, styling, and coloring services 
              in a comfortable and professional environment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#fbb034]">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#fbb034]">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#fbb034]">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#fbb034]">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[#fbb034]">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-[#fbb034]">Services</Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-[#fbb034]">Shop</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[#fbb034]">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-gray-400 hover:text-[#fbb034]">Haircuts</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-[#fbb034]">Hair Coloring</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-[#fbb034]">Hair Styling</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-[#fbb034]">Hair Treatments</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-[#fbb034]">Beard Grooming</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-[#fbb034] mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Salon Street, Beauty District, City, 10001
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-[#fbb034] mr-3 flex-shrink-0" />
                <span className="text-gray-400">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-[#fbb034] mr-3 flex-shrink-0" />
                <span className="text-gray-400">info@choppers.com</span>
              </li>
              <li className="text-gray-400 mt-4">
                <strong className="block text-white">Opening Hours:</strong>
                Mon-Fri: 9:00 AM - 8:00 PM<br />
                Sat-Sun: 10:00 AM - 6:00 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Choppers Salon. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-[#fbb034] text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-[#fbb034] text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};