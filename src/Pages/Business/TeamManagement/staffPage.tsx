import { ChevronRight, Search, X, Plus } from 'lucide-react';
import React from 'react'
import { useState } from 'react';
import BusinessNavbar from '../../../Components/BusinessComponents/BusinessNavbar';

const StaffPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Vet',
    permissions: 'Full Access',
    username: ''
  });

  const [staffMembers, setStaffMembers] = useState([
    { id: 1, name: 'Dr. Hemant Patel', role: 'Vet', permissions: 'Full Access', username: 'hemantpatel45' },
    { id: 2, name: 'Dr. Felix Carter', role: 'Vet', permissions: 'Full Access', username: 'vetdoc_01' },
    { id: 3, name: 'Dr. Lila Monroe', role: 'Vet', permissions: 'Full Access', username: 'petcare_pro' },
    { id: 4, name: 'Dr. Oliver Grant', role: 'Vet', permissions: 'Full Access', username: 'furryfriend_vet' },
    { id: 5, name: 'Dr. Mia Thompson', role: 'Vet', permissions: 'Full Access', username: 'pawsitive_vet' },
    { id: 6, name: 'Dr. Felix Carter', role: 'Vet', permissions: 'Full Access', username: 'vetexpert_99' }
  ]);

  const handleAddMember = () => {
    if (newMember.name && newMember.username) {
      setStaffMembers([...staffMembers, {
        id: Date.now(),
        ...newMember
      }]);
      setNewMember({ name: '', role: 'Vet', permissions: 'Full Access', username: '' });
      setShowAddModal(false);
    }
  };

  const filteredStaff = staffMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFF8E5]">
      <BusinessNavbar />
      <div className="max-w-6xl mx-auto p-6">
        {/* Business Section */}
        <div className="border-2 border-dotted border-[#3B7EDB] rounded-2xl mb-8 overflow-visible pl-8 pr-4 pt-4 pb-8 relative">
          <h2 className="text-2xl font-serif font-bold underline underline-offset-4 text-[#1C232E] mb-4 ml-2">Your Business</h2>
          <div className="bg-[#6A8293] rounded-2xl border-2 border-dotted border-[#3B7EDB] px-8 py-6 flex items-start space-x-8 mt-2">
            <div className="w-48 h-48 bg-white rounded-2xl overflow-hidden flex-shrink-0 border-2 border-dotted border-[#3B7EDB]">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=160&h=160&fit=crop&crop=face" 
                alt="Veterinarian with dog"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white font-serif">Vet Office of New York</h3>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-base">
                    <div>
                      <p className="text-white/70 text-sm">Phone</p>
                      <p className="text-white font-medium">(555) 555-5555</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Email</p>
                      <p className="text-white font-medium">info@vetoffice.com</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Website</p>
                      <p className="text-white font-medium">www.vetoffice.com</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-white/70 text-sm">Address</p>
                    <p className="text-white font-medium">78 Hudson St, New York</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="w-10 h-10 bg-black rounded-lg hover:bg-gray-800 flex items-center justify-center transition-colors">
                    <span className="text-white font-bold text-lg">𝕏</span>
                  </button>
                  <button className="w-10 h-10 bg-orange-500 rounded-lg hover:bg-orange-600 flex items-center justify-center transition-colors">
                    <span className="text-white text-lg">📷</span>
                  </button>
                  <button className="w-10 h-10 bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors">
                    <span className="text-white font-bold text-lg">f</span>
                  </button>
                  <button className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-white/70 text-sm mb-2">Description</p>
                <p className="text-white text-sm leading-relaxed">
                  The Vet Office of New York is a premier veterinary clinic dedicated to providing exceptional care 
                  for pets in the heart of the city. Our experienced team of veterinarians and staff are committed 
                  to ensuring the health and well-being of your furry companions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="border-2 border-dotted border-[#3B7EDB] rounded-2xl overflow-visible pl-8 pr-4 pt-4 pb-8 relative">
          <h2 className="text-2xl font-serif font-bold underline underline-offset-4 text-[#1C232E] mb-4 ml-2">Your Team</h2>
          <div className="flex justify-between items-center mb-6 mr-4">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-sm text-[#1C232E] hover:text-[#FFB23E] transition-colors border border-[#1C232E] rounded-full px-4 py-2 bg-white">
                Filters 
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1C232E]/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-[#1C232E] rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFB23E] text-[#1C232E] bg-white"
                />
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#FFB23E] hover:bg-[#e6a036] text-[#1C232E] px-6 py-2 rounded-full flex items-center space-x-2 font-medium transition-colors border border-[#1C232E] shadow-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>
          {/* Staff Table */}
          <div className="bg-[#EDCC79] rounded-2xl border-2 border-dotted border-[#3B7EDB] overflow-hidden mr-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1C232E]/20">
                  <th className="text-center py-4 px-6 font-bold text-[#1C232E] text-base font-serif underline underline-offset-4">Staff Name</th>
                  <th className="text-center py-4 px-6 font-bold text-[#1C232E] text-base font-serif underline underline-offset-4">Role</th>
                  <th className="text-center py-4 px-6 font-bold text-[#1C232E] text-base font-serif underline underline-offset-4">Permissions</th>
                  <th className="text-center py-4 px-6 font-bold text-[#1C232E] text-base font-serif underline underline-offset-4">Username</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="border-b border-[#1C232E]/10 hover:bg-[#1C232E]/5 transition-colors">
                    <td className="py-4 px-6 text-[#1C232E] font-medium text-center">{member.name}</td>
                    <td className="py-4 px-6 text-[#1C232E] text-center">{member.role}</td>
                    <td className="py-4 px-6 text-[#1C232E] text-center">{member.permissions}</td>
                    <td className="py-4 px-6 text-[#1C232E] text-center">{member.username}</td>
                    <td className="py-4 px-6 text-center">
                      <ChevronRight className="w-5 h-5 text-[#1C232E]/60 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Vet">Vet</option>
                  <option value="Technician">Technician</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Assistant">Assistant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                <select
                  value={newMember.permissions}
                  onChange={(e) => setNewMember({...newMember, permissions: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Full Access">Full Access</option>
                  <option value="Limited Access">Limited Access</option>
                  <option value="Read Only">Read Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={newMember.username}
                  onChange={(e) => setNewMember({...newMember, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-md"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;