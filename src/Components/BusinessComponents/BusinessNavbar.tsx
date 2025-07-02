import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PetWellLogo from "../../Assets/PetWell.png";
import businessServices from "../../Services/businessServices";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const BusinessNavbar: React.FC = () => {
  const [business, setBusiness] = useState<{ name: string; avatar: string }>({
    name: "Loading...",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/business-home" },
    { name: "Pet Records", path: "/business/pet-records" },
    { name: "Team Management", path: "/business/team-management" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await businessServices.getProfile();
        setBusiness({
          name: response?.business_name || "Vet Office",
          avatar: response?.profile_picture || "https://randomuser.me/api/portraits/men/32.jpg",
        });
      } catch (error: any) {
        toast.error(error.message || "Failed to load business profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <nav
      className="w-full bg-[var(--color-white)] rounded-full border border-[var(--color-business-card-shadow)] shadow-sm px-4 sm:px-8 py-2 flex items-center justify-between mt-4 mb-8 mx-auto max-w-6xl sticky top-2 z-50"
      style={{ boxShadow: "0 2px 12px 0 var(--color-business-card-shadow)" }}
    >
      <div className="flex items-center gap-3">
        <img src={PetWellLogo} alt="PetWell Logo" className="h-8 w-[120px] object-contain" />
      </div>
      <div className="flex-1 flex justify-center gap-2 sm:gap-6">
        {navLinks.map((link, idx) => (
          <Link
            key={link.name}
            to={link.path}
            className={`font-cabin text-base sm:text-lg px-4 py-1.5 rounded-full transition-colors ${
              idx === 0
                ? "bg-[#FFB23E] text-[#000000] font-bold"
                : "text-gray-400 hover:bg-[var(--color-business-accent)] hover:text-[var(--color-white)]"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <img
          src={business.avatar}
          alt="Business Avatar"
          className="h-9 w-9 rounded-full object-cover border-2 border-[var(--color-business-accent)]"
          onClick={() => navigate('/business/profile')}
        />
        <span className="text-[var(--color-business-heading)] font-cabin text-base font-medium text-right mr-2">
          {loading ? "Loading..." : business.name}
        </span>
      </div>
    </nav>
  );
};

export default BusinessNavbar;