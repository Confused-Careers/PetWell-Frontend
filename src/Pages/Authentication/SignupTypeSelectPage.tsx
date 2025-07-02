import React from "react";
import { useNavigate } from "react-router-dom";
import PetWellLogo from "../../Assets/PetWell.png";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { FaBriefcase } from "react-icons/fa";
import { FaPaw } from "react-icons/fa";

const SignupTypeSelectPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] w-full px-2 pt-24 sm:p-4 md:p-8">
      <div className="mb-3 sm:mb-3 flex justify-center sm:justify-start flex-col">
      <div className="flex justify-center sm:justify-start h-8 mb-8 md:mb-0">
        <img
          src={PetWellLogo}
          alt="PetWell Logo"
          className="object-contain h-full w-auto"
        />
      </div>
        <div className="flex font-semibold flex-row items-center gap-2 mt-4 ml-4 sm:ml-0">
          <IoIosArrowDropleftCircle height={24} width={24} onClick={() => navigate("/")} className="cursor-pointer h-[24px] w-[24px]" />Go Back
        </div>
      </div>
      
      <div className="flex-1 bg-[var(--color-background)] rounded-2xl px-2 sm:px-5 md:px-7 py-4 sm:py-7 flex flex-col items-center w-full max-w-[1054px] justify-center mx-auto mb-40">
     
         <p className=" font-[Alike,serif] text-3xl text-[#1C232E] sm:mb-2 mb-2 text-center leading-tight">
          Let's get you started
        </p>
        <p className="mb-3 text-lg font-[Cabin] items-center flex justify-center text-center px-2">
          Tell us who you are so we can tailor your experience.
        </p>
        <div className="w-full flex flex-col md:flex-row gap-4 sm:gap-5 items-center justify-center mt-4">
          <button
            onClick={() => navigate("/signup/pet-parent")}
            className="flex flex-1 cursor-pointer items-center gap-3 bg-[#6A8293] border border-black rounded-2xl p-4 sm:p-5 hover:opacity-90 transition-all duration-200 max-w-sm"
          >
            <FaPaw className="h-14 w-auto 0 text-[#1C232E] mr-3 flex-shrink-0" />
            <div className="flex flex-col justify-around items-start">
              <span className="text-xl font-semibold font-[Cabin,sans-serif] text-[#FFF8E5] ">I’m a Pet Parent</span>
              <span className="text-sm text-[#FFF8E5] font-[Cabin,sans-serif] text-left">Manage your pet’s health, records, and care team - all in one place.</span>
            </div>
          </button>
          <button
            onClick={() => navigate("/business/signup")}
            className="flex flex-1 cursor-pointer items-center gap-3 bg-[#6A8293] border border-black rounded-2xl p-4 sm:p-5 hover:opacity-90 transition-all duration-200 max-w-sm"
          >
            <FaBriefcase className="h-14 w-auto 0 text-[#1C232E] mr-3 flex-shrink-0" />
            <div className="flex flex-col justify-around items-start">
              <span className="text-xl font-semibold font-[Cabin,sans-serif] text-[#FFF8E5] ">I’m a Business</span>
              <span className="text-sm text-[#FFF8E5] font-[Cabin,sans-serif] text-left">Connect with pet parents, upload records, and manage your care team.</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupTypeSelectPage;
