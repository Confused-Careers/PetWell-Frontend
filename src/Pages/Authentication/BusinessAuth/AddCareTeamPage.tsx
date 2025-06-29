import React from 'react';
import Logo from '../../../Assets/PetWell.png';
import { useNavigate } from 'react-router-dom';

const AddCareTeamPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/signup/business/care-team-list');
  };

  return (
    <div className="min-h-screen bg-[#1C232E] flex flex-col items-center justify-center px-4 py-8">
      <div className="absolute left-8 top-8">
        <img src={Logo} alt="PetWell Logo" className="h-12 w-12" />
      </div>
      <div className="w-full max-w-xl bg-transparent flex flex-col items-center">
        <h1 className="text-[2rem] font-normal text-[#F6E7C0] font-alike text-center">Add your care team</h1>
        <p className="text-[#F6E7C0] text-base font-cabin text-center mt-1 mb-6">Let your staff log in, upload records, and support pet parents directly.</p>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">Name of care provider</label>
            <input type="text" placeholder="Type here" className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none" />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">What is their role?</label>
            <select className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none">
              <option value="">Select role</option>
              <option value="vet">Veterinarian</option>
              <option value="nurse">Nurse</option>
              <option value="assistant">Assistant</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">Permissions</label>
            <select className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none">
              <option value="">Select permissions</option>
              <option value="view">View Records</option>
              <option value="edit">Edit Records</option>
              <option value="manage">Manage Team</option>
            </select>
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">Set user name</label>
            <input type="text" placeholder="Type here" className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none" />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">Set password</label>
            <input type="password" placeholder="Type here" className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none" />
          </div>
          <div className="flex gap-4 mt-2">
            <button type="button" className="w-1/2 py-3 rounded-md border border-[#FDBA3B] text-[#FDBA3B] text-lg font-semibold font-cabin hover:bg-[#FDBA3B] hover:text-black transition-colors bg-transparent">Skip For Now</button>
            <button type="submit" className="w-1/2 py-3 rounded-md bg-[#FDBA3B] text-black text-lg font-semibold font-cabin hover:bg-[#ffb733] transition-colors">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCareTeamPage;
