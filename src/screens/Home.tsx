
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleBookNowClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/booking");
    }
  };

  const handleAllServicesClick = () => {
    navigate("/services");
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[url(/rectangle-1.svg)] bg-cover bg-center">
      <div className="flex flex-col md:flex-row">
        {/* Left Content */}
        <div className="w-full md:w-1/2 px-4 md:pl-28 pt-20 md:pt-64">
          <p className="font-['Jost',Helvetica] font-normal text-[#fbb034] text-base leading-[17px]">
            Welcome To Choppers
          </p>

          <h1 className="font-['Poppins',Helvetica] font-bold text-white text-4xl md:text-5xl leading-[1.2] mt-5">
            Best Hair Salon For A <br />
            Professional Look
          </h1>

          <p className="font-['Poppins',Helvetica] font-normal text-[#9a9a9a] text-lg md:text-[21px] leading-[1.4] mt-8 md:mt-12 max-w-[389px]">
            Choppers offers high performance customized facials to provide you
            with visible results.
          </p>

          <div className="flex flex-col md:flex-row mt-12 md:mt-24 space-y-4 md:space-y-0 md:space-x-10">
            <Button
              onClick={handleBookNowClick}
              className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-['Poppins',Helvetica] font-bold text-[15px] px-[53px] py-[18px] rounded-none"
            >
              Book Now
            </Button>

            <Button
              onClick={handleAllServicesClick}
              className="bg-transparent border-2 border-white text-white hover:bg-white/20 font-['Poppins',Helvetica] font-bold text-[15px] px-[46px] py-[18px] rounded-none"
            >
              All Services
            </Button>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 h-[400px] md:h-[625px] mt-8 md:mt-0 bg-[url(/image-2.png)] bg-cover bg-center relative">
          <img
            className="absolute w-[47px] h-[42px] bottom-14 left-[150px]"
            alt="Choppers logo white"
            src="/choppers-logo-white-png--1--2.png"
          />
        </div>
      </div>
    </div>
  );
};