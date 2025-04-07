// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import ChatPage from '../pages/Chat';
import Campaigns from '../pages/Campaigns';
import Analytics from '../pages/Analytics';
import Marketplace from '../pages/Marketplace';
import ContentPage from '../pages/ContentPage';
import Login from '../pages/Login';
import Register from '../pages/register';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  const location = useLocation();
  const noLayoutRoutes = ['/chat', '/login', '/register'];

  const isNoLayout = noLayoutRoutes.includes(location.pathname);

  return isNoLayout ? (
    <Routes>
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  ) : (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <Campaigns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content"
          element={
            <ProtectedRoute>
              <ContentPage />
            </ProtectedRoute>
          }
        />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Layout>
  );
}