import React, { useRef, useState } from "react";
import { Upload, Instagram, Facebook, X } from "lucide-react";
import Logo from "../../../Assets/PetWell.png";
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
        contact_preference: contactPreference.join(","),
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
    <div className="min-h-screen bg-[#181F29] flex flex-col items-center justify-center px-4 py-8">
      <div className="absolute left-8 top-8">
        <img src={Logo} alt="PetWell Logo" className="h-12 w-12" />
      </div>
      <div className="w-full max-w-xl bg-transparent flex flex-col items-center">
        <h1 className="text-[2rem] font-normal text-[#F6E7C0] font-alike text-center">
          Let's set up your profile
        </h1>
        <p className="text-[#F6E7C0] text-base font-cabin text-center mt-1 mb-6">
          Just a few details to get your team started.
        </p>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              What's the name of your business?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              Upload a profile picture
            </label>
            <div className="mt-1 w-full flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-white border border-gray-200 text-gray-500 px-4 py-3 font-cabin hover:bg-gray-100 transition"
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
                className="mt-2 h-16 w-16 rounded-full object-cover border border-[#F6E7C0] mx-auto"
              />
            )}
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              What is your business phone number?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              How would you like to be contacted by the pet parent?
            </label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 text-[#EBD5BD] font-cabin">
                <input
                  type="checkbox"
                  className="accent-[#F6E7C0] w-3 h-3"
                  checked={contactPreference.includes("Email")}
                  onChange={() => handleContactPrefChange("Email")}
                />
                Email
              </label>
              <label className="flex items-center gap-2 text-[#EBD5BD] font-cabin">
                <input
                  type="checkbox"
                  className="accent-[#F6E7C0] w-3 h-3"
                  checked={contactPreference.includes("Phone Call")}
                  onChange={() => handleContactPrefChange("Phone Call")}
                />
                Phone Call
              </label>
            </div>
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              Please provide a short description of your business
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              Do you have a website?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              Are you on social media?
            </label>
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex items-center gap-2">
                <Instagram className="w-6 h-6 text-[#F6E7C0] bg-[#E1306C] rounded" />
                <input
                  type="text"
                  placeholder="Paste Link Here"
                  className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Facebook className="w-6 h-6 text-[#F6E7C0] bg-[#1877F3] rounded" />
                <input
                  type="text"
                  placeholder="Paste Link Here"
                  className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <X className="w-6 h-6 text-[#F6E7C0] bg-black rounded" />
                <input
                  type="text"
                  placeholder="Paste Link Here"
                  className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                />
              </div>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            className="mt-4 w-full bg-[#FDBA3B] text-[#23272F] font-cabin font-medium py-2 rounded-md hover:bg-[#e6a832] transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessSignupPage;
