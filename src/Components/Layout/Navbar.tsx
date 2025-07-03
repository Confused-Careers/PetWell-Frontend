import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PetWellLogo from "../../Assets/PetWell.png";
import petServices from "../../Services/petServices";
import { logout } from "../../utils/petNavigation";
import { generatePetCode } from "../../utils/petCodeGenerator";
import { Menu, X, ChevronDown } from "lucide-react";
import QRCode from "react-qr-code";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog";

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
  const [petQrCode, setPetQrCode] = useState<string>("");
  const [showQRModal, setShowQRModal] = useState(false);

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
          setPetQrCode("");
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
          setPetQrCode(petData.qr_code_id || "");
        } else {
          setPetName("Pet");
          setPetImage("https://randomuser.me/api/portraits/men/32.jpg");
          setPetQrCode("");
        }
      } catch {
        setPetName("Pet");
        setPetImage("https://randomuser.me/api/portraits/men/32.jpg");
        setPetQrCode("");
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
        className={`fixed top-0 left-0 h-full w-64 bg-[var(--color-card-profile)] shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden mobile-menu ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ borderRight: '2px solid var(--color-border)' }}
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
      <div className="lg:hidden ">
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
              className="w-24 h-24 object-contain"
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
                className="fixed left-0 right-0 top-16 mx-auto w-full max-w-xs sm:max-w-sm rounded-xl shadow-2xl border z-[100] px-2"
                style={{ background: "var(--color-card-profile)", borderColor: "var(--color-border)" }}
              >
                <div className="px-4 pt-4 pb-2 border-b" style={{ borderColor: "var(--color-border)" }}>
                  <div className="text-base font-bold text-white mb-2 tracking-wide font-[Cabin,sans-serif] text-center">
                    {petName}'s Code
                  </div>
                  <div className="flex gap-2 mb-2 justify-center items-center">
                    {(petQrCode || "")
                      .split("")
                      .map((char: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex w-8 h-10 font-bold bg-white text-[#23272f] text-xl rounded-lg items-center justify-center shadow-sm select-all text-center border border-[var(--color-border)]"
                        >
                          {char}
                        </span>
                      ))}
                  </div>
                  <div className="text-xs text-white/80 mb-3 text-center font-[Cabin,sans-serif]">
                    Share with care providers to give access to the profile.
                  </div>
                  <button
                    className="w-full flex items-center justify-center gap-2 border border-white text-white font-semibold rounded-xl py-2 mb-2 hover:bg-white/10 transition text-base font-[Cabin,sans-serif] cursor-pointer"
                    style={{ background: "transparent" }}
                    onClick={() => setShowQRModal(true)}
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/></svg>
                    View QR
                  </button>
                </div>
                <div className="flex flex-col py-2 font-[Cabin,sans-serif]">
                  <button
                    className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
                    onClick={() => { navigate(`/petowner/pet/${petId}/profile`); setIsMobileDropdownOpen(false); }}
                  >
                    View or Edit Profile
                  </button>
                  <button
                    className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
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
                    Not {petName}? Switch Profile
                  </button>
                  <button
                    className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
                    onClick={() => { navigate("/reset-password"); setIsMobileDropdownOpen(false); }}
                  >
                    Reset Password
                  </button>
                  <button
                    className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
                    onClick={() => { navigate("/help-center"); setIsMobileDropdownOpen(false); }}
                  >
                    Help Center
                  </button>
                  <button
                    className="text-left px-5 py-3 text-base text-red-200 hover:bg-red-400/10 transition font-medium cursor-pointer"
                    onClick={() => { handleLogout(); setIsMobileDropdownOpen(false); }}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden lg:block w-full px-8 xl:px-16 2xl:px-32">
        <div
          className="shadow-md flex max-w-7xl bg-[#fffaed] items-center justify-between mx-auto mt-6 mb-0 py-2"
          style={{
            border: "1.5px solid var(--color-card-button)",
            borderRadius: "40px",
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.02)",
          }}
        >
          {/* Left: Logo */}
          <div className="flex items-center gap-3 h-6 ml-6">
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
                className={`px-7 py-2 text-sm rounded-full cursor-pointer transition text-base ${
                  location.pathname === item.path
                    ? "bg-[var(--color-card-button)] text-[var(--color-text)] font-bold"
                    : "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-card-button)]/70 font-normal"
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
                  className="absolute right-0 top-full w-80 rounded-2xl shadow-2xl border z-50 animate-fadeIn"
                  style={{ background: "var(--color-card-profile)", minWidth: 320, marginTop: 12, borderColor: "var(--color-border)" }}
                  ref={dropdownRef}
                >
                  <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>
                    <div className="text-base font-bold text-white mb-2 tracking-wide font-[Cabin,sans-serif]">
                      {petName}'s Code
                    </div>
                    <div className="flex gap-2 mb-2 justify-center items-center">
                      {(petQrCode || "")
                        .split("")
                        .map((char: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex w-8 h-10 font-bold bg-white text-[#23272f] text-xl rounded-lg items-center justify-center shadow-sm select-all text-center border border-[var(--color-border)]"
                          >
                            {char}
                          </span>
                        ))}
                    </div>
                    <div className="text-xs text-white/80 mb-3 text-center font-[Cabin,sans-serif]">
                      Share with care providers to give access to the profile.
                    </div>
                    <button
                      className="w-full flex items-center justify-center gap-2 border border-white text-white font-semibold rounded-xl py-2 mb-2 hover:bg-white/10 transition text-base font-[Cabin,sans-serif] cursor-pointer"
                      style={{ background: "transparent" }}
                      onClick={() => setShowQRModal(true)}
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/></svg>
                      View QR
                    </button>
                  </div>
                  <div className="flex flex-col py-2 font-[Cabin,sans-serif]">
                    <button
                      className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
                      onClick={() => { navigate(`/petowner/pet/${petId}/profile`); setIsDropdownOpen(false); }}
                    >
                      View or Edit Profile
                    </button>
                    <button
                      className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
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
                      Not {petName}? Switch Profile
                    </button>
                    <button
                      className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
                      onClick={() => { navigate("/reset-password"); setIsDropdownOpen(false); }}
                    >
                      Reset Password
                    </button>
                    <button
                      className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
                      onClick={() => { navigate("/help-center"); setIsDropdownOpen(false); }}
                    >
                      Help Center
                    </button>
                    <button
                      className="text-left px-5 py-3 text-base text-red-200 hover:bg-red-400/10 transition font-medium cursor-pointer"
                      onClick={() => { handleLogout(); setIsDropdownOpen(false); }}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showQRModal && (
        <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
          <DialogContent className="flex flex-col items-center bg-[var(--color-card-profile)] rounded-2xl border border-[var(--color-primary)] p-8 shadow-2xl max-w-xs w-full" style={{ zIndex: 9999 }}>
            <DialogTitle className="text-xl font-bold text-[var(--color-primary)] mb-2">
              Pet QR Code
            </DialogTitle>
            <div className="my-4 flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl shadow-md border border-[var(--color-primary)]">
                <QRCode value={petQrCode || ""} size={180} />
              </div>
            </div>
            <div className="text-center text-sm text-[var(--color-text)] mt-2">
              Scan this QR code to add this pet to a business
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Navbar;
