import React from "react";
import { useNavigate } from "react-router-dom";
import PetWellLogo from "../../Assets/PetWell.png";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { FaBriefcase } from "react-icons/fa";
import { FaPaw } from "react-icons/fa";

const SignupTypeSelectPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] w-full px-2 sm:px-4 md:px-6  justify-center">
      <div className="mb-3 sm:mb-3 flex justify-center sm:justify-start flex-col">
        <div className="flex items-center">
          <img
            src={PetWellLogo}
            alt="PetWell Logo"
            className="w-[140px] h-[36px] sm:w-[180px] sm:h-[48px] object-contain mb-2 ml-0 sm:ml-[32px] mt-[20px] sm:mt-[30px]"
          />
        </div>
        <div className="flex flex-row items-center gap-2 mt-2 ml-0 sm:ml-[32px]">
          <IoIosArrowDropleftCircle height={24} width={24} onClick={() => navigate("/")} className="cursor-pointer h-[24px] w-[24px]" />Go Back
        </div>
      </div>
      
      <div className="flex-1 bg-[var(--color-background)] rounded-2xl px-2 sm:px-5 md:px-7 py-4 sm:py-7 flex flex-col items-center w-full max-w-[1054px] justify-center mx-auto mb-40">
        <h2 className="text-[28px] sm:text-[48px] md:text-2xl font-[Alike,serif] text-[#1C232E] sm:mb-2 mb-2 text-center font-[400] leading-tight">
          Let's get you started
        </h2>
        <h3 className="mb-8 text-[18px] sm:text-[32px] md:text-base font-[Cabin] items-center flex justify-center text-center px-2">
          Tell us who you are so we can tailor your experience.
        </h3>
        <div className="w-full flex flex-col md:flex-row gap-4 sm:gap-5 max-w-[1054px] items-center justify-center">
          <button
            onClick={() => navigate("/signup/pet-parent")}
            className="flex w-full md:w-[48%] items-center gap-3 bg-[#6A8293] border border-black rounded-lg p-4 sm:p-5 hover:opacity-90 transition-colors min-h-[120px] sm:h-[159px] max-w-full md:max-w-[497px] mb-4 md:mb-0"
          >
            <FaPaw className="h-14 w-14 sm:h-20 sm:w-20 text-[#1C232E] mr-3 flex-shrink-0" />
            <div className="flex flex-col justify-around items-start">
              <span className="text-[22px] sm:text-[32px] font-[700] font-[Cabin,sans-serif] text-[#FFF8E5] ">I’m a Pet Parent</span>
              <span className="text-[15px] sm:text-[20px] text-[#FFF8E5] font-[Cabin,sans-serif] font-[400] flex justify-start text-left">Manage your pet’s health, records, and care team - all in one place.</span>
            </div>
          </button>
          <button
            onClick={() => navigate("/business/signup")}
            className="flex w-full md:w-[48%] items-center gap-3 bg-[#6A8293] border border-black rounded-lg p-4 sm:p-5 hover:opacity-90 transition-colors min-h-[120px] sm:h-[159px] max-w-full md:max-w-[497px]"
          >
            <FaBriefcase className="h-14 w-14 sm:h-20 sm:w-20 text-[#1C232E] mr-3 flex-shrink-0" />
            <div className="flex flex-col justify-around items-start">
              <span className="text-[22px] sm:text-[32px] font-[700] font-[Cabin,sans-serif] text-[#FFF8E5] ">I’m a Business</span>
              <span className="text-[15px] sm:text-[20px] text-[#FFF8E5] font-[Cabin,sans-serif] font-[400] flex justify-start text-left">
                Connect with pet parents, upload records, and manage your care team.
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupTypeSelectPage;
