import React from "react";
import LoginPage from "../../Assets/LoginPage.png";
import PetWellLogo from "../../Assets/Nose.svg";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup-type");
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${LoginPage})` }}
    >

      {/* Login Card */}
      <div className="relative z-10  w-full max-w-sm sm:max-w-md md:max-w-lg  mx-4 px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border p-6 sm:p-8 md:p-12 lg:p-16 shadow-2xl flex flex-col items-center min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[520px] justify-center gap-6 sm:gap-8 md:gap-10 bg-[var(--color-background)]">
          {/* Logo */}
          <div className="flex justify-center mb-4 sm:mb-6 h-12">
            <img
              src={PetWellLogo}
              alt="PetWell Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain rounded-full p-2 drop-shadow-lg"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-2">
            <p className="font-normal mb-2  leading-[1] font-[Alike,serif] text-[var(--color-text)] text-7xl">
              PetWell
            </p>
            <div className="flex items-center justify-center gap-2 text-xl font-[Cabin,sans-serif] text-[var(--color-text)] px-2">
              <span>We love you for loving your pets</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 w-full justify-center font-[Cabin,sans-serif]">
            <button
              type="button"
              onClick={handleLogin}
              className="flex-1 font-semibold py-2  cursor-pointer  font-[Cabin,sans-serif] text-[var(--color-black)] rounded-full transition-all  shadow-lg bg-[var(--color-card-button)] hover:opacity-90"
            >Log In
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="flex-1 font-semibold py-2  cursor-pointer  font-[Cabin,sans-serif] text-[var(--color-black)] rounded-full transition-all  shadow-lg bg-[var(--color-card-button)] hover:opacity-90"
            >Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
