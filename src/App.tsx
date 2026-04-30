import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Commission } from './pages/Commission';
import { AboutAndContact } from './pages/AboutAndContact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsAndConditions } from './pages/TermsAndConditions';
import EngineeringSolutions from './pages/EngineeringSolutions';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark-bg text-white font-sans selection:bg-neon-orange selection:text-black">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:slug" element={<ProductDetails />} />
            <Route path="/commissioni" element={<Commission />} />
            <Route path="/chi-siamo" element={<AboutAndContact />} />
            <Route path="/contatti" element={<AboutAndContact />} />
            <Route path="/carrello" element={<Cart />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/soluzioni-ingegneristiche" element={<EngineeringSolutions />} />
            <Route path="/user" element={<UserProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
