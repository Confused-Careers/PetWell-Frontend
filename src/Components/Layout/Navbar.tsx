import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PetWellLogo from "../../Assets/PetWell.png";
import petServices from "../../Services/petServices";
import notificationServices from "../../Services/notificationServices";
import { logout } from "../../utils/petNavigation";
import { Menu, X, ChevronDown, Bell } from "lucide-react";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

interface NavbarProps {
  onEditProfile?: () => void;
  onSwitchProfile?: () => void;
  onSettings?: () => void;
}

interface Notification {
  id: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  pet_id?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSwitchProfile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const [petName, setPetName] = useState<string>("Pet");
  const [petImage, setPetImage] = useState<string>(
    "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80"
  );
  const [petQrCode, setPetQrCode] = useState<string>("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notificationError, setNotificationError] = useState<string | null>(
    null
  );

  const handleDropdownToggle = () => setIsDropdownOpen((open) => !open);
  const handleMobileMenuToggle = () => setIsMobileMenuOpen((open) => !open);
  const handleMobileDropdownToggle = () =>
    setIsMobileDropdownOpen((open) => !open);
  const handleNotificationDropdownToggle = () => {
    setIsNotificationDropdownOpen((open) => !open);
    if (!isNotificationDropdownOpen) fetchNotifications();
  };

  const handleLogout = () => {
    logout(petId);
    localStorage.removeItem("token");
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsNotificationDropdownOpen(false);
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsNotificationDropdownOpen(false);
  };

