import { X, Plus, PencilLine, ChevronDown, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import BusinessNavbar from "../../../Components/BusinessComponents/BusinessNavbar";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import staffServices from "../../../Services/staffservice";
import businessServices from "../../../Services/businessServices";
import PetBusinessAvatar from "../../../Assets/PetBusinessAvatar.svg";

const StaffPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({
    staff_name: "",
    role_name: "Vet",
    access_level: "Full",
    username: "",
    email: "",
    password: "",
  });
  const [editMember, setEditMember] = useState({
    id: "",
    staff_name: "",
    role_name: "Vet",
    access_level: "Full",
    email: "",
  });
  const [showFilter, setShowFilter] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [permissionsFilter, setPermissionsFilter] = useState<string | null>(
    null
  );
  const [staffMembers, setStaffMembers] = useState<
    {
      id: string;
      username: string;
      staff_name: string;
      email: string;
      role_name: string;
      access_level: string;
    }[]
  >([]);
  const [business, setBusiness] = useState({
    business_name: "Vet Office of New York",
    email: "info@vetoffice.com",
    phone: "(555) 555-5555",
    website: "www.vetoffice.com",
    address: "78 Hudson St, New York",
    description:
      "The Vet Office of New York is a premier veterinary clinic dedicated to providing exceptional care for pets in the heart of the city. Our experienced team of veterinarians and staff are committed to ensuring the health and well-being of your furry companions.",
    socials: {
      x: "https://x.com",
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },
    profile_picture: PetBusinessAvatar,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roleOptions = ["Vet", "Assistant", "Manager", "Receptionist"];
  const permissionsOptions = ["Full", "Editor", "View"];

  // Fetch business profile and staff list
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch business profile
        const businessResponse = await businessServices.getProfile();
        setBusiness({
          business_name:
            businessResponse?.business_name || "Vet Office of New York",
          email: businessResponse?.email || "info@vetoffice.com",
          phone: businessResponse?.phone || "(555) 555-5555",
          website: businessResponse?.website || "www.vetoffice.com",
          address: businessResponse?.address || "78 Hudson St, New York",
          description:
            businessResponse?.description ||
            "The Vet Office of New York is a premier veterinary clinic...",
          socials: businessResponse?.socials || {
            x: "https://x.com",
            instagram: "https://instagram.com",
            facebook: "https://facebook.com",
          },
          profile_picture:
            businessResponse.profilePictureDocument?.document_url ||
            PetBusinessAvatar,
        });

        // Fetch staff list with filters
        const response = await staffServices.getStaffList(1, 10, {
          role: roleFilter ?? undefined,
          access_level: permissionsFilter ?? undefined,
        });
        console.log("Fetched staff list:", response.data);
        setStaffMembers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [roleFilter, permissionsFilter]);

  const handleAddMember = async () => {
    if (
      newMember.staff_name &&
      newMember.username &&
      newMember.email &&
      newMember.password
    ) {
      try {
        await staffServices.addStaff({
          ...newMember,
          role_name: newMember.role_name,
        });
        const response = await staffServices.getStaffList(1, 10, {
          role: roleFilter ?? undefined,
          access_level: permissionsFilter ?? undefined,
        });
        setStaffMembers(response.data);
        setNewMember({
          staff_name: "",
          role_name: "Veterinarian",
          access_level: "Full Access",
          username: "",
          email: "",
          password: "",
        });
        setShowAddModal(false);
      } catch (error) {
        console.error("Error adding staff:", error);
      }
    }
  };

  const handleEditMember = async () => {
    if (editMember.staff_name && editMember.email) {
      try {
        // in this edit member don't in object don't habe username or password
        const editMemberData = {
          staff_name: editMember.staff_name,
          role_name: editMember.role_name,
          access_level: editMember.access_level,
          email: editMember.email,
        };
        await staffServices.updateStaff(editMember.id, editMemberData);
        const response = await staffServices.getStaffList(1, 10, {
          role: roleFilter ?? undefined,
          access_level: permissionsFilter ?? undefined,
        });
        setStaffMembers(response.data);
        setShowEditModal(null);
      } catch (error) {
        console.error("Error updating staff:", error);
      }
    }
  };

  const handleDeleteMember = async (staffId: string) => {
    try {
      await staffServices.removeStaff(staffId);
      const response = await staffServices.getStaffList(1, 10, {
        role: roleFilter ?? undefined,
        access_level: permissionsFilter ?? undefined,
      });
      setStaffMembers(response.data);
      setShowDeleteModal(null);
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const handleOpenEditModal = (member: (typeof staffMembers)[0]) => {
    setEditMember({
      id: member.id,
      staff_name: member.staff_name,
      role_name: member.role_name,
      access_level: member.access_level,
      email: member.email,
    });
    setShowEditModal(member.id);
  };

  const filteredStaff = staffMembers?.filter((member) => {
    const matchesSearch =
      member.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleResetFilters = () => {
    setRoleFilter(null);
    setPermissionsFilter(null);
  };

  return (
    <div className="min-h-screen bg-[#FFF8E5]">
      <BusinessNavbar />
      <div className="w-full px-2 sm:px-4 md:px-8 max-w-7xl mx-auto">
        {/* Business Section */}
        <p className="text-2xl font-lighter flex items-center gap-3 font-serif mt-6 mb-4">
          Your Business
        </p>
        <div className="bg-[#6A8293] rounded-2xl border px-4 sm:px-8 py-6 flex flex-col md:flex-row items-start gap-6 md:gap-8 mt-2 mb-6">
          <img
            src={business.profile_picture}
            alt="Business profile"
            className="object-cover rounded-lg w-[75%] max-w-xs md:max-w-[300px] mb-4 md:mb-0 aspect-square"
            style={{ maxHeight: "400px" }}
          />
          <div className="flex-1">
            <div className="flex flex-row items-center gap-2 mb-4">
              <p className="text-2xl font-medium text-[var(--color-background)]">
                {business.business_name}
              </p>
              <PencilLine
                className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer text-[var(--color-background)] ml-2 flex-shrink-0"
                onClick={() => navigate("/business/profile")}
              />
            </div>
            <div className="flex flex-col gap-2 text-base">
              <div className="flex flex-col md:flex-row md:flex-nowrap md:items-center md:gap-x-12 gap-y-2 md:gap-y-0 w-full overflow-x-auto">
                <div className=" md:min-w-[150px]">
                  <p className="text-[var(--color-background)]/70 text-sm">
                    Phone
                  </p>
                  <p className="text-[var(--color-background)] font-medium md:whitespace-nowrap">
                    {business.phone}
                  </p>
                </div>
                <div className=" md:min-w-[200px]">
                  <p className="text-[var(--color-background)]/70 text-sm">
                    Email
                  </p>
                  <p className="text-[var(--color-background)] font-medium md:whitespace-nowrap">
                    {business.email}
                  </p>
                </div>
                <div className="flex flex-row items-center gap-2  md:min-w-[200px]">
                  <div>
                    <p className="text-[var(--color-background)]/70 text-sm">
                      Website
                    </p>
                    <p className="text-[var(--color-background)] font-medium md:whitespace-nowrap">
                      {business.website}
                    </p>
                  </div>
                  <div className="flex flex-row gap-2 ml-2">
                    {business.socials?.x && (
                      <a
                        href={business.socials.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                          fill="none"
                          className="w-5 h-5 sm:w-6 sm:h-6"
                        >
                          <g clip-path="url(#clip0_1021_9360)">
                            <rect width="48" height="48" rx="8" fill="white" />
                            <path
                              d="M25.6049 23.1804L36.4067 38.6308H31.9736L23.1592 26.0233V26.0225L21.8651 24.1717L11.5684 9.44312H16.0014L24.3109 21.3297L25.6049 23.1804Z"
                              fill="black"
                            />
                            <path
                              d="M42.8135 0H5.1865C2.32215 0 0 2.32215 0 5.1865V42.8135C0 45.6779 2.32215 48 5.1865 48H42.8135C45.6779 48 48 45.6779 48 42.8135V5.1865C48 2.32215 45.6779 0 42.8135 0ZM30.6159 40.7049L21.6962 27.7234L10.5287 40.7049H7.64245L20.4147 25.859L7.64245 7.27042H17.3841L25.8304 19.563L36.4053 7.27042H39.2915L27.1124 21.4279H27.1116L40.3576 40.7049H30.6159Z"
                              fill="black"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1021_9360">
                              <rect
                                width="48"
                                height="48"
                                rx="8"
                                fill="white"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </a>
                    )}
                    {business.socials?.instagram && (
                      <a
                        href={business.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                          fill="none"
                          className="w-5 h-5 sm:w-6 sm:h-6"
                        >
                          <g clip-path="url(#clip0_1021_9368)">
                            <path
                              d="M2.99942 3.26609C-0.772578 7.18409 -0.000578046 11.3461 -0.000578046 23.9901C-0.000578046 34.4901 -1.83258 45.0161 7.75542 47.4941C10.7494 48.2641 37.2774 48.2641 40.2674 47.4901C44.2594 46.4601 47.5074 43.2221 47.9514 37.5761C48.0134 36.7881 48.0134 11.2061 47.9494 10.4021C47.4774 4.38809 43.7754 0.922093 38.8974 0.220093C37.7794 0.0580928 37.5554 0.0100928 31.8194 9.27895e-05C11.4734 0.0100928 7.01342 -0.895907 2.99942 3.26609Z"
                              fill="url(#paint0_linear_1021_9368)"
                            />
                            <path
                              d="M23.9956 6.27809C16.7336 6.27809 9.83763 5.63209 7.20363 12.3921C6.11563 15.1841 6.27363 18.8101 6.27363 24.0021C6.27363 28.5581 6.12763 32.8401 7.20363 35.6101C9.83163 42.3741 16.7836 41.7261 23.9916 41.7261C30.9456 41.7261 38.1156 42.4501 40.7816 35.6101C41.8716 32.7901 41.7116 29.2181 41.7116 24.0021C41.7116 17.0781 42.0936 12.6081 38.7356 9.25209C35.3356 5.85209 30.7376 6.27809 23.9876 6.27809H23.9956ZM22.4076 9.47209C37.5556 9.44809 39.4836 7.76409 38.4196 31.1581C38.0416 39.4321 31.7416 38.5241 23.9976 38.5241C9.87763 38.5241 9.47163 38.1201 9.47163 23.9941C9.47163 9.70409 10.5916 9.48009 22.4076 9.46809V9.47209ZM33.4556 12.4141C32.2816 12.4141 31.3296 13.3661 31.3296 14.5401C31.3296 15.7141 32.2816 16.6661 33.4556 16.6661C34.6296 16.6661 35.5816 15.7141 35.5816 14.5401C35.5816 13.3661 34.6296 12.4141 33.4556 12.4141ZM23.9956 14.9001C18.9696 14.9001 14.8956 18.9761 14.8956 24.0021C14.8956 29.0281 18.9696 33.1021 23.9956 33.1021C29.0216 33.1021 33.0936 29.0281 33.0936 24.0021C33.0936 18.9761 29.0216 14.9001 23.9956 14.9001ZM23.9956 18.0941C31.8056 18.0941 31.8156 29.9101 23.9956 29.9101C16.1876 29.9101 16.1756 18.0941 23.9956 18.0941Z"
                              fill="white"
                            />
                          </g>
                          <defs>
                            <linearGradient
                              id="paint0_linear_1021_9368"
                              x1="3.09146"
                              y1="44.9343"
                              x2="47.7024"
                              y2="6.32404"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stop-color="#FFDD55" />
                              <stop offset="0.5" stop-color="#FF543E" />
                              <stop offset="1" stop-color="#C837AB" />
                            </linearGradient>
                            <clipPath id="clip0_1021_9368">
                              <rect width="48" height="48" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </a>
                    )}
                    {business.socials?.facebook && (
                      <a
                        href={business.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                          fill="none"
                          className="w-5 h-5 sm:w-6 sm:h-6"
                        >
                          <g clip-path="url(#clip0_1021_9372)">
                            <rect
                              width="48"
                              height="48"
                              rx="9"
                              fill="#1877F2"
                            />
                            <path
                              d="M48 24C48 35.9794 39.2231 45.9084 27.75 47.7084V30.9375H33.3422L34.4062 24H27.75V19.4981C27.75 17.5997 28.68 15.75 31.6613 15.75H34.6875V9.84375C34.6875 9.84375 31.9406 9.375 29.3147 9.375C23.8331 9.375 20.25 12.6975 20.25 18.7125V24H14.1562V30.9375H20.25V47.7084C8.77688 45.9084 0 35.9794 0 24C0 10.7456 10.7456 0 24 0C37.2544 0 48 10.7456 48 24Z"
                              fill="#1877F2"
                            />
                            <path
                              d="M33.3422 30.9375L34.4062 24H27.75V19.498C27.75 17.6001 28.6798 15.75 31.6612 15.75H34.6875V9.84375C34.6875 9.84375 31.941 9.375 29.3152 9.375C23.833 9.375 20.25 12.6975 20.25 18.7125V24H14.1562V30.9375H20.25V47.7084C21.4719 47.9001 22.7242 48 24 48C25.2758 48 26.5281 47.9001 27.75 47.7084V30.9375H33.3422Z"
                              fill="white"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1021_9372">
                              <rect
                                width="48"
                                height="48"
                                rx="9"
                                fill="white"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[var(--color-background)]/70 text-sm">
                  Address
                </p>
                <p className="text-[var(--color-background)] font-medium break-all">
                  {business.address}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-[var(--color-background)]/70 text-sm mb-2">
                  Description
                </p>
                <p className="text-[var(--color-background)] text-sm leading-relaxed">
                  {business.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <p className="text-2xl font-lighter flex items-center gap-3 font-serif mb-4">
          Your Team
        </p>
        <div className="rounded-2xl overflow-visible mb-12 relative">
          {/* Controls Row */}
          <div className="flex flex-row flex-wrap items-stretch gap-2 sm:gap-4 justify-between mb-4 w-full">
            <div className="flex flex-row flex-wrap items-stretch gap-2 sm:gap-4">
              <button
                onClick={() => setShowFilter(true)}
                className="cursor-pointer flex items-center border border-[#1C232E] text-[#1C232E]/60 rounded-[60px] px-4 py-2 hover:bg-[#1C232E]/10 transition-colors w-auto flex-none justify-center"
              >
                <span className="mr-2">Filters</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="relative w-auto flex-none">
                <input
                  className="border border-[#1C232E] text-[#1C232E]/60 rounded-[60px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1C232E]/20 transition-colors w-auto flex-none"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1C232E]/60" />
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 cursor-pointer text-[var(--color-text)] bg-[var(--color-card-button)] hover:opacity-90 px-6 py-2 rounded-3xl font-semibold transition text-base w-auto flex-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>

          {/* Staff Table */}
          <div className="bg-[#EDCC79]/50 rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full min-w-[600px] text-xs sm:text-sm md:text-base">
              <thead>
                <tr>
                  <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-800 items-center text-center">
                    Staff Name
                  </th>
                  <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-800 items-center text-center">
                    Role
                  </th>
                  <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-800 items-center text-center">
                    Permissions
                  </th>
                  <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-800 items-center text-center">
                    Username
                  </th>
                  <th className="w-12 py-2 sm:py-4 px-2 sm:px-6"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-500 text-lg"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredStaff?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-500 text-lg"
                    >
                      No team found for your search
                    </td>
                  </tr>
                ) : (
                  filteredStaff?.map((member, index) => (
                    <tr
                      key={member.id}
                      className={`hover:bg-[#EDCC79] transition-colors cursor-pointer ${
                        index !== filteredStaff?.length - 1
                          ? "border-b border-[#EDCC79]/20"
                          : ""
                      }`}
                    >
                      <td className="py-4 px-6 text-gray-800 font-medium items-center text-center">
                        {member.staff_name}
                      </td>
                      <td className="py-4 px-6 text-gray-800 items-center text-center">
                        {member.role_name}
                      </td>
                      <td className="py-4 px-6 text-gray-800 items-center text-center">
                        {member.access_level}
                      </td>
                      <td className="py-4 px-6 text-gray-800 items-center text-center">
                        {member.username}
                      </td>
                      <td className="py-4 px-6 flex items-center space-x-4  text-center">
                        <PencilLine
                          className="w-5 h-5 text-gray-600 cursor-pointer"
                          onClick={() => handleOpenEditModal(member)}
                        />
                        <Trash2
                          className="w-5 h-5 text-red-600 cursor-pointer"
                          onClick={() => setShowDeleteModal(member.id)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-[#FFF8E5] rounded-lg p-6 w-full max-w-md mx-4 border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Team Member</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newMember.staff_name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, staff_name: e.target.value })
                  }
                  className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newMember.role_name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, role_name: e.target.value })
                  }
                  className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                >
                  {roleOptions?.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions
                </label>
                <select
                  value={newMember.access_level}
                  onChange={(e) =>
                    setNewMember({ ...newMember, access_level: e.target.value })
                  }
                  className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                >
                  {permissionsOptions?.map((perm) => (
                    <option key={perm} value={perm}>
                      {perm}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={newMember.username}
                  onChange={(e) =>
                    setNewMember({ ...newMember, username: e.target.value })
                  }
                  className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                  className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newMember.password}
                  onChange={(e) =>
                    setNewMember({ ...newMember, password: e.target.value })
                  }
                  className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div className="flex justify-center space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border-2 border-[#FFB23E]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Member Modal */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-[#FFF8E5] rounded-lg p-6 w-full max-w-md mx-4 border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Team Member</h3>
              <button
                onClick={() => setShowEditModal(null)}
                className="text-[#1C232E] hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editMember.staff_name}
                  onChange={(e) =>
                    setEditMember({ ...editMember, staff_name: e.target.value })
                  }
                  className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={editMember.role_name}
                  onChange={(e) =>
                    setEditMember({ ...editMember, role_name: e.target.value })
                  }
                  className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                >
                  {roleOptions?.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions
                </label>
                <select
                  value={editMember.access_level}
                  onChange={(e) =>
                    setEditMember({
                      ...editMember,
                      access_level: e.target.value,
                    })
                  }
                  className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                >
                  {permissionsOptions?.map((perm) => (
                    <option key={perm} value={perm}>
                      {perm}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C232E] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editMember.email}
                  onChange={(e) =>
                    setEditMember({ ...editMember, email: e.target.value })
                  }
                  className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(null)}
                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border-2 border-[#FFB23E]"
              >
                Cancel
              </button>
              <button
                onClick={handleEditMember}
                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-[#FFF8E5] rounded-lg p-6 w-full max-w-md mx-4 border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="text-[#1C232E] hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[#1C232E] mb-6">
              Are you sure you want to delete this staff member?
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border-2 border-[#FFB23E]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMember(showDeleteModal)}
                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Sidebar */}
      {showFilter && (
        <div className="fixed inset-0 flex justify-end z-50">
          <div className="w-full sm:w-[80%] md:w-[50%] lg:w-[35%] bg-[#3C2A17] h-full px-4 sm:px-8 md:px-14 py-3 overflow-y-auto text-white transition-all duration-300">
            <div className="flex justify-between items-center mb-6 space-y-4">
              <h2 className="text-xl font-[400] font-[alike] text-[#EBD5BD] pt-6">
                Filters
              </h2>
              <button
                onClick={() => setShowFilter(false)}
                className="cursor-pointer hover:text-gray-300 text-4xl text-[#EBD5BD]"
              >
                ×
              </button>
            </div>
            <div className="mb-6 font-[cabin]">
              <h3 className="text-sm font-[400] text-[#EBD5BD] mb-3">
                By Role
              </h3>
              <div className="space-y-4">
                {roleOptions?.map((role) => (
                  <label
                    key={role}
                    className="flex items-center cursor-pointer group"
                  >
                    <span className="relative w-5 h-5 mr-2 flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={roleFilter === role}
                        onChange={(e) =>
                          setRoleFilter(e.target.checked ? role : null)
                        }
                        className="appearance-none w-5 h-5 rounded-[4px] border border-[#FFB23E] bg-[#3C2A17] checked:bg-[#FFB23E] checked:border-[#FFB23E] focus:outline-none cursor-pointer"
                      />
                      {roleFilter === role && (
                        <span className="absolute text-white text-base pointer-events-none select-none">
                          ✓
                        </span>
                      )}
                    </span>
                    <span className="text-md text-[#EBD5BD]">{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-8 font-[cabin]">
              <h3 className="text-sm font-[400] text-[#EBD5BD] mb-3">
                By Permissions
              </h3>
              <div className="space-y-4">
                {permissionsOptions?.map((perm) => (
                  <label
                    key={perm}
                    className="flex items-center cursor-pointer group"
                  >
                    <span className="relative w-5 h-5 mr-2 flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={permissionsFilter === perm}
                        onChange={(e) =>
                          setPermissionsFilter(e.target.checked ? perm : null)
                        }
                        className="appearance-none w-5 h-5 rounded-[4px] border border-[#FFB23E] bg-[#3C2A17] checked:bg-[#FFB23E] checked:border-[#FFB23E] focus:outline-none cursor-pointer"
                      />
                      {permissionsFilter === perm && (
                        <span className="absolute text-white text-base pointer-events-none select-none">
                          ✓
                        </span>
                      )}
                    </span>
                    <span className="text-md text-[#EBD5BD]">{perm}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 cursor-pointer border border-[var(--color-card-button)] text-[var(--color-card-button)] bg-transparent hover:opacity-90 hover:text-[var(--color-card-button)] px-0 py-2 rounded-3xl font-semibold transition text-base"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="flex-1 cursor-pointer text-[var(--color-text)] bg-[var(--color-card-button)] hover:opacity-90 px-0 py-2 rounded-3xl font-semibold transition text-base"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;
