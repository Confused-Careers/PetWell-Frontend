import React from "react";
import LoginPage from "../../Assets/LoginPage.png";
import PetWellLogo from '../../Assets/PetWell.png';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup-type');
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${LoginPage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-4 px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-2xl flex flex-col items-center min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[520px] justify-center gap-6 sm:gap-8 md:gap-10 bg-[#1C232E]/[0.90] backdrop-blur-lg"
        >
          {/* Logo */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <img 
              src={PetWellLogo} 
              alt="PetWell Logo" 
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain rounded-full p-2" 
            />
          </div>

          {/* Title */}
          <div className="text-center mb-2">
            <h1 className="font-bold mb-2 text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[140px] leading-[1] font-[Alike,serif] text-[#EBD5BD]">PetWell</h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-[25px] font-[Cabin,sans-serif] text-[#EBD5BD] px-2">
              We love you for loving your pets
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 w-full justify-center font-[Cabin,sans-serif]">
            <button
              type="button"
              onClick={handleLogin}
              className="w-full h-12 sm:h-14 md:h-16 lg:h-[66px] py-3 sm:py-4 font-[Cabin,sans-serif] text-black rounded-lg transition-colors font-medium text-base sm:text-lg md:text-xl lg:text-[20px] shadow-lg bg-[#FFB23E] hover:bg-[#ffb733] focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:ring-offset-2"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="w-full h-12 sm:h-14 md:h-16 lg:h-[66px] py-3 sm:py-4 font-[Cabin,sans-serif] text-black rounded-lg transition-colors font-medium text-base sm:text-lg md:text-xl lg:text-[20px] shadow-lg bg-[#FFB23E] hover:bg-[#ffb733] focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:ring-offset-2"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
