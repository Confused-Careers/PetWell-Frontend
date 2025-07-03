import { X } from "lucide-react";
import React from "react";

interface TeamAddedModalProps {
  teamName: string;
  onClose: () => void;
  onGoHome: () => void;
  onAddMore: () => void;
}

const TeamAddedModal: React.FC<TeamAddedModalProps> = ({ teamName, onClose, onGoHome, onAddMore }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative border border-[var(--color-text)] bg-[var(--color-background)] rounded-2xl shadow-2xl px-6 sm:px-8 md:px-12 py-6 sm:py-8 md:py-10 flex flex-col items-center w-full max-w-sm sm:max-w-md md:max-w-lg">
        {/* Close button */}
        <button
          className="absolute right-4 top-4 text-[var(--color-text)] hover:text-[var(--color-primary)]"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-6 h-6 cursor-pointer" />
        </button>
        {/* Confetti/Party emoji */}
        <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🎉</div>
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-[Alike,serif] text-[var(--color-primary)] mb-3 sm:mb-4 text-center">Team added!</h2>
        {/* Subtext */}
        <p className="text-sm sm:text-base text-[var(--color-primary)] text-center mb-6 sm:mb-8 max-w-xs whitespace-nowrap"><span className="font-bold">{teamName}</span> has been added to your team!</p>
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
          <button onClick={onGoHome} className="flex-1 cursor-pointer border border-[var(--color-card-button)] text-[var(--color-primary)] bg-transparent hover:opacity-90 hover:text-[var(--color-primary)] px-0 py-2 rounded-3xl font-semibold transition text-base">Go To Home</button>
          <button onClick={onAddMore} className="flex-1 cursor-pointer text-[var(--color-text)] bg-[var(--color-card-button)]  px-0 py-2 rounded-3xl font-semibold transition text-base">Add More Teams</button>
        </div>
      </div>
    </div>
  );
};

export default TeamAddedModal;
