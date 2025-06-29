import React from 'react';
import PetWellLogo from '../../Assets/PetWell.png';

const navLinks = [
  { name: 'Home', path: '/business/home' },
  { name: 'Pet Records', path: '/business/pet-records' },
  { name: 'Team Management', path: '/business/team-management' },
];

const BusinessNavbar: React.FC = () => {
  // For demo, hardcode the business name and avatar
  const businessName = 'Vet Office of New York';
  const businessAvatar = 'https://randomuser.me/api/portraits/men/32.jpg';

  return (
    <nav className="w-full bg-[var(--color-background,#181F29)] px-8 py-3 flex items-center justify-between z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={PetWellLogo} alt="PetWell Logo" className="h-10 w-10 object-contain" />
      </div>
      {/* Centered Nav Links */}
      <div className="flex-1 flex justify-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.path}
            className="text-[var(--color-text,#ebd5bd)] font-cabin text-lg px-2 py-1 rounded hover:text-[var(--color-primary,#FDBA3B)] transition-colors"
          >
            {link.name}
          </a>
        ))}
      </div>
      {/* Business Profile */}
      <div className="flex items-center gap-3">
        <span className="text-[var(--color-text,#ebd5bd)] font-cabin text-base font-medium text-right mr-2">{businessName}</span>
        <img src={businessAvatar} alt="Business Avatar" className="h-10 w-10 rounded-full object-cover border-2 border-[var(--color-primary,#FDBA3B)]" />
      </div>
    </nav>
  );
};

export default BusinessNavbar; 