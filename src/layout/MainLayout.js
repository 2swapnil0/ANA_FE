import React, { useState } from 'react';
import Sidebar from '../component/sidebar.js';
import '../App.css';
import SecondaryLayout from './WorkspaceLayout.js';
import Integration from '../component/Integration.js';
import Dashboard from '../component/Dashboard.js';
import Profile from '../component/Profile.js';
import Admin from '../component/Admin.js';
import Help from '../component/Help.js';
import ControlPanel from '../component/ControlPanel.js';

function MainLayout({ children }) {
  const [currentView, setCurrentView] = useState('home');

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const renderComponent = () => {
    switch (currentView) {
      case 'home':
        return <SecondaryLayout />;
      case 'integration':
        return <Integration />;
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      case 'admin':
        return <Admin />;
      case 'help':
        return <Help />;
      default:
        return null;
    }
  };

  return (
    <main className="flex h-screen bg-[#121212]">
      <Sidebar onNavigate={handleNavigation} />
      <div className="flex w-full flex-col gap-4 p-4">
        <ControlPanel currentView={currentView} />
        <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#121212', position: 'relative' }}>
          {renderComponent()}
          <style>
            {`
              /* Hide scrollbar but allow scrolling */
              .flex-1::-webkit-scrollbar {
                display: none;
              }

              /* Optional: Ensure compatibility with Firefox */
              .flex-1 {
                scrollbar-width: none;
              }
            `}
          </style>
        </div>
      </div>
    </main>
  );
}

export default MainLayout;
