import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Scanner } from "@yudiel/react-qr-scanner";
import { RiQrScan2Line } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import PetWellLogo from "../../Assets/PetWell.png";
import businessServices from "../../Services/businessServices";
import notificationServices from "../../Services/notificationServices";
import { ChevronDown, Menu, X } from "lucide-react";
import PetBusinessAvatar from "../../Assets/PetBusinessAvatar.svg";

interface Notification {
  id: string;
  human_owner?: { id: string };
  pet?: { id: string };
  business?: { id: string };
  staff?: { id: string };
  message: string;
  type:
    | "VaccineAdded"
    | "DocumentUploaded"
    | "VaccineDue"
    | "PetBirthday"
    | "StaffAdded";
  is_read: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

const BusinessNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const [businessName, setBusinessName] = useState<string>("Business");
  const [businessImage, setBusinessImage] = useState<string>(PetBusinessAvatar);
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDropdownToggle = () => setIsDropdownOpen((open) => !open);
  const handleMobileMenuToggle = () => setIsMobileMenuOpen((open) => !open);
  const handleMobileDropdownToggle = () =>
    setIsMobileDropdownOpen((open) => !open);
  const handleNotificationDropdownToggle = () =>
    setIsNotificationDropdownOpen((open) => !open);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Handle code input change
  const handleCodeChange = (value: string, idx: number) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value.toUpperCase();
    setCode(newCode);
    if (value && idx < 4) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  // Handle code input keydown
  const handleCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === "Enter" && code.every((char) => char !== "")) {
      submitCode();
    }
  };

  // Handle QR scan
  const handleScan = (result: any) => {
    if (result && result[0]?.rawValue) {
      const scannedCode = result[0].rawValue;
      if (/^[a-zA-Z0-9]{5}$/.test(scannedCode)) {
        const newCode = scannedCode.toUpperCase().split("");
        setCode(newCode);
        setIsScannerOpen(false);
        toast.success("QR code scanned successfully!");
        inputRefs.current[0]?.focus();
      } else {
        toast.error("Invalid QR code. Please scan a 5-character code.");
      }
    }
  };

  // Handle QR scan error
  const handleScanError = (err: any) => {
    console.error(err);
    toast.error(
      "Error accessing camera. Please ensure permissions are granted."
    );
  };

  // Submit code
  const submitCode = async () => {
    if (isSubmitting) return;

    const enteredCode = code.join("");
    if (enteredCode.length !== 5) {
      toast.error("Please enter a valid 5-character pet code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await businessServices.createPetMapping({
        qr_code_id: enteredCode,
      });
      toast.success(`Pet added successfully. Say Hi! to ${response.pet_name}`);
      setCode(["", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error.message || "Failed to add pet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await notificationServices.getNotifications({});
      console.log("Fetched notifications:", response);
      setNotifications((response as unknown as Notification[]) || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const response = await notificationServices.getUnreadCount();
      setUnreadCount(response.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  // Mark notification as read

  // Dismiss notification
  {
    /*const handleDismiss = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await notificationServices.dismiss(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      setUnreadCount((prev) => prev - (notifications.find((notif) => notif.id === id)?.is_read ? 0 : 1));
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };*/
  }

  // Mark all notifications as read

  // Dismiss all notifications

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotificationDropdownOpen(false);
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

  // Fetch business profile
  useEffect(() => {
    (async () => {
      try {
        const res = await businessServices.getProfile();
        setBusinessName(res?.business_name || "Business");
        setBusinessImage(
          res?.profilePictureDocument?.document_url || PetBusinessAvatar
        );
      } catch {
        setBusinessName("Business");
        setBusinessImage(PetBusinessAvatar);
      }
    })();
  }, []);

  // Fetch notifications and unread count on mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const navigationItems = [
    { name: "Home", path: "/business-home" },
    { name: "Pet Records", path: "/business/pet-records" },
    { name: "Team Management", path: "/business/team-management" },
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
        style={{ borderRight: "2px solid var(--color-border)" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-end p-4 border-b border-[var(--color-border)]">
            <button
              onClick={handleMobileMenuToggle}
              className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
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

      {/* Mobile Top Navbar */}
      <div className="lg:hidden">
        <nav className="flex items-center justify-between px-3 py-3 bg-transparent w-full">
          <div className="flex items-center space-x-3">
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
          <div className="flex items-center gap-3">
            {/* Bell Icon with Notification Count */}
            <div className="relative">
              <button
                onClick={() => handleNotificationDropdownToggle()}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--color-card-button)] bg-transparent cursor-pointer"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="var(--color-card-button)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-1-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isNotificationDropdownOpen && (
                <div
                  className="fixed left-0 right-0 top-16 mx-auto w-full max-w-[200px] sm:max-w-[200px] rounded-xl shadow-2xl border z-[100] px-2"
                  style={{
                    background: "var(--color-card-profile)",
                    borderColor: "var(--color-border)",
                  }}
                  ref={notificationDropdownRef}
                >
                  <div
                    className="px-4 pt-4 pb-2 border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div className="text-base font-bold text-white mb-2 tracking-wide font-[Cabin,sans-serif]">
                      Notifications
                    </div>
                    {notifications?.length === 0 ? (
                      <div className="text-sm text-white/80 text-center font-[Cabin,sans-serif] py-2">
                        No notifications
                      </div>
                    ) : (
                      <div
                        className="max-h-60 overflow-y-auto scrollbar-hide"
                        style={{ scrollbarWidth: "none" }}
                      >
                        {notifications?.map((notification) => (
                          <div
                            key={notification.id}
                            className="flex justify-between items-center py-2 border-b border-[var(--color-border)]"
                          >
                            <div className="text-sm text-white font-[Cabin,sans-serif] flex-1">
                              {notification.message}
                              <span className="block text-xs text-white/60">
                                {new Date(
                                  notification.created_at
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Profile */}
            <div className="relative flex items-center" ref={dropdownRef}>
              <button
                onClick={handleMobileDropdownToggle}
                className="flex items-center space-x-1 focus:outline-none p-1"
              >
                <img
                  src={businessImage}
                  alt="Business"
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
                  style={{
                    background: "var(--color-card-profile)",
                    borderColor: "var(--color-border)",
                  }}
                  ref={dropdownRef}
                >
                  <div
                    className="px-4 pt-4 pb-2 border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div className="text-base font-bold text-white mb-2 tracking-wide font-[Cabin,sans-serif] text-center">
                      Add New Pet?
                    </div>
                    <div className="flex gap-1 mb-2 justify-center items-center">
                      {[...Array(5)]?.map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          disabled={isSubmitting}
                          className="w-14 h-16 rounded-xl bg-[#FFF8E5] text-[var(--color-business-heading)] text-2xl font-cabin text-center focus:outline-none border border-[var(--color-business-blue,#6A8293)] shadow-sm mx-0.5"
                          value={code[i]}
                          onChange={(e) => handleCodeChange(e.target.value, i)}
                          onKeyDown={(e) => handleCodeKeyDown(e, i)}
                          ref={(el) => {
                            inputRefs.current[i] = el;
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-white/80 mb-3 text-center font-[Cabin,sans-serif]">
                      Enter the code shared by the pet parent.
                    </div>
                    <button
                      className="w-full flex items-center justify-center gap-2 border border-white text-white font-semibold rounded-xl py-2 mb-2 hover:bg-white/10 transition text-base font-[Cabin,sans-serif] cursor-pointer"
                      style={{ background: "transparent" }}
                      onClick={() => setIsScannerOpen(true)}
                    >
                      <RiQrScan2Line size={18} />
                      Scan QR
                    </button>
                  </div>
                  <div className="flex flex-col py-2 font-[Cabin,sans-serif]">
                    <button
                      className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
                      onClick={() => {
                        navigate("/business/profile");
                        setIsMobileDropdownOpen(false);
                      }}
                    >
                      Edit Profile
                    </button>
                    <button
                      className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
                      onClick={() => {
                        navigate("/reset-password");
                        setIsMobileDropdownOpen(false);
                      }}
                    >
                      Reset Password
                    </button>
                    <button
                      className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
                      onClick={() => {
                        navigate("/help-center");
                        setIsMobileDropdownOpen(false);
                      }}
                    >
                      Help Center
                    </button>
                    <button
                      className="text-left px-5 py-3 text-base text-red-200 hover:bg-red-400/10 transition font-medium cursor-pointer"
                      onClick={() => {
                        handleLogout();
                        setIsMobileDropdownOpen(false);
                      }}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
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
          <div className="flex items-center gap-3 h-6 ml-6">
            <img
              src={PetWellLogo}
              alt="PetWell Logo"
              className="object-contain h-full w-auto cursor-pointer"
              onClick={() => navigate("/business-home")}
            />
          </div>
          <div className="flex items-center gap-2 xl:gap-4">
            {navigationItems?.map((item) => (
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
          <div className="flex items-center gap-4">
            {/* Bell Icon with Notification Count */}
            <div className="relative" ref={notificationDropdownRef}>
              <button
                onClick={handleNotificationDropdownToggle}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-card-button)] bg-transparent"
              >
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
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isNotificationDropdownOpen && (
                <div
                  className="absolute right-0 top-full w-48 rounded-2xl shadow-2xl border z-50 animate-fadeIn"
                  style={{
                    background: "var(--color-card-profile)",
                    minWidth: 320,
                    marginTop: 12,
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div
                    className="px-5 pt-5 pb-3 border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div className="text-base font-bold text-white mb-2 tracking-wide font-[Cabin,sans-serif]">
                      Notifications
                    </div>
                    {notifications?.length === 0 ? (
                      <div className="text-sm text-white/80 text-center font-[Cabin,sans-serif] py-2">
                        No notifications
                      </div>
                    ) : (
                      <div
                        className="max-h-60 overflow-y-auto scrollbar-hide"
                        style={{ scrollbarWidth: "none" }}
                      >
                        {notifications?.map((notification) => (
                          <div
                            key={notification.id}
                            className="flex justify-between items-center py-2 border-b border-[var(--color-border)]"
                          >
                            <div className="text-sm text-white font-[Cabin,sans-serif] flex-1">
                              {notification.message}
                              <span className="block text-xs text-white/60">
                                {new Date(
                                  notification.created_at
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Profile */}
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-full hover:bg-[var(--color-card-button)]/30 transition mr-3"
                onClick={handleDropdownToggle}
              >
                <img
                  src={businessImage}
                  alt="Business"
                  className="w-8 h-8 rounded-full object-cover border-2 border-[var(--color-card-button)]"
                />
                <span className="text-[var(--color-text)] font-semibold text-base">
                  {businessName}
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
              {isDropdownOpen && (
                <div
                  className="absolute right-0 top-full w-48 rounded-2xl shadow-2xl border z-50 animate-fadeIn"
                  style={{
                    background: "var(--color-card-profile)",
                    minWidth: 256,
                    marginTop: 12,
                    borderColor: "var(--color-border)",
                  }}
                  ref={dropdownRef}
                >
                  <div
                    className="px-5 pt-5 pb-3 border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div className="text-base font-bold text-white mb-2 tracking-wide font-[Cabin,sans-serif]">
                      Add New Pet?
                    </div>
                    <div className="flex gap-1 mb-2 justify-center items-center">
                      {[...Array(5)]?.map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          disabled={isSubmitting}
                          className="w-12 h-14 rounded-xl bg-[#FFF8E5] text-[var(--color-business-heading)] text-2xl font-cabin text-center focus:outline-none border border-[var(--color-business-blue,#6A8293)] shadow-sm"
                          value={code[i]}
                          onChange={(e) => handleCodeChange(e.target.value, i)}
                          onKeyDown={(e) => handleCodeKeyDown(e, i)}
                          ref={(el) => {
                            inputRefs.current[i] = el;
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-white/80 mb-3 text-center font-[Cabin,sans-serif]">
                      Enter the code shared by the pet parent.
                    </div>
                    <button
                      className="w-full flex items-center justify-center gap-2 border border-white text-white font-semibold rounded-xl py-2 mb-2 hover:bg-white/10 transition text-base font-[Cabin,sans-serif] cursor-pointer"
                      style={{ background: "transparent" }}
                      onClick={() => setIsScannerOpen(true)}
                    >
                      <RiQrScan2Line size={18} />
                      Scan QR
                    </button>
                  </div>
                  <div className="flex flex-col py-2 font-[Cabin,sans-serif]">
                    <button
                      className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
                      onClick={() => {
                        navigate("/business/profile");
                        setIsDropdownOpen(false);
                      }}
                    >
                      Edit Profile
                    </button>
                    <button
                      className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
                      onClick={() => {
                        navigate("/reset-password");
                        setIsDropdownOpen(false);
                      }}
                    >
                      Reset Password
                    </button>
                    <button
                      className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
                      onClick={() => {
                        navigate("/help-center");
                        setIsDropdownOpen(false);
                      }}
                    >
                      Help Center
                    </button>
                    <button
                      className="text-left px-5 py-3 text-base text-red-200 hover:bg-red-400/10 transition font-medium cursor-pointer"
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
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

      {/* QR Scanner Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-[#FFF8E5] rounded-lg p-4 w-[90%] max-w-[400px] relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-black text-xl font-bold h-5 w-5 z-10"
              onClick={() => setIsScannerOpen(false)}
              tabIndex={0}
              aria-label="Close scanner"
            >
              <MdCancel />
            </button>
            <div className="w-full h-[300px] relative p-6">
              <Scanner
                onScan={handleScan}
                onError={handleScanError}
                constraints={{ facingMode: "environment" }}
                formats={["qr_code"]}
                styles={{
                  container: { width: "100%", height: "100%" },
                  video: { width: "100%", height: "100%", objectFit: "cover" },
                }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  border: "2px solid #FFB23E",
                  width: "200px",
                  height: "200px",
                  margin: "auto",
                }}
              />
            </div>
            <p className="text-center text-black mt-2">
              Center the QR code within the square
            </p>
          </div>
        </div>
      )}

      {/* Inline styles to hide scrollbar */}
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;     /* Firefox */
          }
        `}
      </style>
    </>
  );
};

export default BusinessNavbar;
