import React, { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";
import PetWellLogo from "../../../Assets/PetWell.png";
import { useNavigate, useLocation } from "react-router-dom";
import authServices from "../../../Services/authServices";

const BusinessSignupPage: React.FC = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email and password from previous step
  const { email = "", password = "" } = (location.state as any) || {};

  // Controlled fields for the rest of the business details
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [x, setX] = useState("");
  const [contactPreference, setContactPreference] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setProfileImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleContactPrefChange = (pref: string) => {
    setContactPreference((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!businessName || !phone || !description) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      const businessData = {
        business_name: businessName,
        email,
        phone,
        password,
        description,
        website,
        instagram,
        facebook,
        x,
        contact_preference: contactPreference?.sort()?.reverse().join(","),
        profile_picture: profileImage || undefined,
      };
      console.log("[BusinessSignupPage] Submitting:", businessData);
      const res = await authServices.signupBusiness(businessData);
      console.log("[BusinessSignupPage] API response:", res);
      navigate("/business/signup/otp", { state: { email } });
    } catch (err: any) {
      console.error("[BusinessSignupPage] Registration error:", err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
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
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center">
        <p className=" font-[Alike,serif] text-3xl text-[#1C232E] sm:mb-2 mb-2 text-center leading-tight">
          Let's set up your profile
        </p>
        <p className="mb-3 text-lg font-[Cabin] items-center flex justify-center text-center px-2">
          Just a few details to get your team started.
        </p>
        {error && (
          <div className="w-full max-w-md mb-2 text-center text-[var(--color-warning)] bg-[var(--color-warning)]/10 rounded py-2 px-3 text-sm animate-fade-in">
            {error}
          </div>
        )}
        <form className="w-full flex flex-col gap-4 sm:gap-5 max-w-sm mt-4 pb-12" onSubmit={handleSubmit}>
          <div className="w-full  flex flex-col gap-2">
            <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
              What's the name of your business?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>
          <div className="w-full  flex flex-col gap-2">
            <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
              Upload a profile picture
            </label>
            <div className="mt-1 cursor-pointer border border-[var(--color-border)] rounded-md w-full flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-md bg-white border border-gray-200 text-gray-500 px-4 py-1 font-cabin hover:bg-gray-100 transition"
              >
                <Upload className="w-5 h-5" />
                Upload image
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {profileImagePreview && (
              <img
                src={profileImagePreview}
                alt="Profile Preview"
                className="mt-2 h-16 w-16 rounded-full object-cover border border-[var(--color-primary)] mx-auto"
              />
            )}
          </div>
          <div className="w-full  flex flex-col gap-2">
            <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
              What is your business phone number?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="w-full  flex flex-col gap-2">
            <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
              How would you like to be contacted by the pet parent?
            </label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 text-[var(--color-text)] font-cabin">
                <input
                  type="checkbox"
                  className="accent-[var(--color-card-button)] w-2 h-2 cursor-pointer"
                  checked={contactPreference.includes("Email")}
                  onChange={() => handleContactPrefChange("Email")}
                />
                Email
              </label>
              <label className="flex items-center gap-2 text-[var(--color-text)] font-cabin">
                <input
                  type="checkbox"
                  className="accent-[var(--color-card-button)] w-2 h-2 cursor-pointer"
                  checked={contactPreference.includes("Phone Call")}
                  onChange={() => handleContactPrefChange("Phone Call")}
                />
                Phone Call
              </label>
            </div>
          </div>
          <div className="w-full  flex flex-col gap-2">
            <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
              Please provide a short description of your business
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="w-full  flex flex-col gap-2">
            <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
              Do you have a website?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className="w-full  flex flex-col gap-2">
            <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
              Are you on social media?
            </label>
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex items-center gap-2">
                <FaInstagram className="w-6 h-6 text-[#E1306C]" />
                <input
                  type="text"
                  placeholder="Paste Link Here"
                  className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <FaFacebook className="w-6 h-6 text-[#1877F3]" />
                <input
                  type="text"
                  placeholder="Paste Link Here"
                  className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <FaXTwitter className="w-6 h-6 text-black" />
                <input
                  type="text"
                  placeholder="Paste Link Here"
                  className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                />
              </div>
            </div>
          </div>
         
          <button
                type="submit"
                                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"

                disabled={loading}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "Registering..." : "Next"}
              </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessSignupPage;
