import React, { useState, useEffect } from "react";
import Logo from "../../../Assets/PetWell.png";
import { useNavigate } from "react-router-dom";
import CareTeamMemberForm from "../../../Components/BusinessComponents/CareTeamMemberForm";
import CareTeamMemberCard from "./CareTeamMemberCard";
import staffServices from "../../../Services/staffservice";

interface Staff {
  id: string;
  username: string;
  staff_name: string;
  email: string;
  role_name: string;
  access_level: string;
}

const AddCareTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [showForm, setShowForm] = useState(false); // <-- add state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch staff list on mount
  useEffect(() => {
    const fetchStaffList = async () => {
      setIsLoading(true);
      try {
        const response = await staffServices.getStaffList(1, 10);
        setStaffList(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch staff list");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStaffList();
  }, []);

  // Handle successful form submission
  const handleSuccess = () => {
    staffServices.getStaffList(1, 10).then((response) => {
      setStaffList(response.staff);
      setEditingStaff(null);
      setShowForm(false); // close form after success
    }).catch((err) => {
      setError(err.message || "Failed to refresh staff list");
    });
  };

  // Handle edit staff
  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setShowForm(true); // open form for editing
  };

  // Handle delete staff
  const handleDelete = async (staffId: string) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await staffServices.removeStaff(staffId);
        setStaffList(staffList.filter((staff) => staff.id !== staffId));
      } catch (err: any) {
        setError(err.message || "Failed to delete staff member");
      }
    }
  };

  // Handle share (placeholder)
  const handleShare = (staff: Staff) => {
    alert(`Share username: ${staff.username} (Password sharing not implemented)`);
  };

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-[var(--color-background)] flex flex-col items-center px-2 py-2 relative">
      <div className="absolute left-4 top-4 sm:left-8 sm:top-6">
        <img
          src={Logo}
          alt="PetWell Logo"
          className="h-6 sm:h-8 md:h-12 w-auto max-w-[140px] object-contain transition-all mb-2 sm:mb-0"
        />
      </div>
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-xl sm:text-[48px]  font-serif font-[400] text-[#1C232E] text-center mb-1 mt-6 break-words">
          Add your care team
        </h1>
        <p className="text-md sm:text-[24px] text-[#1C232E] font-[400] opacity-80 text-center mb-4">
          Let your staff log in, upload records, and support pet parents directly.
        </p>

        {/* Staff List */}
        {staffList?.length !== 0 && !isLoading && (
        <div className="w-full max-w-[620px] mb-6">
          <h2 className="text-[28px] font-[400] text-[#1C232E] mb-2 text-center">
            Your team
          </h2>
          {isLoading && <p>Loading staff list...</p>}
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {staffList?.length === 0 && !isLoading && (
            <p className="text-[#1C232E] opacity-70">
              No staff members found.
            </p>
          )}
          <div className="flex flex-col gap-4">
            {staffList?.map((staff) => (
              <CareTeamMemberCard
                key={staff.id}
                name={staff.staff_name}
                role={staff.role_name}
                access={staff.access_level}
                onEdit={() => handleEdit(staff)}
                onDelete={() => handleDelete(staff.id)}
                onShare={() => handleShare(staff)}
              />
            ))}
          </div>
        </div>

        )}

        {/* Form Section with open/close logic */}
        <div className="w-full max-w-[620px]">
          {showForm || editingStaff ? (
            <>
              <CareTeamMemberForm
                staff={editingStaff}
                onSuccess={handleSuccess}
                onCancel={editingStaff ? () => { setEditingStaff(null); setShowForm(false); } : undefined}
              />
            </>
          ) : (
            <div className="flex flex-row gap-4">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-[var(--color-card-button)] text-[var(--color-card-button)] rounded-full py-2 font-[400] hover:bg-[var(--color-card-button)] hover:text-[var(--color-background)] transition bg-transparent"
                onClick={() => { setShowForm(true); setEditingStaff(null); } }
              >
                <span className="text-xl font-bold">+</span> Add New Staff
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-[var(--color-card-button)] text-[#1C232E] rounded-full py-2 font-[400] hover:bg-transparent hover:text-[#FFB23E] transition bg-[#FFB23E]"
                onClick={() => navigate("/business-home")}
              >
                  <span className="text-xl font-[400]">Next</span>
                </button></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCareTeamPage;