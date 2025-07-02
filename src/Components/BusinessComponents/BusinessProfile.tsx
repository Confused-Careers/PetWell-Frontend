import React, { useState } from "react";
import businessServices from "../../Services/businessServices";
import { toast } from "sonner";

const BusinessProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    business_name: "",
    email: "",
    phone: "",
    website: "",
    socials: { facebook: "", twitter: "" },
    description: "",
    address: "",
    profile_picture: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await businessServices.updateProfile(formData);
      toast.success("Profile updated successfully!");
      setFormData({
        business_name: "",
        email: "",
        phone: "",
        website: "",
        socials: { facebook: "", twitter: "" },
        description: "",
        address: "",
        profile_picture: null,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-business-section-bg)] flex flex-col items-center px-2 sm:px-4 md:px-8 py-4 md:py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-business-heading)] text-center mb-8 mt-4">
        Update Business Profile
      </h1>
      <div className="w-full max-w-md bg-[var(--color-white)] rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-[var(--color-business-heading)] font-cabin">Business Name</label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="PetWell Clinic"
            />
          </div>
          <div>
            <label className="block text-[var(--color-business-heading)] font-cabin">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="contact@petwellclinic.com"
            />
          </div>
          <div>
            <label className="block text-[var(--color-business-heading)] font-cabin">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="+1234567890"
            />
          </div>
          <div>
            <label className="block text-[var(--color-business-heading)] font-cabin">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="https://www.petwellclinic.com"
            />
          </div>
          <div>
            <label className="block text-[var(--color-business-heading)] font-cabin">Facebook</label>
            <input
              type="url"
              name="socials.facebook"
              value={formData.socials.facebook}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="https://facebook.com/petwell"
            />
          </div>
          <div>
            <label className="block text-[var(--color-business-heading)] font-cabin">Twitter</label>
            <input
              type="url"
              name="socials.twitter"
              value={formData.socials.twitter}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="https://twitter.com/petwell"
            />
          </div>
          <div>
            <label className="block text-[var(--color-business-heading)] font-cabin">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="A premier pet care clinic..."
            />
          </div>
          <div>
            <label className="block text-[var(--color-business-heading)] font-cabin">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="India"
            />
          </div>
          <div>
            <label className="block text-[var(--color-business-heading)] font-cabin">Profile Picture</label>
            <input
              type="file"
              name="profile_picture"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg"
              accept="image/*"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[var(--color-business-accent)] text-white font-cabin py-2 px-4 rounded-full hover:bg-opacity-80 disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;