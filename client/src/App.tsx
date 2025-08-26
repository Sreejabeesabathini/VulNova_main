import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from './components/Layout/Layout';
import LazyWrapper from './components/LazyWrapper';

// Lazy load all page components
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Assets = lazy(() => import('./pages/Assets/Assets'));
const AssetDetails = lazy(() => import('./pages/Assets/AssetDetails'));
const AssetsGraph = lazy(() => import('./pages/Assets/AssetsGraph'));
const AssetsCustomData = lazy(() => import('./pages/Assets/AssetsCustomData'));
const AssetsEDP = lazy(() => import('./pages/Assets/AssetsEDP'));
const AssetsEDR = lazy(() => import('./pages/Assets/AssetsEDR'));
const AssetsLDAP = lazy(() => import('./pages/Assets/AssetsLDAP'));
const AssetsDashboards = lazy(() => import('./pages/Assets/AssetsDashboards'));
const Vulnerabilities = lazy(() => import('./pages/Vulnerabilities/Vulnerabilities'));
const VulnerabilityDetails = lazy(() => import('./pages/Vulnerabilities/VulnerabilityDetails'));
const ThreatIntelligence = lazy(() => import('./pages/ThreatIntelligence/ThreatIntelligence'));
const Integrations = lazy(() => import('./pages/Integrations/Integrations'));
const Reporting = lazy(() => import('./pages/Reporting/Reporting'));
const SoftwareInventory = lazy(() => import('./pages/SoftwareInventory/SoftwareInventory'));
const Support = lazy(() => import('./pages/Support/Support'));

// Enhanced QueryClient with better caching strategies
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="/dashboard" 
                element={
                  <LazyWrapper>
                    <Dashboard />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/assets" 
                element={
                  <LazyWrapper>
                    <Assets />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/assets/:id" 
                element={
                  <LazyWrapper>
                    <AssetDetails />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/assets/graph" 
                element={
                  <LazyWrapper>
                    <AssetsGraph />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/assets/custom-data" 
                element={
                  <LazyWrapper>
                    <AssetsCustomData />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/assets/edp" 
                element={
                  <LazyWrapper>
                    <AssetsEDP />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/assets/edr" 
                element={
                  <LazyWrapper>
                    <AssetsEDR />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/assets/ldap" 
                element={
                  <LazyWrapper>
                    <AssetsLDAP />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/assets/dashboards" 
                element={
                  <LazyWrapper>
                    <AssetsDashboards />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/vulnerabilities" 
                element={
                  <LazyWrapper>
                    <Vulnerabilities />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/vulnerabilities/:id" 
                element={
                  <LazyWrapper>
                    <VulnerabilityDetails />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/threat-intelligence" 
                element={
                  <LazyWrapper>
                    <ThreatIntelligence />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/integrations" 
                element={
                  <LazyWrapper>
                    <Integrations />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/reporting" 
                element={
                  <LazyWrapper>
                    <Reporting />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/software-inventory" 
                element={
                  <LazyWrapper>
                    <SoftwareInventory />
                  </LazyWrapper>
                } 
              />
              <Route 
                path="/support" 
                element={
                  <LazyWrapper>
                    <Support />
                  </LazyWrapper>
                } 
              />
            </Routes>
          </Layout>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
