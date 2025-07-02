import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PetWellLogo from "../../Assets/PetWell.png";
import petServices from "../../Services/petServices";
import { logout } from "../../utils/petNavigation";
import { generatePetCode } from "../../utils/petCodeGenerator";
import { Menu, X, ChevronDown } from "lucide-react";

interface NavbarProps {
  onEditProfile?: () => void;
  onSwitchProfile?: () => void;
  onSettings?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSwitchProfile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [petName, setPetName] = useState<string>("Pet");
  const [petImage, setPetImage] = useState<string>(
    "https://randomuser.me/api/portraits/men/32.jpg"
  );

  const handleDropdownToggle = () => setIsDropdownOpen((open) => !open);
  const handleMobileMenuToggle = () => setIsMobileMenuOpen((open) => !open);
  const handleMobileDropdownToggle = () =>
    setIsMobileDropdownOpen((open) => !open);

  const handleLogout = () => {
    logout(petId);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".mobile-menu") &&
        !target.closest(".mobile-menu-toggle")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    (async () => {
      try {
        if (!petId) {
          setPetName("Pet");
          setPetImage("https://randomuser.me/api/portraits/men/32.jpg");
          return;
        }

        // Fetch the specific pet by ID instead of all pets
        const petRes = await petServices.getPetById(petId);
        let petData: any = petRes;

        // Handle different response structures
        if (petRes && petRes.data) petData = petRes.data;
        if (Array.isArray(petData)) petData = petData[0];

        if (petData && petData.pet_name) {
          setPetName(petData.pet_name);
          // If profile_picture is a string (URL), use it. If not, fallback.
          const profilePic = petData.profile_picture;
          if (profilePic && typeof profilePic === "string") {
            setPetImage(profilePic);
          } else {
            setPetImage("https://randomuser.me/api/portraits/men/32.jpg");
          }
        } else {
          setPetName("Pet");
          setPetImage("https://randomuser.me/api/portraits/men/32.jpg");
        }
      } catch {
        setPetName("Pet");
        setPetImage("https://randomuser.me/api/portraits/men/32.jpg");
      }
    })();
  }, [petId]);

  const navigationItems = [
    { name: "Home", path: `/petowner/pet/${petId}/home` },
    { name: "Vaccines", path: `/petowner/pet/${petId}/vaccine` },
    { name: "Documents", path: `/petowner/pet/${petId}/documents` },
    { name: "Team", path: `/petowner/pet/${petId}/team` },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[var(--color-card)] shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden mobile-menu ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header (just close button) */}
          <div className="flex items-center justify-end p-4 border-b border-[var(--color-border)]">
            <button
              onClick={handleMobileMenuToggle}
              className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-3">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-[var(--color-primary)] text-[var(--color-background)]"
                      : "text-[var(--color-text)] hover:bg-[var(--color-accent-hover)]"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Top Navbar (only visible on mobile) */}
      <div className="lg:hidden bg-[#fffaed]">
        <nav className="flex items-center justify-between px-3 py-3 bg-transparent w-full">
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={handleMobileMenuToggle}
              className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors mobile-menu-toggle"
            >
              <Menu size={20} />
            </button>
            <img
              src={PetWellLogo}
              alt="PetWell Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          {/* Profile Dropdown on the right */}
          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              onClick={handleMobileDropdownToggle}
              className="flex items-center space-x-1 focus:outline-none p-1"
            >
              <img
                src={petImage}
                alt="Pet"
                className="w-8 h-8 rounded-full object-cover border-2 border-[var(--color-primary)]"
              />
              <ChevronDown
                size={16}
                className={`text-[var(--color-text)] transition-transform ${
                  isMobileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isMobileDropdownOpen && (
              <div
                className="fixed left-0 right-0 top-16 mx-auto w-full max-w-xs sm:max-w-sm rounded-xl shadow-2xl border border-[#EBD5BD]/30 z-[100] px-2"
                style={{ background: "rgba(44, 44, 44, 0.98)" }}
              >
                <div className="px-4 pt-4 pb-2 border-b border-[#EBD5BD]/30">
                  <div className="text-xs text-[#EBD5BD] font-semibold mb-2 tracking-wide text-center">
                    {petName}'s Code
                  </div>
                  <div className="flex gap-2 mb-2 justify-center items-center">
                    {generatePetCode(petId || "")
                      .split("")
                      .map((char: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex w-8 h-8 bg-[#fff] bg-opacity-80 text-[#23272f] text-lg font-extrabold rounded-lg items-center justify-center border-2 border-[#EBD5BD] shadow-sm tracking-widest select-all transition-all duration-150 hover:scale-105 text-center"
                        >
                          {char}
                        </span>
                      ))}
                  </div>
                  <div className="text-xs text-[#EBD5BD] text-opacity-70 mb-1 text-center">
                    Share with care providers to give access to the profile.
                  </div>
                </div>
                <div className="flex flex-col py-1">
                  <button
                    className="text-left px-4 py-2 text-sm text-[#EBD5BD] hover:bg-[#EBD5BD]/10 transition font-medium"
                    onClick={() => {
                      navigate(`/petowner/pet/${petId}/profile`);
                      setIsMobileDropdownOpen(false);
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    className="text-left px-4 py-2 text-sm text-[#EBD5BD] font-semibold hover:bg-[#EBD5BD]/10 transition"
                    onClick={() => {
                      if (typeof onSwitchProfile === "function") {
                        onSwitchProfile();
                        setIsMobileDropdownOpen(false);
                      } else {
                        navigate("/switch-profile");
                        setIsMobileDropdownOpen(false);
                      }
                    }}
                  >
                    Not {petName}?{" "}
                    <span className="text-[#FFB23E]">Switch Profile</span>
                  </button>
                  <button className="text-left px-4 py-2 text-sm text-[#EBD5BD] hover:bg-[#EBD5BD]/10 transition font-medium">
                    Help Center
                  </button>
                  <button className="text-left px-4 py-2 text-sm text-[#EBD5BD] hover:bg-[#EBD5BD]/10 transition font-medium">
                    Billing Information
                  </button>
                  <button className="text-left px-4 py-2 text-sm text-[#EBD5BD] hover:bg-[#EBD5BD]/10 transition font-medium">
                    Settings
                  </button>
                  <button
                    className="text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition font-medium border-t border-[#EBD5BD]/30"
                    onClick={() => {
                      handleLogout();
                      setIsMobileDropdownOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Desktop Navbar */}
      <div
        className="hidden shadow-md lg:flex max-w-7xl bg-[#fffaed] items-center justify-between mx-10 mt-6 mb-0 px-8 py-2"
        style={{
          border: "1.5px solid var(--color-card-button)",
          borderRadius: "40px",
          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.02)",
        }}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-3 h-6">
          <img
            src={PetWellLogo}
            alt="PetWell Logo"
            className="object-contain h-full w-auto"
          />
        </div>
        {/* Center: Navigation */}
        <div className="flex items-center gap-2 xl:gap-4">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`px-7 py-2 text-sm rounded-full cursor-pointer transition font-medium text-base ${
                location.pathname === item.path
                  ? "bg-[var(--color-card-button)] text-[var(--color-text)] font-bold"
                  : "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-card-button)]/70"
              }`}
              style={{ minWidth: 100 }}
            >
              {item.name}
            </button>
          ))}
        </div>
        {/* Right: Notification + Profile */}
        <div className="flex items-center gap-4">
          {/* Bell Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-card-button)] bg-transparent">
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="var(--color-card-button)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </div>
          {/* Profile */}
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-full hover:bg-[var(--color-card-button)]/30 transition"
              onClick={handleDropdownToggle}
            >
              <img
                src={petImage}
                alt="Pet"
                className="w-8 h-8 rounded-full object-cover border-2 border-[var(--color-card-button)]"
              />
              <span className="text-[var(--color-text)] font-semibold text-base">
                {petName}
              </span>
              <svg
                className={`w-4 h-4 text-[var(--color-text)] transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {/* Dropdown (improved position) */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 top-full w-72 rounded-2xl shadow-2xl border border-[#EBD5BD]/40 z-50 animate-fadeIn"
                style={{ background: "#fff8e5", minWidth: 280, marginTop: 12 }}
                ref={dropdownRef}
              >
                <div className="px-5 pt-5 pb-3 border-b border-[#EBD5BD]/40">
                  <div className="text-xs text-[#b48a4a] font-semibold mb-2 tracking-wide text-center">
                    {petName}'s Code
                  </div>
                  <div className="flex gap-2 mb-2 justify-center items-center">
                    {generatePetCode(petId || "")
                      .split("")
                      .map((char: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex w-8 h-8 bg-[#fff] bg-opacity-90 text-[#23272f] text-lg font-extrabold rounded-lg items-center justify-center border-2 border-[#EBD5BD] shadow-sm tracking-widest select-all transition-all duration-150 hover:scale-105 text-center"
                        >
                          {char}
                        </span>
                      ))}
                  </div>
                  <div className="text-xs text-[#b48a4a] text-opacity-80 mb-1 text-center">
                    Share with care providers to give access to the profile.
                  </div>
                </div>
                <div className="flex flex-col py-2">
                  <button
                    className="text-left px-5 py-3 text-base text-[#23272f] hover:bg-[#ffe3b8] rounded-xl transition font-medium"
                    onClick={() => { navigate(`/petowner/pet/${petId}/profile`); setIsDropdownOpen(false); }}
                  >
                    View Profile
                  </button>
                  <button
                    className="text-left px-5 py-3 text-base text-[#23272f] font-semibold hover:bg-[#ffe3b8] rounded-xl transition"
                    onClick={() => {
                      if (typeof onSwitchProfile === "function") {
                        onSwitchProfile();
                        setIsDropdownOpen(false);
                      } else {
                        navigate("/switch-profile");
                        setIsDropdownOpen(false);
                      }
                    }}
                  >
                    Not {petName}? <span className="text-[#FFB23E]">Switch Profile</span>
                  </button>
                  <button className="text-left px-5 py-3 text-base text-[#23272f] hover:bg-[#ffe3b8] rounded-xl transition font-medium">
                    Help Center
                  </button>
                  <button className="text-left px-5 py-3 text-base text-[#23272f] hover:bg-[#ffe3b8] rounded-xl transition font-medium">
                    Billing Information
                  </button>
                  <button className="text-left px-5 py-3 text-base text-[#23272f] hover:bg-[#ffe3b8] rounded-xl transition font-medium">
                    Settings
                  </button>
                  <button
                    className="text-left px-5 py-3 text-base text-red-500 hover:bg-red-100 rounded-xl transition font-medium border-t border-[#EBD5BD]/30 mt-2"
                    onClick={() => { handleLogout(); setIsDropdownOpen(false); }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
