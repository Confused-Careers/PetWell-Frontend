import React from "react";
import { useParams, Link } from "react-router-dom";
import PetWellLogo from "../../Assets/PetWell.png";

const BusinessNavbar: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();

  // Use businessId in nav links
  const navLinks = [
    { name: "Home", path: `/business/${businessId}/home` },
    { name: "Pet Records", path: `/business/${businessId}/pet-records` },
    {
      name: "Team Management",
      path: `/business/${businessId}/team-management`,
    },
  ];

  // For demo, hardcode the business name and avatar
  const businessName = "Vet Office of New York";
  const businessAvatar = "https://randomuser.me/api/portraits/men/32.jpg";

  return (
    <nav
      className="w-full bg-[var(--color-white)] rounded-full border border-[var(--color-business-card-shadow)] shadow-sm px-4 sm:px-8 py-2 flex items-center justify-between mt-4 mb-8 mx-auto max-w-6xl sticky top-2 z-50"
      style={{ boxShadow: "0 2px 12px 0 var(--color-business-card-shadow)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src={PetWellLogo}
          alt="PetWell Logo"
          className="h-8 w-8 object-contain"
        />
      </div>
      {/* Centered Nav Links */}
      <div className="flex-1 flex justify-center gap-2 sm:gap-6">
        {navLinks.map((link, idx) => (
          <Link
            key={link.name}
            to={link.path}
            className={`font-cabin text-base sm:text-lg px-4 py-1.5 rounded-full transition-colors ${
              idx === 0
                ? "bg-[var(--color-business-accent)] text-[var(--color-white)] font-bold"
                : "text-[var(--color-business-heading)] hover:bg-[var(--color-business-accent)] hover:text-[var(--color-white)]"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
      {/* Business Profile */}
      <div className="flex items-center gap-3">
        <span className="text-[var(--color-business-heading)] font-cabin text-base font-medium text-right mr-2">
          {businessName}
        </span>
        <img
          src={businessAvatar}
          alt="Business Avatar"
          className="h-9 w-9 rounded-full object-cover border-2 border-[var(--color-business-accent)]"
        />
      </div>
    </nav>
  );
};

export default BusinessNavbar;
