import React, { useState, useContext } from 'react';
import { Edit, Info, CheckCircle, Briefcase, UserX } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import { DarkmodeContext } from '../context/DarkmodeContext';

// --- Helper Components ---

// Reusable Card Component
const Card = ({ title, children, className }) => {
    const { isDarkMode } = useContext(DarkmodeContext);
    return (
        <div className={`rounded-xl shadow-md p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-white/10'} ${className}`}>
            <h3 className={`text-lg font-semibold text-center ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'} mb-4`}>{title}</h3>
            {children}
        </div>
    );
};

// Status Badge Mapping
const getStatusBadge = (status) => {
    const { isDarkMode } = useContext(DarkmodeContext);
    const baseClass = 'rounded-full px-2 py-1 text-xs font-semibold flex items-center';

    switch (status) {
        case 'Available to Work':
            return (
                <span className={`${baseClass} ${isDarkMode ? 'bg-green-800 text-green-100 border border-green-700' : 'bg-green-100 text-green-800 border border-green-300'}`}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Available
                </span>
            );
        case 'Currently Working':
            return (
                <span className={`${baseClass} ${isDarkMode ? 'bg-blue-800 text-blue-100 border border-blue-700' : 'bg-blue-100 text-blue-800 border border-blue-300'}`}>
                    <Briefcase className="w-4 h-4 mr-1 text-blue-500" />
                    Working
                </span>
            );
        case 'Inactive':
            return (
                <span className={`${baseClass} ${isDarkMode ? 'bg-red-800 text-red-100 border border-red-700' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                    <UserX className="w-4 h-4 mr-1" />
                    Inactive
                </span>
            );
        default:
            return <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Unknown</span>;
    }
};

// --- Main Component ---
const VolunteerPage = () => {
    const [volunteers, setVolunteers] = useState([
        { id: 1, name: 'Alice Smith', contact: 'alice.smith@example.com', area: 'Area 1', signupDate: '2024-01-15', status: 'Available to Work', age: 30, address: '123 Main St', workDetails: '' },
        { id: 2, name: 'Bob Johnson', contact: 'bob.johnson@example.com', area: 'Area 2', signupDate: '2024-02-20', status: 'Available to Work', age: 25, address: '456 Oak Ave', workDetails: '' },
        { id: 3, name: 'Charlie Brown', contact: 'charlie.brown@example.com', area: 'Area 1', signupDate: '2024-03-10', status: 'Currently Working', age: 40, address: '789 Pine Ln', workDetails: 'Delivering Meals' },
        { id: 4, name: 'Diana Miller', contact: 'diana.miller@example.com', area: 'Area 3', signupDate: '2024-04-05', status: 'Inactive', age: 22, address: '246 Elm St', workDetails: '' },
        { id: 5, name: 'Ethan Davis', contact: 'ethan.davis@example.com', area: 'Area 2', signupDate: '2024-05-12', status: 'Available to Work', age: 35, address: '135 Maple Dr', workDetails: '' },
        { id: 6, name: 'Fiona Green', contact: 'fiona.green@example.com', area: 'Area 3', signupDate: '2024-06-01', status: 'Available to Work', age: 28, address: '579 Birch Rd', workDetails: '' },
    ]);

    const [filterStatus, setFilterStatus] = useState('');
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editedVolunteer, setEditedVolunteer] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('Volunteers');
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const { isDarkMode } = useContext(DarkmodeContext);

    const filteredVolunteers = filterStatus
        ? volunteers.filter(v => v.status === filterStatus)
        : volunteers;

    // Function to handle status change with work details
    const handleStatusChange = (id, newStatus) => {
        setVolunteers(volunteers.map(v =>
            v.id === id ? { ...v, status: newStatus } : v
        ));
    };

    const openEditDialog = (volunteer) => {
        setEditedVolunteer({ ...volunteer });
        setSelectedVolunteer(volunteer);
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
        if (editedVolunteer) {
            setVolunteers(volunteers.map(v =>
                v.id === editedVolunteer.id ? { ...editedVolunteer } : v
            ));
        }
        setIsEditDialogOpen(false);
        setSelectedVolunteer(null);
    };

    const handleCancelEdit = () => {
        setIsEditDialogOpen(false);
        setSelectedVolunteer(null);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const showVolunteerDetails = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setIsDetailsOpen(true);
    };

    const closeVolunteerDetails = () => {
        setIsDetailsOpen(false);
        setSelectedVolunteer(null);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Available to Work':
                return <CheckCircle className="w-4 h-4 mr-1 text-green-500" />;
            case 'Currently Working':
                return <Briefcase className="w-4 h-4 mr-1 text-blue-500" />;
            case 'Inactive':
                return <UserX className="w-4 h-4 mr-1 text-red-500" />;
            default:
                return null;
        }
    };

    const getSelectStyle = (status) => {
        const { isDarkMode } = useContext(DarkmodeContext);
        let baseStyle = "appearance-none border rounded-md shadow-sm py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-colors duration-200";

        if (isDarkMode) {
            baseStyle += " bg-gray-700 text-gray-300 border-gray-600";
        } else {
            baseStyle += " bg-white text-gray-700 border-gray-300";
        }

        switch (status) {
            case 'Available to Work':
                return baseStyle + " text-green-800 bg-green-100 border-green-300";
            case 'Currently Working':
                return baseStyle + " text-blue-800 bg-blue-100 border-blue-300";
            case 'Inactive':
                return baseStyle + " text-red-800 bg-red-100 border-red-300";
            default:
                return baseStyle;
        }
    }

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-[#F5F5F5]'}`}>
            {/* Sidebar */}
            <AdminNavbar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                activeTab={activeTab}
                setActiveTab={activeTab}
            />

            {/* Main Content Area */}
            <div className="flex-1 p-6">
                <h2 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-[#64332d]'} mb-8`}><u>Volunteer Management</u></h2>
                <Card title="Volunteer List" className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <p className={`text-center flex-grow ml-[165px] ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>List of all volunteers and their status.</p>
                        <div className="relative inline-block">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className={`relative appearance-none border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#664C36] focus:border-transparent ${isDarkMode ? 'bg-black text-white border-gray-600' : 'bg-white border-transparent'}`}
                            >
                                <option value="">All Statuses</option>
                                <option value="Available to Work">Available to Work</option>
                                <option value="Currently Working">Currently Working</option>
                                <option value="Inactive">Inactive</option>
                            </select>

                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="ml-4">
                        <table className="min-w-full">
                            <thead className={`${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-[#e4ccb8] text-[#664C36]'}`}>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Area</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Signup Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`${isDarkMode ? 'bg-gray-900 divide-gray-800 text-gray-300' : 'bg-white divide-y divide-gray-200'}`}>
                                {filteredVolunteers.map((volunteer) => (
                                    <tr key={volunteer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{volunteer.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{volunteer.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{volunteer.contact}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{volunteer.area}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{volunteer.signupDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(volunteer.status)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="relative inline-block">

                                                <select
                                                    value={volunteer.status}
                                                    onChange={(e) => {
                                                        const newStatus = e.target.value;
                                                        handleStatusChange(volunteer.id, newStatus);
                                                    }}
                                                    className={`${getSelectStyle(volunteer.status)} pr-8`}
                                                >
                                                    <option value="Available to Work" className="flex items-center">
                                                        <CheckCircle className="w-4 h-4 mr-1 text-green-500 " />
                                                        Available
                                                    </option>
                                                    <option value="Currently Working" className="flex items-center">
                                                        <Briefcase className="w-4 h-4 mr-1 text-blue-500" />
                                                        Working
                                                    </option>
                                                    <option value="Inactive" className="flex items-center">
                                                        <UserX className="w-4 h-4 mr-1 text-red-500" />
                                                        Inactive
                                                    </option>
                                                </select>
                                                <div className="absolute inset-y-0 right-12 flex items-center px-2 pointer-events-none">
                                                    <svg className={`w-4 h-4 ${isDarkMode ? 'text-black' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>

                                                <button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditDialog(volunteer)}
                                                    className={` ${isDarkMode ? 'text-gray-400 ' : 'text-gray-500 '}`}
                                                >
                                                    <Edit className="h-4 w-4 ml-2" />
                                                </button>
                                                <button
                                                    size="icon"
                                                    onClick={() => showVolunteerDetails(volunteer)}
                                                    className={` ${isDarkMode ? 'text-gray-400 ' : 'text-gray-500 '}`}
                                                >
                                                    <Info className="h-4 w-4 ml-2" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Edit Volunteer Dialog */}
                {isEditDialogOpen && (
                    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
                        <div className={`rounded-xl shadow-lg p-6 w-full max-w-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-white/10'}`}>
                            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'} mb-4`}>Edit Volunteer</h2>
                            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                Make changes to the volunteer&apos;s information below. Click save when
                                you&apos;re done.
                            </p>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="name" className={`text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        value={editedVolunteer?.name || ''}
                                        onChange={(e) => setEditedVolunteer({ ...editedVolunteer, name: e.target.value })}
                                        className={`col-span-3 border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#664C36] focus: 'border-gray-300'}`}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="contact" className={`text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                                        Contact
                                    </label>
                                    <input
                                        id="contact"
                                        value={editedVolunteer?.contact || ''}
                                        onChange={(e) => seteditedVolunteer({ ...editedVolunteer, contact: e.target.value })}
                                        className={`col-span-3 border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#664C36] focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'border-gray-300'}`}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="area" className={`text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                                        Area
                                    </label>
                                    <input
                                        id="area"
                                        value={editedVolunteer?.area || ''}
                                        onChange={(e) => setEditedVolunteer({ ...editedVolunteer, area: e.target.value })}
                                        className={`col-span-3 border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'border-gray-300'}`}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="address" className={`text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                                        Address
                                    </label>
                                    <input
                                        id="address"
                                        value={editedVolunteer?.address || ''}
                                        onChange={(e) => setEditedVolunteer({ ...editedVolunteer, address: e.target.value })}
                                        className={`col-span-3 border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'border-gray-300'}`}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="status" className={`text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                                        Status
                                    </label>
                                    <select
                                        value={editedVolunteer?.status}
                                        onChange={(e) => setEditedVolunteer({ ...editedVolunteer, status: e.target.value })}
                                        className={`col-span-3 appearance-none border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'border-gray-300 bg-white'}`}
                                    >
                                        <option value="Available to Work">Available to Work</option>
                                        <option value="Currently Working">Currently Working</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={handleCancelEdit}
                                    className={`rounded-md px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSaveEdit}
                                    className={`rounded-md px-4 py-2 ${isDarkMode ? 'bg-[#A2574F] text-white hover:bg-[#8c453e]' : 'bg-[#A2574F] text-white hover:bg-[#8c453e]'}`}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Volunteer Details Modal */}
                {isDetailsOpen && selectedVolunteer && (
                    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center">
                        <div className={`rounded-xl shadow-lg p-6 w-full max-w-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-white/10'}`}>
                            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'} mb-4`}>Volunteer Details</h2>
                            <div className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <p><span className="font-medium">Name:</span> {selectedVolunteer.name}</p>
                                <p><span className="font-medium">Age:</span> {selectedVolunteer.age}</p>
                                <p><span className="font-medium">Contact:</span> {selectedVolunteer.contact}</p>
                                <p><span className="font-medium">Area:</span> {selectedVolunteer.area}</p>
                                <p><span className="font-medium">Address:</span> {selectedVolunteer.address}</p>
                                <p><span className="font-medium">Signup Date:</span> {selectedVolunteer.signupDate}</p>
                                <p><span className="font-medium">Status:</span> {getStatusBadge(selectedVolunteer.status)}</p>
                                {selectedVolunteer.status === 'Currently Working' && (
                                    <p><span className="font-medium">Work Details:</span> {selectedVolunteer.workDetails}</p>
                                )}
                            </div>
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={closeVolunteerDetails}
                                    className={`rounded-md px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VolunteerPage;