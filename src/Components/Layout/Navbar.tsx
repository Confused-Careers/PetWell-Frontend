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
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
            <div className="flex items-center space-x-3">
              <img
                src={PetWellLogo}
                alt="PetWell Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-bold text-[var(--color-text)]">
                PetWell
              </span>
            </div>
            <button
              onClick={handleMobileMenuToggle}
              className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
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

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[var(--color-border)]">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={petImage}
                alt="Pet"
                className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-primary)]"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {petName}
                </p>
                <button
                  onClick={handleMobileDropdownToggle}
                  className="flex items-center space-x-1 text-xs text-[var(--color-primary)] hover:underline"
                >
                  <span>Switch Profile</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${
                      isMobileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileDropdownOpen && (
              <div className="mb-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
                <div className="px-4 pt-4 pb-2 border-b border-[var(--color-border)]">
                  <div className="text-xs text-[var(--color-text)] font-semibold mb-2 tracking-wide text-center">
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
                  <div className="text-xs text-[var(--color-text)] text-opacity-70 mb-1 text-center">
                    Share with care providers to give access to the profile.
                  </div>
                </div>
                <div className="flex flex-col py-1">
                  <button
                    className="text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-accent-hover)] transition font-medium"
                    onClick={() => {
                      navigate(`/petowner/pet/${petId}/profile`);
                      setIsMobileMenuOpen(false);
                      setIsMobileDropdownOpen(false);
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    className="text-left px-4 py-2 text-sm text-[var(--color-text)] font-semibold hover:bg-[var(--color-accent-hover)] transition"
                    onClick={() => {
                      if (typeof onSwitchProfile === "function") {
                        onSwitchProfile();
                        setIsMobileMenuOpen(false);
                        setIsMobileDropdownOpen(false);
                      } else {
                        navigate("/switch-profile");
                        setIsMobileMenuOpen(false);
                        setIsMobileDropdownOpen(false);
                      }
                    }}
                  >
                    Not {petName}?{" "}
                    <span className="text-[#FFB23E]">Switch Profile</span>
                  </button>
                  <button className="text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-accent-hover)] transition font-medium">
                    Help Center
                  </button>
                  <button className="text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-accent-hover)] transition font-medium">
                    Billing Information
                  </button>
                  <button className="text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-accent-hover)] transition font-medium">
                    Settings
                  </button>
                  <button
                    className="text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition font-medium border-t border-[var(--color-border)]"
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

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
      <nav className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 bg-transparent w-full">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4 md:mb-0">
          {/* Mobile Menu Toggle */}
          <button
            onClick={handleMobileMenuToggle}
            className="lg:hidden p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors mobile-menu-toggle"
          >
            <Menu size={20} />
          </button>

          <img
            src={PetWellLogo}
            alt="PetWell Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-row space-x-8 md:space-x-12 lg:space-x-16 text-sm sm:text-base md:text-lg font-medium items-center mb-3 sm:mb-4 md:mb-0">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className={`hover:text-[var(--color-primary)] transition px-2 py-1 sm:px-3 sm:py-2 ${
                location.pathname === item.path
                  ? "text-[var(--color-primary)] font-bold underline underline-offset-4 sm:underline-offset-8"
                  : "text-[var(--color-text)]"
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop Profile Section */}
        <div
          className="hidden lg:flex relative items-center space-x-2 sm:space-x-3"
          ref={dropdownRef}
        >
          <span className="text-[var(--color-text)] font-semibold text-sm sm:text-base">
            {petName}
          </span>
          <div className="relative">
            <button
              onClick={handleDropdownToggle}
              className="flex items-center space-x-1 sm:space-x-2 focus:outline-none p-1"
            >
              <img
                src={petImage}
                alt="Pet"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-[var(--color-primary)]"
              />
              <svg
                className={`w-3 h-3 sm:w-4 sm:h-4 text-[var(--color-text)] transition-transform ${
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
            </button>
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 sm:w-64 rounded-xl shadow-2xl border border-[#EBD5BD]/30 z-50"
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
                    onClick={() => navigate(`/petowner/pet/${petId}/profile`)}
                  >
                    View Profile
                  </button>
                  <button
                    className="text-left px-4 py-2 text-sm text-[#EBD5BD] font-semibold hover:bg-[#EBD5BD]/10 transition"
                    onClick={() => {
                      if (typeof onSwitchProfile === "function") {
                        onSwitchProfile();
                        setIsDropdownOpen(false);
                      } else {
                        navigate("/switch-profile");
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
                    className="text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition font-medium border-t border-[#EBD5BD]/20"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
