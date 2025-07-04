import React, { useState, useEffect } from "react";
import PetWellLogo from "../../../Assets/PetWell.png";
import { useNavigate } from "react-router-dom";
import CareTeamMemberForm from "../../../Components/BusinessComponents/CareTeamMemberForm";
import CareTeamMemberCard from "./CareTeamMemberCard";
import staffServices from "../../../Services/staffservice";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

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
        const response: any = await staffServices.getStaffList(1, 10);
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
      const mappedStaff = response.data.map((staff: any) => ({
        id: staff.id,
        username: staff.username,
        staff_name: staff.staff_name,
        email: staff.email,
        role_name: staff.role,
        access_level: staff.permissions,
      }));
      setStaffList(mappedStaff);
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
    toast('Are you sure you want to delete this staff member?', {
      cancel: {
        label: 'Cancel',
        onClick: () => { },
      },
      action: {
        label: 'Yes Delete',
        onClick: async () => {
          try {
            await staffServices.removeStaff(staffId);
            setStaffList(staffList.filter((staff) => staff.id !== staffId));
          } catch (err: any) {
            setError(err.message || "Failed to delete staff member");
          }
        },
      },
    });
  };

  // Handle share (placeholder)
  const handleShare = (staff: Staff) => {
    toast.message(`Share username: ${staff.username} (Password sharing not implemented)`);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--color-background)] w-full px-2 pt-24 sm:p-4 md:p-8">
      <div className="flex justify-center sm:justify-start h-8 mb-8 md:mb-0">
        <img
          src={PetWellLogo}
          alt="PetWell Logo"
          className="object-contain h-full w-auto"
        />
      </div>
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <p className=" font-[Alike,serif] text-3xl text-[#1C232E] sm:mb-2 mb-2 text-center leading-tight">
          Add your care team
        </p>
        <p className="mb-3 text-lg font-[Cabin] items-center flex justify-center text-center px-2">
          Let your staff log in, upload records, and support pet parents directly.
        </p>

        {/* Staff List */}
        {staffList?.length !== 0 && !isLoading && (
          <div className="w-full max-w-sm mb-4">
            <h2 className="text-[28px] font-[400] text-[#1C232E] mb-2 text-center">
              Your team
            </h2>
            {isLoading && <p>Loading staff list...</p>}
            {error && (
              <div className="w-full max-w-md my-2 text-center text-[var(--color-warning)] bg-[var(--color-warning)]/10 rounded py-2 px-3 text-sm animate-fade-in">
                {error}
              </div>
            )}
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
        <div className="w-full  flex justify-center center">
          {showForm || editingStaff ? (
            <>
              <CareTeamMemberForm
                staff={editingStaff ? editingStaff : undefined}
                onSuccess={handleSuccess}
                onCancel={editingStaff ? () => { setEditingStaff(null); setShowForm(false); } : undefined}
              />
            </>
          ) : (
            <div className="w-full max-w-sm mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
              <button
                type="button"
                onClick={() => { setShowForm(true); setEditingStaff(null); }}


                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border-2 border-[#FFB23E]"
              >
                <span className="text-xl font-bold"><PlusIcon className="size-4" /></span> Add Member
              </button>
              <button
                type="button"
                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"

                onClick={() => navigate("/business-home")}
              >
                <span className="text-xl font-[400]">Next</span>

              </button>
            </div>

          )}
        </div>
      </div>
    </div>
  );
};

export default AddCareTeamPage;