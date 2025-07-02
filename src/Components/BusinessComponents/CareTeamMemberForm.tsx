import React, { useState, useEffect } from "react";
import staffServices from "../../Services/staffservice";

interface Staff {
  id: string;
  username: string;
  staff_name: string;
  email: string;
  role_name: string;
  access_level: string;
}

interface CareTeamMemberFormProps {
  compact?: boolean;
  staff?: Staff; // Optional staff data for editing
  onSuccess?: () => void; // Callback for successful submission
  onCancel?: () => void; // Callback for canceling edit
}

const CareTeamMemberForm: React.FC<CareTeamMemberFormProps> = ({
  compact,
  staff,
  onSuccess,
  onCancel,
}) => {
  const gapClass = compact ? "gap-2" : "gap-3";
  const suggestionClass = compact ? "mt-0.5" : "mt-1";
  const buttonClass = compact ? "py-1.5" : "py-2";

  // Form state
  const [formData, setFormData] = useState({
    staff_name: "",
    email: "",
    role_name: "",
    access_level: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill form when editing staff
  useEffect(() => {
    if (staff) {
      setFormData({
        staff_name: staff.staff_name,
        email: staff.email,
        role_name: staff.role_name.toLowerCase(),
        access_level:
          staff.access_level === "Full" ? "full" :
          staff.access_level === "View Records" ? "view" :
          staff.access_level === "Edit Records" ? "edit" :
          "manage",
        username: staff.username,
        password: "", // Don't prefill password for security
      });
    }
  }, [staff]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Map form values to match API expectations
      const payload: any = {
        staff_name: formData.staff_name,
        email: formData.email,
        role_name: formData.role_name.charAt(0).toUpperCase() + formData.role_name.slice(1),
        access_level:
          formData.access_level === "full" ? "Full" :
          formData.access_level === "view" ? "View Records" :
          formData.access_level === "edit" ? "Edit Records" :
          "Manage Team",
        username: formData.username,
      };
      if (formData.password && formData.password.length > 0) {
        payload.password = formData.password;
      }

      if (staff) {
        // Update existing staff
        await staffServices.updateStaff(staff.id, {
          staff_name: payload.staff_name,
          email: payload.email,
          role_name: payload.role_name,
        });
      } else {
        // Add new staff
        await staffServices.addStaff(payload);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || `Failed to ${staff ? "update" : "add"} staff member`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={`w-full flex flex-col ${gapClass}`} onSubmit={handleSubmit}>
      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}
      <div>
        <label className="block text-[#1C232E] text-sm mb-1 font-medium">
          Name of care provider
        </label>
        <input
          type="text"
          name="staff_name"
          title="Name of care provider"
          value={formData.staff_name}
          onChange={handleInputChange}
          className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[#1C232E] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
          required
        />
      </div>
      <div>
        <label className="block text-[#1C232E] text-sm mb-1 font-medium">
          Email
        </label>
        <input
          type="email"
          name="email"
          title="Email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Type here"
          className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[#1C232E] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
          required
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-[#1C232E] text-sm mb-1 font-medium">
          What is their role?
        </label>
        <select
          id="role"
          name="role_name"
          value={formData.role_name}
          onChange={handleInputChange}
          className="w-full border border-black rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[#1C232E] focus:outline-none focus:border-[var(--color-primary)]"
          required
        >
          <option value="">Select a role</option>
          <option value="vet">Vet</option>
          <option value="nurse">Nurse</option>
          <option value="assistant">Assistant</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label className="block text-[#1C232E] text-sm mb-1 font-medium">
          Permissions
        </label>
        <select
          name="access_level"
          title="Permissions"
          value={formData.access_level}
          onChange={handleInputChange}
          className="w-full border border-black rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[#1C232E] focus:outline-none focus:border-[var(--color-primary)]"
          required
        >
          <option value="">Select permissions</option>
          <option value="full">Full Access</option>
          <option value="view">View Records</option>
          <option value="edit">Edit Records</option>
          <option value="manage">Manage Team</option>
        </select>
      </div>
      <div>
        <label className="block text-[#1C232E] text-sm mb-1 font-medium">
          Set user name
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Type here"
          className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[#1C232E] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
          required
        />
        <div
          className={`${suggestionClass} text-xs text-[#1C232E] opacity-70 flex items-center gap-2 flex-wrap`}
        ></div>
      </div>
      {!staff && (
        <div>
          <label className="block text-[#1C232E] text-sm mb-1 font-medium">
            Set password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Type here"
            className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[#1C232E] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
            required
          />
          <div
            className={`${suggestionClass} text-xs text-[#1C232E] opacity-70 flex items-center gap-2 flex-wrap`}
          ></div>
        </div>
      )}
      <div className={`flex gap-4 mt-2 w-full`}>
        {staff && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`flex-1 border border-[var(--color-card-button)] text-[var(--color-card-button)] rounded-full ${buttonClass} font-semibold hover:bg-[var(--color-card-button)] hover:text-[var(--color-background)] transition bg-transparent`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          className={`flex-1 border border-[var(--color-card-button)] text-[var(--color-card-button)] rounded-full ${buttonClass} font-semibold hover:bg-[var(--color-card-button)] hover:text-[var(--color-background)] transition bg-transparent`}
          disabled={isSubmitting}
        >
          Skip For Now
        </button>
        <button
          type="submit"
          className={`flex-1 bg-[var(--color-card-button)] text-[#1C232E] font-semibold rounded-full ${buttonClass} hover:bg-[var(--color-background)] hover:text-[var(--color-card-button)] border hover:border-[var(--color-card-button)] transition`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : staff ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default CareTeamMemberForm;