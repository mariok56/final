import React from "react";
import { Button } from "../../components/ui/button";

export const Box = (): JSX.Element => {
  // Navigation items data
  const navItems = [
    { name: "Home", active: true },
    { name: "About Us", active: false },
    { name: "Services", active: false },
    { name: "Contact", active: false },
  ];

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-[url(/rectangle-1.svg)] bg-cover bg-center">
      {/* Navigation Bar */}
      <header className="flex items-center justify-between px-28 py-6">
        {/* Logo */}
        <div className="flex items-center">
          <img className="w-[42px] h-7" alt="Logo" src="/logo.svg" />
          <img
            className="w-[41px] h-[13px] ml-1.5"
            alt="Saloon"
            src="/saloon.svg"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-10">
          {navItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className={`font-['Poppins',Helvetica] font-bold text-[15px] leading-[16px] ${
                item.active ? "text-[#fbb034]" : "text-white"
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Book Now Button */}
        <Button className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-['Poppins',Helvetica] font-bold text-[15px] px-[53px] py-[18px] rounded-none">
          Book Now
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Left Content */}
        <div className="w-1/2 pl-28 pt-64">
          <p className="font-['Jost',Helvetica] font-normal text-[#fbb034] text-base leading-[17px]">
            Welcome To Choppers
          </p>

          <h1 className="font-['Poppins',Helvetica] font-bold text-white text-5xl leading-[45.4px] mt-5">
            Best Hair Salon For A <br />
            Professional Look
          </h1>

          <p className="font-['Poppins',Helvetica] font-normal text-[#9a9a9a] text-[21px] leading-[22.4px] mt-12 max-w-[389px]">
            Choppers offers high performance customized facials to provide you
            with visible results.
          </p>

          <div className="flex mt-24 space-x-10">
            <Button className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-['Poppins',Helvetica] font-bold text-[15px] px-[53px] py-[18px] rounded-none">
              Book Now
            </Button>

            <Button
              variant="outline"
              className="border-white text-white hover:text-white hover:bg-white/10 font-['Poppins',Helvetica] font-bold text-[15px] px-[46px] py-[18px] rounded-none"
            >
              All Services
            </Button>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-1/2 h-[625px] bg-[url(/image-2.png)] bg-cover bg-center relative">
          <img
            className="absolute w-[47px] h-[42px] bottom-14 left-[150px]"
            alt="Choppers logo white"
            src="/choppers-logo-white-png--1--2.png"
          />
        </div>
      </div>
    </main>
  );
};
