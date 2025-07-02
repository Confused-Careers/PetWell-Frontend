import React from "react";

interface CareTeamMemberFormProps {
  compact?: boolean;
}

const CareTeamMemberForm: React.FC<CareTeamMemberFormProps> = ({ compact }) => {
  const gapClass = compact ? "gap-2" : "gap-5";
  const suggestionClass = compact ? "mt-0.5" : "mt-1";
  const buttonClass = compact ? "py-1.5" : "py-2";
  return (
    <form className={`w-full flex flex-col ${gapClass}`}>
      <div>
        <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
          Name of care provider
        </label>
        <input
          type="text"
          defaultValue="Dr. Hemant Patel"
          className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
        />
      </div>
      <div>
        <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
          What is their role?
        </label>
        <select className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]">
          <option value="vet">Vet</option>
          <option value="nurse">Nurse</option>
          <option value="assistant">Assistant</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
          Permissions
        </label>
        <select className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]">
          <option value="full">Full Access</option>
          <option value="view">View Records</option>
          <option value="edit">Edit Records</option>
          <option value="manage">Manage Team</option>
        </select>
      </div>
      <div>
        <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
          Set user name
        </label>
        <input
          type="text"
          placeholder="Type here"
          className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
        />
        <div
          className={`${suggestionClass} text-xs text-[var(--color-text)] opacity-70 flex items-center gap-2 flex-wrap`}
        >
          <span className="mr-2">Suggested:</span>
          <span className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-full px-2 py-0.5 text-xs">
            hemant007
          </span>
          <span className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-full px-2 py-0.5 text-xs">
            hemantpatel45
          </span>
          <span className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-full px-2 py-0.5 text-xs">
            phemant567
          </span>
        </div>
      </div>
      <div>
        <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
          Set password
        </label>
        <input
          type="password"
          placeholder="Type here"
          className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
        />
        <div
          className={`${suggestionClass} text-xs text-[var(--color-text)] opacity-70 flex items-center gap-2 flex-wrap`}
        >
          <span className="mr-2">Suggested:</span>
          <span className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-full px-2 py-0.5 text-xs">
            XflP0nozy4RPiyu
          </span>
        </div>
      </div>
      <div className={`flex gap-4 mt-2 w-full`}>
        <button
          type="button"
          className={`flex-1 border border-[var(--color-card-button)] text-[var(--color-card-button)] rounded-full ${buttonClass} font-semibold hover:bg-[var(--color-card-button)] hover:text-[var(--color-background)] transition bg-transparent`}
        >
          Skip For Now
        </button>
        <button
          type="submit"
          className={`flex-1 bg-[var(--color-card-button)] text-[var(--color-text)] font-semibold rounded-full ${buttonClass} hover:bg-[var(--color-background)] hover:text-[var(--color-card-button)] border hover:border-[var(--color-card-button)] transition`}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default CareTeamMemberForm;
