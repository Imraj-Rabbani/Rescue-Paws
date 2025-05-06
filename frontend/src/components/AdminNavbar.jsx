import React, { useState, useContext } from 'react';
import { Package, Menu, ClipboardList, Wallet, LayoutDashboard, Users, LogOut, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/logoImage.jpg';
import { DarkmodeContext } from '../context/DarkmodeContext';

const AdminNavbar = ({ isSidebarOpen, toggleSidebar, activeTab, setActiveTab }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useContext(DarkmodeContext);

  const SidebarItem = ({ icon, label, showLabel, onClick, isActive }) => {
    let baseClasses = 'flex items-center gap-2 cursor-pointer transition-colors duration-200';
    let activeClasses = isSidebarOpen
      ? 'text-[#8B4513] font-bold rounded-md px-2 py-1 shadow-md'
      : 'text-[#8B4513] font-semibold rounded-md';
    let hoverClasses = isSidebarOpen
      ? isDarkMode
        ? 'text-gray-300 hover:text-white hover:bg-white/10 rounded-md px-2 py-1'
        : 'text-[#8B4513] font-semibold rounded-md px-2 py-1 hover:shadow-[#8B4513]'
      : `${isDarkMode ? 'text-white' : 'text-[#8B4513] font-semibold py-0.75'}`;



    const finalClasses = isActive
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${hoverClasses}`;

    return (
      <div
        className={finalClasses}
        onClick={onClick}
        style={{ marginBottom: '15px' }}
      >
        {React.cloneElement(icon, {
          size: isSidebarOpen ? 26 : 26
        })}
        {showLabel && <span>{label}</span>}
      </div>
    );
  };

  const handleLogout = () => {
    setIsDialogOpen(false);
    navigate('/admindashboard');
    setActiveTab('Dashboard');
  };

  return (
    <aside
      className={`transition-all duration-300 ${isSidebarOpen ? "w-64 border-r" : "w-16"
        } ${isDarkMode ? 'bg-black border-r-white/20' : 'bg-[#eeddcb] border-r-transparent'} text-white p-4 relative`}
    >
      <div className="flex items-center justify-between mb-6">
        {isSidebarOpen ? (
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="h-15 w-15 rounded-full object-cover border-2 border-[#8B4513] shadow-md"
            />
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#8B4513]'}`}>Stray Paws</h1>
          </div>
        ) : (
          <div />
        )}

        <button
          onClick={toggleSidebar}
          className={`text-white bg-transparent border-none p-0 transition-all duration-300 ${!isSidebarOpen ? 'mr-1' : '' // Add margin-left when sidebar is off
            }`}
          aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <Menu className={`text-xl font-boldest ${isDarkMode ? 'text-white' : 'text-[#8B4513]'}`} size={isSidebarOpen ? 24 : 30} />
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
        <Link to="/adminrevenue" style={{ textDecoration: 'none' }}>
          <SidebarItem icon={<Wallet />} label="Revenue & Profit" showLabel={isSidebarOpen} onClick={() => setActiveTab('Revenue & Profit')} isActive={activeTab === 'Revenue & Profit'} />
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
        className={`fixed bottom-5 left-3.5 cursor-pointer focus:outline-none transition-all duration-300
          ${isDarkMode ? 'bg-gray-600 rounded-full p-2' : 'bg-[#70360c] rounded-full p-2 '}
        `}
        style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isDarkMode ? <Sun className="text-xl text-white" /> : <Moon className="text-xl text-white" />}
      </button>

      {/* Logout Confirmation Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md">
          <div className={`rounded-lg shadow-lg p-6 w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-lg font-semibold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-[#A2574F]'}`}>
              Are you sure?
            </h2>
            <p className={`text-sm text-center mb-4 ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>
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

