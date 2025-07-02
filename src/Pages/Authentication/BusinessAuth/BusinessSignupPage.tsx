import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";
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
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center px-4 py-8 relative">
      <div className="absolute left-4 top-4 sm:left-8 sm:top-8">
        <img
          src={Logo}
          alt="PetWell Logo"
          className="h-6 sm:h-8 md:h-12 w-auto max-w-[120px] object-contain transition-all mb-4 sm:mb-0"
        />
      </div>
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-logo)] text-center mb-2 mt-6 break-words">
          Let's set up your profile
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-logo)] opacity-80 text-center mb-8">
          Just a few details to get your team started.
        </p>
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
              What's the name of your business?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
              Upload a profile picture
            </label>
            <div className="mt-1 border border-[var(--color-border)] w-full flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-white border border-gray-200 text-gray-500 px-4 py-2 font-cabin hover:bg-gray-100 transition"
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
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
              What is your business phone number?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
              How would you like to be contacted by the pet parent?
            </label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 text-[var(--color-text)] font-cabin">
                <input
                  type="checkbox"
                  className="accent-[var(--color-card-button)] w-2 h-2"
                  checked={contactPreference.includes("Email")}
                  onChange={() => handleContactPrefChange("Email")}
                />
                Email
              </label>
              <label className="flex items-center gap-2 text-[var(--color-text)] font-cabin">
                <input
                  type="checkbox"
                  className="accent-[var(--color-card-button)] w-2 h-2"
                  checked={contactPreference.includes("Phone Call")}
                  onChange={() => handleContactPrefChange("Phone Call")}
                />
                Phone Call
              </label>
            </div>
          </div>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
              Please provide a short description of your business
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
              Do you have a website?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
              Are you on social media?
            </label>
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex items-center gap-2">
                <FaInstagram className="w-6 h-6 text-[#E1306C]" />
                <input
                  type="text"
                  placeholder="Paste Link Here"
                  className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <FaFacebook className="w-6 h-6 text-[#1877F3]" />
                <input
                  type="text"
                  placeholder="Paste Link Here"
                  className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <FaXTwitter className="w-6 h-6 text-black" />
                <input
                  type="text"
                  placeholder="Paste Link Here"
                  className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                />
              </div>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            className="mt-4 w-full bg-[var(--color-card-button)] text-[var(--color-text)] font-cabin font-medium py-2 rounded-full hover:bg-[var(--color-background)] hover:text-[var(--color-card-button)] border hover:border-[var(--color-card-button)] transition"
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