  const fetchNotifications = async () => {
    try {
      const filter: any = { is_read: false };
      if (petId) filter.pet_id = petId;
      const data = await notificationServices.getNotifications(filter);
      setNotifications(data as unknown as Notification[]);
      setUnreadCount(data.length);
      setNotificationError(null);
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
      setNotificationError(error.message || "Failed to load notifications");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationServices.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error("Failed to mark notification as read:", error);
      setNotificationError(
        error.message || "Failed to mark notification as read"
      );
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await notificationServices.dismiss(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      setUnreadCount((prev) =>
        Math.max(
          0,
          prev - (notifications.find((n) => n.id === id)?.is_read ? 0 : 1)
        )
      );
    } catch (error: any) {
      console.error("Failed to dismiss notification:", error);
      setNotificationError(error.message || "Failed to dismiss notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationServices.markAllAsRead(petId);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error: any) {
      console.error("Failed to mark all notifications as read:", error);
      setNotificationError(
        error.message || "Failed to mark all notifications as read"
      );
    }
  };

  const handleDismissAll = async () => {
    try {
      await notificationServices.dismissAll(petId);
      setNotifications([]);
      setUnreadCount(0);
    } catch (error: any) {
      console.error("Failed to dismiss all notifications:", error);
      setNotificationError(
        error.message || "Failed to dismiss all notifications"
      );
    }
  };

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

  useEffect(() => {
    if (isMobileMenuOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (
          !target.closest(".mobile-menu") &&
          !target.closest(".mobile-menu-toggle")
        ) {
          setIsMobileMenuOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    (async () => {
      try {
        if (!petId) {
          setPetName("Pet");
          setPetImage(
            "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80"
          );
          setPetQrCode("");
          return;
        }

        const petRes = await petServices.getPetById(petId);
        let petData: any = petRes;

        if (petRes && petRes.data) petData = petRes.data;
        if (Array.isArray(petData)) petData = petData[0];

        if (petData && petData.pet_name) {
          setPetName(petData.pet_name);
          const profilePic = petData.profile_picture;
          let avatar =
            (profilePic && typeof profilePic === "string" && profilePic) ||
            petData.profilePictureDocument?.document_url ||
            profilePic?.profilePictureDocument?.document_url ||
            "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80";
          setPetImage(avatar);
          setPetQrCode(petData.qr_code_id || "");
        } else {
          setPetName("Pet");
          setPetImage(
            "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80"
          );
          setPetQrCode("");
        }
      } catch {
        setPetName("Pet");
        setPetImage(
          "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80"
        );
        setPetQrCode("");
      }
    })();
  }, [petId]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every 60 seconds
    return () => clearInterval(interval);
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
        <nav className="flex items-center justify-between px-3 bg-transparent w-full">
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
          <div className="relative flex items-center gap-2" ref={dropdownRef}>
            <div className="relative">
              <button
                onClick={handleNotificationDropdownToggle}
                className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
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
                style={{
                  background: "var(--color-card-profile)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div
                  className="px-4 pt-4 pb-2 border-b"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="text-base font-bold text-white mb-2 tracking-wide font-[Cabin,sans-serif] text-center">
                    {petName}'s Code
                  </div>
                  <div className="flex gap-2 mb-2 justify-center items-center">
                    {(petQrCode || "")
                      .split("")
                      .map((char: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex w-8 h-10  bg-[var(--color-text-bright)] bg-opacity-80 text-[#23272f] text-2xl rounded-lg items-center justify-center select-all transition-all duration-150 hover:scale-105 text-center font-[Alike]"
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="21"
                      viewBox="0 0 24 25"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_1021_7408)">
                        <path
                          d="M12 3.3125V5.1875H10.125V3.3125H12ZM10.125 14.3281V17H12V14.3281H10.125ZM15.75 24.5V22.625H13.875V20.75H12V24.5H15.75ZM19.5 10.5781H13.875V12.4531H19.5V10.5781ZM19.5 14.3281H22.125V12.4531H19.5V14.3281ZM19.5 17V18.875H24V14.3281H22.125V17H19.5ZM13.875 0.5H12V3.3125H13.875V0.5ZM12 8.9375H13.875V5.1875H12V7.0625H10.125V12.4531H12V8.9375ZM0 10.5781V14.3281H1.875V12.4531H4.6875V10.5781H0ZM13.875 14.3281V12.4531H12V14.3281H13.875ZM17.625 16.2031H19.5V14.3281H17.625V16.2031ZM22.125 12.4531H24V10.5781H22.125V12.4531ZM15.75 14.3281H13.875V17H12V18.875H15.75V14.3281ZM10.125 20.75H12V18.875H10.125V20.75ZM15.75 18.875V20.75H19.5V18.875H15.75ZM21.375 22.625V20.75H19.5V22.625H21.375ZM24 24.5V22.625H21.375V24.5H24ZM17.625 24.5H19.5V22.625H17.625V24.5ZM8.4375 12.4531V10.5781H6.5625V12.4531H4.6875V14.3281H10.125V12.4531H8.4375ZM8.4375 8.9375H0V0.5H8.4375V8.9375ZM6.5625 2.375H1.875V7.0625H6.5625V2.375ZM5.15625 3.78125H3.28125V5.65625H5.15625V3.78125ZM24 0.5V8.9375H15.5625V0.5H24ZM22.125 2.375H17.4375V7.0625H22.125V2.375ZM20.7188 3.78125H18.8438V5.65625H20.7188V3.78125ZM0 16.0625H8.4375V24.5H0V16.0625ZM1.875 22.625H6.5625V17.9375H1.875V22.625ZM3.28125 21.2188H5.15625V19.3438H3.28125V21.2188Z"
                          fill="black"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1021_7408">
                          <rect
                            width="24"
                            height="24"
                            fill="white"
                            transform="translate(0 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    View QR
                  </button>
                </div>
                <div className="flex flex-col py-2 font-[Cabin,sans-serif]">
                  <button
                    className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
                    onClick={() => {
                      navigate(`/petowner/pet/${petId}/profile`);
                      setIsMobileDropdownOpen(false);
                    }}
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
                        navigate(`/petowner/pet/${petId}/switch-profile`);
                        setIsMobileDropdownOpen(false);
                      }
                    }}
                  >
                    Not {petName}? Switch Profile
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
            {isNotificationDropdownOpen && (
              <div
                className="fixed left-0 right-0 top-16 mx-auto w-full max-w-xs sm:max-w-sm rounded-xl shadow-2xl border z-[100] px-2"
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
                  <div className="text-base font-bold text-white mb-2 tracking-wide font-[Cabin,sans-serif] text-center">
                    Notifications
                  </div>
                  <div className="flex justify-between mb-2">
                    <button
                      className="text-xs text-white hover:bg-white/10 transition font-medium px-2 py-1 rounded"
                      onClick={handleMarkAllAsRead}
                    >
                      Mark All as Read
                    </button>
                    <button
                      className="text-xs text-white hover:bg-white/10 transition font-medium px-2 py-1 rounded"
                      onClick={handleDismissAll}
                    >
                      Dismiss All
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notificationError ? (
                    <div className="px-4 py-2 text-red-200 text-center">
                      {notificationError}
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-2 text-white/80 text-center">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-2 border-b border-[var(--color-border)] flex justify-between items-center ${
                          notification.is_read ? "bg-white/5" : "bg-white/10"
                        }`}
                      >
                        <div className="text-sm text-white">
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-xs text-white/60">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!notification.is_read && (
                            <button
                              className="text-xs text-white hover:bg-white/20 transition px-2 py-1 rounded"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Mark as Read
                            </button>
                          )}
                          <button
                            className="text-xs text-red-200 hover:bg-red-400/20 transition px-2 py-1 rounded"
                            onClick={() => handleDismiss(notification.id)}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))
                  )}
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
          <div className="flex items-center gap-3 h-6 ml-6">
            <img
              src={PetWellLogo}
              alt="PetWell Logo"
              className="object-contain h-full w-auto"
            />
          </div>
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
          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationDropdownRef}>
              <button
                onClick={handleNotificationDropdownToggle}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-card-button)] bg-transparent relative"
              >
                <Bell size={22} stroke="var(--color-card-button)" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isNotificationDropdownOpen && (
                <div
                  className="absolute right-0 top-full w-80 rounded-2xl shadow-2xl border z-50 animate-fadeIn"
                  style={{
                    background: "var(--color-card-profile)",
                    minWidth: 320,
                    marginTop: 12,
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div
                    className="px-4 pt-4 pb-2 border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div className="text-base font-bold text-white mb-2 tracking-wide font-[Cabin,sans-serif]">
                      Notifications
                    </div>
                    <div className="flex justify-between mb-2">
                      <button
                        className="text-xs text-white hover:bg-white/10 transition font-medium px-2 py-1 rounded"
                        onClick={handleMarkAllAsRead}
                      >
                        Mark All as Read
                      </button>
                      <button
                        className="text-xs text-white hover:bg-white/10 transition font-medium px-2 py-1 rounded"
                        onClick={handleDismissAll}
                      >
                        Dismiss All
                      </button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notificationError ? (
                      <div className="px-4 py-2 text-red-200 text-center">
                        {notificationError}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-4 py-2 text-white/80 text-center">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-2 border-b border-[var(--color-border)] flex justify-between items-center ${
                            notification.is_read ? "bg-white/5" : "bg-white/10"
                          }`}
                        >
                          <div className="text-sm text-white">
                            <p className="font-medium">
                              {notification.message}
                            </p>
                            <p className="text-xs text-white/60">
                              {new Date(
                                notification.created_at
                              ).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!notification.is_read && (
                              <button
                                className="text-xs text-white hover:bg-white/20 transition px-2 py-1 rounded"
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                              >
                                Mark as Read
                              </button>
                            )}
                            <button
                              className="text-xs text-red-200 hover:bg-red-400/20 transition px-2 py-1 rounded"
                              onClick={() => handleDismiss(notification.id)}
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="relative mr-3" ref={dropdownRef}>
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
              {isDropdownOpen && (
                <div
                  className="absolute right-0 top-full w-80 rounded-2xl shadow-2xl border z-50 animate-fadeIn"
                  style={{
                    background: "var(--color-card-profile)",
                    minWidth: 320,
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
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="7"
                          height="7"
                          rx="1.5"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <rect
                          x="14"
                          y="3"
                          width="7"
                          height="7"
                          rx="1.5"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <rect
                          x="14"
                          y="14"
                          width="7"
                          height="7"
                          rx="1.5"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <rect
                          x="3"
                          y="14"
                          width="7"
                          height="7"
                          rx="1.5"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      View QR
                    </button>
                  </div>
                  <div className="flex flex-col py-2 font-[Cabin,sans-serif]">
                    <button
                      className="text-left px-5 py-3 text-base text-white hover:bg-white/10 transition font-medium border-b border-[var(--color-border)] cursor-pointer"
                      onClick={() => {
                        navigate(`/petowner/pet/${petId}/profile`);
                        setIsDropdownOpen(false);
                      }}
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
                          navigate(`/petowner/pet/${petId}/switch-profile`);
                          setIsDropdownOpen(false);
                        }
                      }}
                    >
                      Not {petName}? Switch Profile
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

      {showQRModal && (
        <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
          <DialogContent
            className="flex flex-col items-center bg-[var(--color-card-profile)] rounded-2xl border border-[var(--color-primary)] p-8 shadow-2xl max-w-xs w-full"
            style={{ zIndex: 9999 }}
          >
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
