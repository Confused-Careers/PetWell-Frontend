import { useState, useEffect } from "react";
import businessServices from "../../Services/businessServices";
import { toast } from "sonner";
import { PencilLine, X } from "lucide-react";

const BusinessProfile = () => {
  const [formData, setFormData] = useState<{
    business_name: string;
    email: string;
    phone: string;
    website: string;
    socials: {
      facebook: string;
      twitter: string;
      instagram: string;
      x: string;
    };
    description: string;
    address: string;
    profile_picture: string | File | null;
  }>({
    business_name: "",
    email: "",
    phone: "",
    website: "",
    socials: { facebook: "", twitter: "", instagram: "", x: "" },
    description: "",
    address: "",
    profile_picture: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await businessServices.getProfile();
        const data = response;
        setFormData({
          business_name: data.business_name || "",
          email: data.email || "",
          phone: data.phone || "",
          website: data.website || "",
          socials: {
            facebook: data.socials?.facebook || "",
            twitter: data.socials?.x || "",
            instagram: data.socials?.instagram || "",
            x: data.socials?.x || "",
          },
          description: data.description || "",
          address: data.address || "",
          profile_picture: data.profile_picture || null,
        });
      } catch (error) {
        toast.error("Failed to fetch profile data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    if (name.startsWith("socials.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socials: { ...prev.socials, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, profile_picture: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await businessServices.updateProfile({
        ...formData,
        profile_picture:
          typeof formData.profile_picture === "object" &&
          formData.profile_picture instanceof File
            ? formData.profile_picture
            : undefined,
      });
      toast.success("Profile updated successfully!");
      setShowModal(false);
      window.location.href = "/business/team-management";
    } catch (error) {
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message ||
              "Failed to update profile."
          : "Failed to update profile."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
        <div className="bg-[#FFF8E5] rounded-lg p-6 w-full max-w-md mx-4 border relative">
          <p className="text-[#1C232E]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-[#FFF8E5] rounded-lg p-6 w-full max-w-md mx-4 border relative max-h-[90vh] overflow-y-auto hide-scrollbar">
        <button
          className="absolute top-4 right-4 text-[#1C232E] hover:text-gray-600"
          onClick={() => {
            setShowModal(false);
            window.location.href = "/business/team-management";
          }}
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-medium mb-3 text-[#1C232E] font-[Cabin,sans-serif]">
          Edit Profile
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-[#1C232E] mb-1">
              What's the name of your business?
            </label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
              placeholder="Vet Office of New York"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C232E] mb-1">
              Upload a profile picture
            </label>
            <div className="flex items-center gap-3">
              {formData.profile_picture ? (
                <img
                  src={
                    typeof formData.profile_picture === "string"
                      ? formData.profile_picture
                      : URL.createObjectURL(formData.profile_picture)
                  }
                  alt="Profile Preview"
                  className="w-16 h-16 rounded-full object-cover border"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <label className="flex items-center gap-1 cursor-pointer text-[#FFB23E] font-medium">
                <input
                  type="file"
                  name="profile_picture"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <span className="text-sm flex items-center gap-1">
                  <PencilLine className="size-4 text-[var(--color-card-button)]" />{" "}
                  Edit picture
                </span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C232E] mb-1">
              What is your business phone number?
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
              placeholder="(555) 555-5555"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C232E] mb-1">
              What is your business email?
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
              placeholder="info@vetoffice.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C232E] mb-1">
              How would you like to be contacted by the pet parent?
            </label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="contact_email"
                  className="accent-[#FFB23E] w-4 h-4"
                />
                <span className="text-sm">Email</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="contact_phone"
                  className="accent-[#FFB23E] w-4 h-4"
                />
                <span className="text-sm">Phone Call</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C232E] mb-1">
              Please provide a short description of your business
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full text-sm rounded-md px-4 py-2 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
              placeholder="The Vet Office of New York is a premier veterinary clinic..."
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C232E] mb-1">
              What is your business address?
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
              placeholder="78 Hudson St, New York"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C232E] mb-1">
              Do you have a website?
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
              placeholder="www.vetoffice.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C232E] mb-1">
              Are you on social media?
            </label>
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
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
                </span>
                <input
                  type="url"
                  name="socials.instagram"
                  value={formData.socials.instagram || ""}
                  onChange={handleChange}
                  className="flex-1 text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                  placeholder="www.instagram.com"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_1021_9372)">
                      <rect width="48" height="48" rx="9" fill="#1877F2" />
                      <path
                        d="M48 24C48 35.9794 39.2231 45.9084 27.75 47.7084V30.9375H33.3422L34.4062 24H27.75V19.4981C27.75 17.5997 28.68 15.75 31.6613 15.75H34.6875V9.84375C34.6875 9.84375 31.9406 9.375 29.3147 9.375C23.8331 9.375 20.25 12.6975 20.25 18.7125V24H14.1562V30.9375H20.25V47.7084C8.77688 45.9084 0 35.9794 0 24C0 10.7456 10.7456 0 24 0C37.2544 0 48 10.7456 48 24Z"
                        fill="#1877F2"
                      />
                      <path
                        d="M33.3422 30.9375L34.4062 24H27.75V19.498C27.75 17.6001 28.6798 15.75 31.6612 15.75H34.6875V9.84375C34.6875 9.84375 31.941 9.375 29.3152 9.375C23.833 9.375 20.25 12.6975 20.25 18.7125V24H14.1562V30.9375H20.25V47.7083C21.4719 47.9001 22.7242 48 24 48C25.2758 48 26.5281 47.9001 27.75 47.7083V30.9375H33.3422Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1021_9372">
                        <rect width="48" height="48" rx="9" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <input
                  type="url"
                  name="socials.facebook"
                  value={formData.socials.facebook}
                  onChange={handleChange}
                  className="flex-1 text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                  placeholder="www.facebook.com"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
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
                        <rect width="48" height="48" rx="8" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <input
                  type="url"
                  name="socials.x"
                  value={formData.socials.x || ""}
                  onChange={handleChange}
                  className="flex-1 text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                  placeholder="www.x.com"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-[#FFB23E] text-[var(--color-black)] font-[Cabin,sans-serif] py-2 px-4 rounded-3xl hover:opacity-90 transition-all duration-200 font-semibold mt-4"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default BusinessProfile;
