import { Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import ProfileCreation from "./Pages/Authentication/ProfileCreation/ProfileCreation";
import "./App.css";
import HomePage from "./Pages/PetParentHomePage/HomePage";
import UploadDocuments from "./Pages/PetParentDocumentPage/UploadDocumentsPage";
import VerificationPage from "./Pages/Authentication/ProfileCreation/VerificationPage";
import VaccinesPage from "./Pages/PetParentVaccine/VaccinesPage";
import DownloadSelectPage from "./Pages/PetParentVaccine/DownloadSelectPage";
import AddVaccinePage from "./Pages/PetParentVaccine/AddVaccinePage";
import DocumentPage from "./Pages/PetParentDocumentPage/DocumentPage";
import TeamsPage from "./Pages/PetParentTeamPage/TeamsPage";
import AddTeamPage from "./Components/Teams/AddTeamPage";
import LoginPage from "./Pages/Authentication/LoginPage";
import PetProfile from "./Pages/Profile/PetProfile";
import SwitchProfilePage from "./Pages/Profile/SwitchProfilePage";
import ForgotPasswordPage from "./Pages/Authentication/ForgotPasswordPage";
import SignupTypeSelectPage from "./Pages/Authentication/SignupTypeSelectPage";
import PetParentSignupPage from "./Pages/Authentication/ProfileCreation/PetParentSignupPage";
import AddPetProfile from "./Pages/Authentication/ProfileCreation/AddPetProfile";
import UploadingDocAfterEnterPage from "./Pages/PetParentDocumentPage/UploadingDocAfterEnterPage";
import BusinessSignupPage from "./Pages/Authentication/BusinessAuth/BusinessSignupPage";
import AddCareTeamPage from "./Pages/Authentication/BusinessAuth/AddCareTeamPage";
import CareTeamListPage from "./Pages/Authentication/BusinessAuth/CareTeamListPage";
import BusinessHomePage from "./Pages/Business/BusinessHome/BusinessHomePage";
import PetParentOnboardingChoice from "./Pages/Authentication/ProfileCreation/PetParentOnboardingChoice";

function App() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50">
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/profile-creation" element={<ProfileCreation />} />
        <Route path="/signup-type" element={<SignupTypeSelectPage />} />
        <Route path="/signup/pet-parent" element={<PetParentSignupPage />} />
        <Route path="/signup/business" element={<BusinessSignupPage />} />
        <Route path="/signup/business/add-care-team" element={<AddCareTeamPage />} />
        <Route path="/signup/business/care-team-list" element={<CareTeamListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/add-pet-profile" element={<AddPetProfile />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/business/home" element={<BusinessHomePage />} />
        <Route path="/pet-parent-onboarding-choice" element={<PetParentOnboardingChoice />} />

        {/* Pet Owner Routes */}
        <Route path="/petowner/pet/:petId/home" element={<HomePage />} />
        <Route path="/petowner/pet/:petId/vaccine" element={<VaccinesPage />} />
        <Route path="/petowner/pet/:petId/documents" element={<DocumentPage />} />
        <Route path="/petowner/pet/:petId/team" element={<TeamsPage />} />
        <Route path="/petowner/pet/:petId/add-vaccine" element={<AddVaccinePage />} />
        <Route path="/petowner/pet/:petId/upload" element={<UploadDocuments />} />
        <Route path="/petowner/pet/:petId/add-team" element={<AddTeamPage />} />
        <Route path="/petowner/pet/:petId/profile" element={<PetProfile />} />
        <Route path="/petowner/pet/:petId/download-select" element={<DownloadSelectPage />} />
        <Route path="/petowner/pet/:petId/upload-documents" element={<UploadingDocAfterEnterPage />} />
        <Route path="/petowner/pet/:petId/verify" element={<VerificationPage />} />

        {/* Profile Management Routes */}
        <Route path="/switch-profile" element={<SwitchProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;