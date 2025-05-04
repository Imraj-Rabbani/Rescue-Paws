import React, { useState, useContext } from 'react';
import {Package, Menu, ClipboardList, Wallet, LayoutDashboard, Users, LogOut, Sun, Moon} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/logoImage.jpg';
import { DarkmodeContext } from '../context/DarkmodeContext'; 

const AdminNavbar = ({ isSidebarOpen, toggleSidebar, activeTab, setActiveTab }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useContext(DarkmodeContext); 

  const SidebarItem = ({ icon, label, showLabel, onClick, isActive }) => (
    <div
      className={`flex items-center gap-2 cursor-pointer ${isActive
        ? 'text-[#FFD3AC] font-semibold'
        : 'text-white hover:text-white'}`}
      onClick={onClick}
      style={{ marginBottom: '15px' }}
    >
      {icon}
      {showLabel && <span>{label}</span>}
    </div>
  );

  const handleLogout = () => {
    setIsDialogOpen(false);
    navigate('/admindashboard');
    setActiveTab('Dashboard');
  };

  return (
    <aside
      className={`transition-all duration-300 ${isSidebarOpen ? "w-64 border-r border-r-transparent" : "w-16"
        } ${isDarkMode ? 'bg-black border-r border-r-white/20' : 'bg-[#331C08] border-r border-r-transparent'} text-white p-4 relative`}
    >
      <div className="flex items-center justify-between mb-6">
        {isSidebarOpen ? (
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-12 rounded-full object-cover"
            />
            <h1 className="text-xl font-bold text-[#FFD3AC]">Stray Paws</h1>
          </div>
        ) : (
          <div />
        )}

        <button
          onClick={toggleSidebar}
          className="text-white bg-transparent border-none p-0"
          aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <Menu className={`text-xl font-boldest ${isDarkMode ? 'text-white' : 'text-[#FFD3AC]'}`} />
        </button>
      </div>

      <nav className="space-y-4">
        <Link to="/admindashboard" style={{ textDecoration: 'none' }}>
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" showLabel={isSidebarOpen} onClick={() => setActiveTab('Dashboard')} isActive={activeTab === 'Dashboard'} />
        </Link>
        <Link to="/adminproducts" style={{ textDecoration: 'none' }}>
          <SidebarItem icon={<Package />} label="Products" showLabel={isSidebarOpen} onClick={() => setActiveTab('Products')} isActive={activeTab === 'Products'} />
        </Link>
        <Link to="/adminorders" style={{ textDecoration: 'none' }}>
          <SidebarItem icon={<ClipboardList />} label="Orders" showLabel={isSidebarOpen} onClick={() => setActiveTab('Orders')} isActive={activeTab === 'Orders'} />
        </Link>
        <Link to="/adminvolunteers" style={{ textDecoration: 'none' }}>
          <SidebarItem icon={<Users />} label="Volunteers" showLabel={isSidebarOpen} onClick={() => setActiveTab('Volunteers')} isActive={activeTab === 'Volunteers'} />
        </Link>
        <Link to="/revenue" style={{ textDecoration: 'none' }}>
          <SidebarItem icon={<Wallet />} label="Revenue" showLabel={isSidebarOpen} onClick={() => setActiveTab('Revenue')} isActive={activeTab === 'Revenue'} /> 
        </Link>
        <div style={{ textDecoration: 'none' }}>
          <SidebarItem
            icon={<LogOut />}
            label="Log Out"
            showLabel={isSidebarOpen}
            onClick={() => setIsDialogOpen(true)}
            isActive={false}
          />
        </div>
      </nav>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className={`fixed bottom-6 left-1 cursor-pointer focus:outline-none transition-all duration-300
          ${isDarkMode ? 'bg-gray-600 rounded-full p-2' : 'bg-black rounded-full p-2 '}
        `}
        style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isDarkMode ? <Sun className="text-xl text-white" /> : <Moon className="text-xl text-white" />}
      </button>

      {/* Logout Confirmation Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-lg p-6 w-full max-w-md  ${isDarkMode ? 'bg-gray-800' : 'bg-white '}`}>
            <h2 className={`text-lg font-semibold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-[#A2574F]'}`}>
              Are you sure?
            </h2>
            <p className={`text-sm text-center mb-4  ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>
              Do you want to log out?
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="bg-[#A2574F] text-white px-4 py-2 rounded-md mr-2 hover:bg-[#64332d] focus:outline-none focus:ring-2 focus:ring-[#A2574F]"
              >
                Yes
              </button>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A2574F]"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminNavbar;