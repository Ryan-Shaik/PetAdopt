import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import Pages
import HomePage from './pages/HomePage';
import PetListingPage from './pages/PetListingPage';
import PetDetailsPage from './pages/PetDetailsPage';
import UserDashboard from './pages/UserDashboard';
import ShelterDashboard from './pages/ShelterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdoptionApplicationPage from './pages/AdoptionApplicationPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EditProfilePage from './pages/EditProfilePage';

// Import Shelter Pet Pages
import MyPetsListPage from './pages/shelter/MyPetsListPage';
import AddPetPage from './pages/shelter/AddPetPage';
import EditPetPage from './pages/shelter/EditPetPage';
import ShelterApplicationsPage from './pages/shelter/ShelterApplicationsPage';

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
// Import AuthProvider later

// Placeholder components
const NotFoundPage = () => <div className="p-4 text-center">404 - Page Not Found</div>;

function App() {
  return (
    // Wrap with AuthProvider later
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-text font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pets" element={<PetListingPage />} />
            <Route path="/pets/:id" element={<PetDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/apply/:petId?"
              element={
                <ProtectedRoute allowedRoles={['Adopter', 'Admin']}>
                  <AdoptionApplicationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Adopter']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shelter/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Shelter']}>
                  <ShelterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shelter/pets"
              element={
                <ProtectedRoute allowedRoles={['Shelter']}>
                  <MyPetsListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shelter/pets/add"
              element={
                <ProtectedRoute allowedRoles={['Shelter']}>
                  <AddPetPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shelter/pets/edit/:petId"
              element={
                <ProtectedRoute allowedRoles={['Shelter']}>
                  <EditPetPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shelter/applications"
              element={
                <ProtectedRoute allowedRoles={['Shelter']}>
                  <ShelterApplicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
