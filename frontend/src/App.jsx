import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const IDEPage = React.lazy(() => import('./pages/IDEPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-gray-900 text-white">
    Loading...
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:projectId" element={<IDEPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

