// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/Chat';
import Campaigns from './pages/Campaigns';
import Analytics from './pages/Analytics';
import Marketplace from './pages/Marketplace';

function AppRoutes() {
  const location = useLocation();
  const noLayoutRoutes = ['/chat']; // Add more routes here if needed

  const isNoLayout = noLayoutRoutes.includes(location.pathname);

  return isNoLayout ? (
    <Routes>
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  ) : (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}


