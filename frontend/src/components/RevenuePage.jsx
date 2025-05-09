import React, { useState, useEffect, useContext } from 'react';
import { X, DollarSign, CalendarDays, CircleDollarSign } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import { DarkmodeContext } from '../context/DarkmodeContext';
import axios from 'axios';

// Reusable Card Component
const Card = ({ title, children, className, onClick }) => {
    const { isDarkMode } = useContext(DarkmodeContext);
    return (
        <div
            className={`rounded-xl shadow-md p-6 border cursor-pointer ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-white/10'} ${className}`}
            onClick={onClick}>
            <h3 className={`text-lg font-semibold text-center ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'} mb-4`}>{title}</h3>
            {children}</div>);
};
// Calculation Modal
const InvestmentCalculationDisplay = ({ title, calculation, onClose, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700';
    const fontWeight = 'font-semibold';
    const rowBgLight = isDarkMode ? 'bg-gray-50 dark:bg-gray-800' : 'bg-[#f8f4f0]';
    const rowBgDark = isDarkMode ? 'bg-white dark:bg-gray-700' : 'bg-[#f2ebe1]';
    const totalTextColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-[#664C36]';
    const headerTextColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-[#664C36]'; // Changed header text color
    const valueTextColor = isDarkMode ? 'text-gray-800 dark:text-gray-200' : 'text-[#503a2d]';
    const modalBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const titleColor = isDarkMode ? 'text-gray-200' : '#A2574F'; // Keep the title color
    const closeButtonColor = isDarkMode ? 'text-white hover:text-gray-300' : 'text-[#664C36] hover:text-[#3d2d24]';
    const headerBgColor = isDarkMode ? 'bg-gray-600' : '#A2574F'; // New header background color
    if (title === "Average Order Value Calculation") {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                <div className={`w-[90%] md:w-[400px] rounded-xl shadow-lg p-6 border relative ${modalBg}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`text-xl ${fontWeight} ${titleColor} mb-4 text-center underline flex-grow`}>{title}</h3>
                        <button onClick={onClose} className={`p-1 rounded-full hover:bg-gray-200 ${closeButtonColor}`}>
                            <X className="w-5 h-5" />
                        </button></div>
                    <div className="space-y-3">
                        <div className={`flex justify-between ${rowBgLight} py-2 px-3 rounded-md`}>
                            <span className={`${fontWeight} ${textColor}`}>Total Investment:</span>
                            <span className={`${valueTextColor}`}> ${calculation.productDetails.find(item => item.name === 'Total Investment')?.totalValue?.toFixed(2) || '0.00'} </span>
                        </div>
                        <div className={`flex justify-between ${rowBgLight} py-2 px-3 rounded-md`}>
                            <span className={`${fontWeight} ${textColor}`}>Total Orders:</span>
                            <span className={`${valueTextColor}`}> {calculation.productDetails.find(item => item.name === 'Total Orders')?.totalValue || '0'} </span>
                        </div>
                        <div className={`flex justify-between ${isDarkMode ? 'bg-gray-100 dark:bg-gray-800' : 'bg-[#f6ebe3]'} py-2 px-3 rounded-md`}>
                            <span className={`text-lg ${fontWeight} ${totalTextColor}`}>Average Order Value:</span>
                            <span className={`text-lg ${fontWeight} ${totalTextColor}`}>${calculation.totalPurchaseValue ? calculation.totalPurchaseValue.toFixed(2) : '0.00'}</span>
                        </div>
                    </div>
                </div>
            </div>);
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
            <div className={`w-[90%] md:w-[600px] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6 border relative ${modalBg}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl ${fontWeight} ${titleColor} mb-4 text-center underline flex-grow`}>{title}</h3>
                    <button onClick={onClose} className={`p-1 rounded-full hover:bg-gray-200 ${closeButtonColor}`}> <X className="w-5 h-5" /> </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`${headerBgColor}`}> {/* Added header background color */}
                                <th className={`py-2 px-3 text-sm ${fontWeight} ${headerTextColor}`}>Product Name</th>
                                <th className={`py-2 px-3 text-sm ${fontWeight} ${headerTextColor}`}>Purchase Date</th>
                                <th className={`py-2 px-3 text-sm ${fontWeight} ${headerTextColor}`}>Purchase Month</th>
                                <th className={`py-2 px-3 text-sm ${fontWeight} ${headerTextColor}`}>Purchase Cost</th>
                                <th className={`py-2 px-3 text-sm ${fontWeight} ${headerTextColor}`}>Stock Quantity</th>
                                <th className={`py-2 px-3 text-sm ${fontWeight} ${headerTextColor}`}>Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {calculation.productDetails && calculation.productDetails.map((product, index) => (
                                <tr key={index} className={index % 2 === 0 ? rowBgLight : rowBgDark}> {/* Alternating row colors */}
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>{product.name}</td>
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>
                                        {product.productAddDate ? new Date(product.productAddDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>
                                        {product.productAddDate ? new Date(product.productAddDate).toLocaleString('en-US', { month: 'long' }) : 'N/A'}
                                    </td>
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>${product.purchaseCost ? product.purchaseCost.toFixed(2) : '0.00'}</td>
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>{product.stockQuantity}</td>
                                    <td className={`py-2 px-3 text-sm ${fontWeight} ${valueTextColor}`}>${product.totalValue ? product.totalValue.toFixed(2) : '0.00'}</td>
                                </tr>))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="5" className={`py-2 px-3 text-lg ${fontWeight} ${totalTextColor} text-right`}>Total:</td>
                                <td className={`py-2 px-3 text-lg ${fontWeight} ${totalTextColor}`}>${calculation.totalPurchaseValue ? calculation.totalPurchaseValue.toFixed(2) : '0.00'}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};
// Revenue CalculationDisplay for Order Details
const TotalRevenueDetailsModal = ({ isOpen, onClose, orderDetails, loading, error, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700';
    const fontWeight = 'font-semibold';
    const rowBgLight = isDarkMode ? 'bg-gray-50 dark:bg-gray-800' : 'bg-[#f8f4f0]';
    const rowBgDark = isDarkMode ? 'bg-white dark:bg-gray-700' : 'bg-[#f2ebe1]';
    const headerTextColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-[#664C36]'; // Changed header text color
    const valueTextColor = isDarkMode ? 'text-gray-800 dark:text-gray-200' : 'text-[#503a2d]';
    const modalBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const titleColor = isDarkMode ? 'text-gray-200' : '#A2574F'; // Keep the title color
    const closeButtonColor = isDarkMode ? 'text-white hover:text-gray-300' : 'text-[#664C36] hover:text-[#3d2d24]';
    const headerBgColor = isDarkMode ? 'bg-gray-600' : '#A2574F'; // New header background color

    if (!isOpen) {
        return null;
    }
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                <div className={`w-[90%] md:w-[600px] rounded-xl shadow-lg p-6 border relative ${modalBg}`}>
                    <h3 className={`text-xl font-semibold text-center ${titleColor} mb-4`}>Loading Order Details...</h3>
                </div>
            </div>);
    }
    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                <div className={`w-[90%] md:w-[600px] rounded-xl shadow-lg p-6 border relative ${modalBg}`}>
                    <h3 className={`text-xl font-semibold text-center ${titleColor} mb-4`}>Error Loading Order Details</h3>
                    <p className="text-red-500">{error}</p>
                    <button onClick={onClose} className={`mt-4 p-2 rounded-md bg-gray-200 ${textColor}`}>Close</button>
                </div>
            </div>);
    }
    const totalPoints = orderDetails.reduce((sum, order) => sum + (order.totalPoints || 0), 0);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
            <div className={`w-[90%] md:w-[90%] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6 border relative ${modalBg}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl ${fontWeight} ${titleColor} mb-4 text-center underline flex-grow`}>Total Revenue History</h3>
                    <button onClick={onClose} className={`p-1 rounded-full hover:bg-gray-200 ${closeButtonColor}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`${headerBgColor}`}>
                                <th className={`py-2 px-3 pl-17 text-sm ${fontWeight} ${headerTextColor}`}>Order ID</th>
                                <th className={`py-2 px-3 pl-18 text-sm ${fontWeight} ${headerTextColor}`}>User ID</th>
                                <th className={`py-2 px-1 pl-10 text-sm ${fontWeight} ${headerTextColor}`}>Created At</th>
                                <th className={`py-2 px-0.3 text-sm ${fontWeight} ${headerTextColor}`}>Total Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.map((order, index) => (
                                <tr key={order._id} className={index % 2 === 0 ? rowBgLight : rowBgDark}> {/* Alternating row colors */}
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>{order._id}</td>
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>{order.userId}</td>
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>{new Date(order.createdAt).toLocaleString()}</td>
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>${order.totalPoints ? order.totalPoints.toFixed(2) : '0.00'}</td> {/* Added dollar sign */}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className={`py-2 px-3 text-lg ${fontWeight} ${headerTextColor} text-right`}>Total:</td>
                                <td className={`py-2 px-3 text-lg ${fontWeight} ${valueTextColor}`}>${totalPoints.toFixed(2)}</td> {/* Added dollar sign */}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Monthly Revenue Details Modal
const MonthlyRevenueDetailsModal = ({ isOpen, onClose, orderDetails, loading, error, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700';
    const fontWeight = 'font-semibold';
    const rowBgLight = isDarkMode ? 'bg-gray-50 dark:bg-gray-800' : 'bg-[#f8f4f0]'; // Keep the existing light row background
    const rowBgDark = isDarkMode ? 'bg-white dark:bg-gray-700' : 'bg-[#f2ebe1]';   // Keep the existing dark row background
    const headerTextColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-[#664C36]'; // Changed header text color
    const valueTextColor = isDarkMode ? 'text-gray-800 dark:text-gray-200' : 'text-[#503a2d]';
    const modalBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const titleColor = isDarkMode ? 'text-gray-200' : '#A2574F'; // Keep the title color
    const closeButtonColor = isDarkMode ? 'text-white hover:text-gray-300' : 'text-[#664C36] hover:text-[#3d2d24]';
    const headerBgColor = isDarkMode ? 'bg-gray-600' : '#A2574F'; // New header background color

    if (!isOpen) return null;
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                <div className={`w-[90%] md:w-[90%] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6 border relative ${modalBg}`}>
                    <h3 className={`text-xl font-semibold text-center ${titleColor} mb-4`}>
                        Loading Monthly Revenue Details...
                    </h3>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                <div className={`w-[90%] md:w-[90%] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6 border relative ${modalBg}`}>
                    <h3 className={`text-xl font-semibold text-center ${titleColor} mb-4`}>Error Loading Monthly Revenue Details</h3>
                    <p className="text-red-500">{error}</p>
                    <button onClick={onClose} className={`mt-4 p-2 rounded-md bg-gray-200 ${textColor}`}>Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
            <div className={`w-[90%] md:w-[90%] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6 border relative ${modalBg}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl ${fontWeight} ${titleColor} mb-4 text-center underline flex-grow`}>
                        Monthly Revenue Details
                    </h3>
                    <button onClick={onClose} className={`p-1 rounded-full hover:bg-gray-200 ${closeButtonColor}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className={`py-2 px-3 pl-18 text-sm ${fontWeight} ${headerTextColor}`}>Order ID</th>
                                <th className={`py-2 px-1 text-sm ${fontWeight} ${headerTextColor}`}>Order Date</th>
                                <th className={`py-2 px-0 text-sm ${fontWeight} ${headerTextColor}`}>Selling Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.map((order, index) => (
                                <tr key={order._id} className={index % 2 === 0 ? rowBgLight : rowBgDark}> 
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>{order._id}</td>
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>
                                        {order.totalPoints ? `$${order.totalPoints.toFixed(2)}` : '$0.00'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2" className={`py-2 px-3 text-lg ${fontWeight} ${headerTextColor} text-right`}>Total:</td>
                                <td className={`py-2 px-3 text-lg ${fontWeight} ${valueTextColor}`}>
                                    {orderDetails.reduce((sum, order) => sum + (order.totalPoints || 0), 0).toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};
// Weekly Revenue Details Modal
const WeeklyRevenueDetailsModal = ({ isOpen, onClose, orderDetails, loading, error, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700';
    const fontWeight = 'font-semibold';
    const rowBgLight = isDarkMode ? 'bg-gray-50 dark:bg-gray-800' : 'bg-[#f8f4f0]';
    const rowBgDark = isDarkMode ? 'bg-white dark:bg-gray-700' : 'bg-[#f2ebe1]';
    const headerTextColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-[#664C36]';
    const valueTextColor = isDarkMode ? 'text-gray-800 dark:text-gray-200' : 'text-[#503a2d]';
    const modalBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const titleColor = isDarkMode ? 'text-gray-200' : '#A2574F'; // Keep the title color
    const closeButtonColor = isDarkMode ? 'text-white hover:text-gray-300' : 'text-[#664C36] hover:text-[#3d2d24]';
    const headerBgColor = isDarkMode ? 'bg-gray-600' : '#A2574F'; // New header background color

    if (!isOpen) return null;
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                <div className={`w-[90%] md:w-[90%] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6 border relative ${modalBg}`}>
                    <h3 className={`text-xl font-semibold text-center ${titleColor} mb-4`}>
                        Loading Weekly Revenue Details...
                    </h3>
                </div>
            </div>);
    }
    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                <div className={`w-[90%] md:w-[90%] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6 border relative ${modalBg}`}>
                    <h3 className={`text-xl font-semibold text-center ${titleColor} mb-4`}> Error Loading Weekly Revenue Details </h3>
                    <p className="text-red-500">{error}</p>
                    <button onClick={onClose} className={`mt-4 p-2 rounded-md bg-gray-200 ${textColor}`}> Close </button>
                </div>
            </div>);
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
            <div className={`w-[90%] md:w-[90%] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6 border relative ${modalBg}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl ${fontWeight} ${titleColor} mb-4 text-center underline flex-grow`}>
                        Weekly Revenue Details
                    </h3>
                    <button onClick={onClose} className={`p-1 rounded-full hover:bg-gray-200 ${closeButtonColor}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`${headerBgColor}`}>
                                <th className={`py-2 px-3 pl-17 text-sm ${fontWeight} ${headerTextColor}`}>Order ID</th>
                                <th className={`py-2 px-1.5 text-sm ${fontWeight} ${headerTextColor}`}>Order Date</th>
                                <th className={`py-2 px-1 text-sm ${fontWeight} ${headerTextColor}`}>Order Day</th> {/* Added Day Column */}
                                <th className={`py-2 px-1 text-sm ${fontWeight} ${headerTextColor}`}>Selling Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.map((order, index) => {
                                const createdAt = new Date(order.createdAt);
                                const date = createdAt.toLocaleDateString();
                                const day = createdAt.toLocaleDateString('en-US', { weekday: 'long' }); 
                                return (
                                    <tr key={order._id} className={index % 2 === 0 ? rowBgLight : rowBgDark}>
                                        <td className={`py-2 px-3 text-sm ${valueTextColor}`}>{order._id}</td>
                                        <td className={`py-2 px-3 text-sm ${valueTextColor}`}>{date}</td>
                                        <td className={`py-2 px-3 text-sm ${valueTextColor}`}>{day}</td> {/* Display Day */}
                                        <td className={`py-2 px-3 text-sm ${valueTextColor}`}>
                                            ${order.totalPoints ? order.totalPoints.toFixed(2) : '0.00'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className={`py-2 px-3 text-lg ${fontWeight} ${headerTextColor} text-right`}>Total:</td> {/* Adjusted colSpan */}
                                <td className={`py-2 px-3 text-lg ${fontWeight} ${valueTextColor}`}>
                                    ${orderDetails.reduce((sum, order) => sum + (order.totalPoints || 0), 0).toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

const RevenuePage = () => {
    const { isDarkMode } = useContext(DarkmodeContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('Revenue');
    const [orders, setOrders] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(null);
    const [showTotalRevenueDetails, setShowTotalRevenueDetails] = useState(false);
    const [totalRevenueOrderDetails, setTotalRevenueOrderDetails] = useState([]);
    const [loadingTotalRevenueDetails, setLoadingTotalRevenueDetails] = useState(false);
    const [errorTotalRevenueDetails, setErrorTotalRevenueDetails] = useState(null);
    const [loadingTotalRevenue, setLoadingTotalRevenue] = useState(true);
    const [errorTotalRevenue, setErrorTotalRevenue] = useState(null);
    const [showCalculation, setShowCalculation] = useState(null);
    const [calculationDetails, setCalculationDetails] = useState({ productDetails: [], totalPurchaseValue: 0 });
    const [totalPurchaseValue, setTotalPurchaseValue] = useState(null);
    const [productPurchaseDetails, setProductPurchaseDetails] = useState([]);
    const [loadingTotalPurchaseValue, setLoadingTotalPurchaseValue] = useState(true);
    const [errorTotalPurchaseValue, setErrorTotalPurchaseValue] = useState(null);
    const [orderedPurchaseCost, setOrderedPurchaseCost] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState(null);
    const [loadingMonthlyRevenue, setLoadingMonthlyRevenue] = useState(true);
    const [errorMonthlyRevenue, setErrorMonthlyRevenue] = useState(null);
    const [weeklyRevenue, setWeeklyRevenue] = useState(null);
    const [loadingWeeklyRevenue, setLoadingWeeklyRevenue] = useState(true);
    const [errorWeeklyRevenue, setErrorWeeklyRevenue] = useState(null);
    const [showWeeklyRevenueDetails, setShowWeeklyRevenueDetails] = useState(false);
    const [weeklyRevenueOrderDetails, setWeeklyRevenueOrderDetails] = useState([]);
    const [loadingWeeklyRevenueDetails, setLoadingWeeklyRevenueDetails] = useState(false);
    const [errorWeeklyRevenueDetails, setErrorWeeklyRevenueDetails] = useState(null);
    const [showMonthlyRevenueDetails, setShowMonthlyRevenueDetails] = useState(false);
    const [monthlyRevenueOrderDetails, setMonthlyRevenueOrderDetails] = useState([]);
    const [loadingMonthlyRevenueDetails, setLoadingMonthlyRevenueDetails] = useState(false);
    const [errorMonthlyRevenueDetails, setErrorMonthlyRevenueDetails] = useState(null);
    const backendUrl = 'http://localhost:4000';
    const handleCardClick = (title) => {
        setShowCalculation(title);
        if (title === 'Total Revenue') {
            setShowTotalRevenueDetails(true);
            fetchTotalRevenueOrderDetails();
        } else if (title === 'Weekly Revenue') {
            setShowWeeklyRevenueDetails(true);
            fetchWeeklyRevenueOrderDetails();
        } else if (title === 'Monthly Revenue') {
            setShowMonthlyRevenueDetails(true);
            fetchMonthlyRevenueOrderDetails();
        }
    };

    useEffect(() => {
        const fetchTotalPurchaseValueDetails = async () => {
            setLoadingTotalPurchaseValue(true);
            setErrorTotalPurchaseValue(null);
            try {
                const response = await fetch('http://localhost:4000/api/products/total-purchase-value/details');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTotalPurchaseValue(data.totalPurchaseValue);
                setProductPurchaseDetails(data.productDetails);
                setCalculationDetails(data);
            } catch (error) {
                console.error('Error fetching total purchase value details:', error);
                setErrorTotalPurchaseValue('Failed to fetch total purchase value details.');
            } finally {
                setLoadingTotalPurchaseValue(false);
            }
        };

        const fetchTotalRevenueOrderDetails = async () => {
            setLoadingTotalRevenueDetails(true);
            setErrorTotalRevenueDetails(null);
            try {
                const response = await axios.get(`${backendUrl}/api/orders/all`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    withCredentials: true,
                });
                console.log("Total Revenue Order Details Response:", response.data);
                if (response.data?.success && response.data.orders) {
                    console.log("Fetched Order Data:", response.data.orders);
                    setTotalRevenueOrderDetails(response.data.orders);
                    console.log("totalRevenueOrderDetails state updated:", totalRevenueOrderDetails);
                } else {
                    setErrorTotalRevenueDetails(response.data?.message || 'Failed to fetch order details for total revenue.');
                }
            } catch (error) {
                console.error('Error fetching order details for total revenue:', error);
                setErrorTotalRevenueDetails(error.message || 'An error occurred while fetching order details.');
            } finally {
                setLoadingTotalRevenueDetails(false);
            }
        };
        const fetchAllOrdersForRevenue = async () => {
            setLoadingTotalRevenue(true);
            setErrorTotalRevenue(null);
            try {
                const response = await axios.get(`${backendUrl}/api/orders/all`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    withCredentials: true,
                });
                console.log("Orders API Response:", response.data);
                if (response.data?.success && response.data.orders) {
                    console.log("Fetched Orders:", response.data.orders);
                    setOrders(response.data.orders);
                    const calculatedTotalRevenue = response.data.orders.reduce((sum, order) => {
                        console.log("Current Order Total Points:", order.totalPoints);
                        return sum + (order.totalPoints || 0);
                    }, 0);
                    console.log("Calculated Total Revenue (from totalPoints):", calculatedTotalRevenue);
                    setTotalRevenue(calculatedTotalRevenue);
                    // Calculate Ordered Purchase Cost
                    let calculatedOrderedPurchaseCost = 0;
                    for (const order of response.data.orders) {
                        console.log("Processing Order ID:", order._id);
                        if (order.orderItems && Array.isArray(order.orderItems)) {
                            for (const item of order.orderItems) {
                                console.log("Processing Order Item:", item);
                                // Assuming your order item has productId and quantity
                                const productResponse = await axios.get(`${backendUrl}/api/products/${item.productId}`);
                                console.log("Product Details Response:", productResponse.data);
                                if (productResponse.data?.success && productResponse.data.product) {
                                    const purchaseCost = productResponse.data.product.purchaseCost || 0;
                                    const quantity = item.quantity || 0;
                                    const itemPurchaseCost = purchaseCost * quantity;
                                    console.log(`Item: ${productResponse.data.product.name}, Purchase Cost: ${purchaseCost}, Quantity: ${quantity}, Item Purchase Cost: ${itemPurchaseCost}`);
                                    calculatedOrderedPurchaseCost += itemPurchaseCost;
                                } else {
                                    console.warn(`Could not fetch product details for ID: ${item.productId}`);
                                }
                            }
                        }
                        console.log("Ordered Purchase Cost for Order ID:", order._id, "is", calculatedOrderedPurchaseCost);
                    }
                    setOrderedPurchaseCost(calculatedOrderedPurchaseCost);
                    console.log("Calculated Total Ordered Purchase Cost:", calculatedOrderedPurchaseCost);

                } else {
                    setErrorTotalRevenue(response.data?.message || 'Failed to fetch orders for revenue calculation.');
                }
            } catch (error) {
                console.error('Error fetching orders for revenue:', error);
                setErrorTotalRevenue(error.message || 'An error occurred while fetching orders for revenue.');
            } finally {
                setLoadingTotalRevenue(false);
            }
        };
        const fetchMonthlyRevenue = async () => {
            setLoadingMonthlyRevenue(true);
            setErrorMonthlyRevenue(null);
            try {
                const response = await axios.get(`${backendUrl}/api/orders/all`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    withCredentials: true,
                });
                console.log("All Orders Response for Monthly Revenue:", response.data);
                if (response.data?.success && response.data.orders) {
                    const now = new Date();
                    const currentYear = now.getFullYear();
                    const currentMonth = now.getMonth();

                    const monthlyOrders = response.data.orders.filter(order => {
                        const createdAt = new Date(order.createdAt);
                        return createdAt.getFullYear() === currentYear && createdAt.getMonth() === currentMonth;
                    });

                    const calculatedMonthlyRevenue = monthlyOrders.reduce((sum, order) => sum + (order.totalPoints || 0), 0);
                    setMonthlyRevenue(calculatedMonthlyRevenue);
                } else {
                    setErrorMonthlyRevenue(response.data?.message || 'Failed to fetch orders for monthly revenue calculation.');
                }
            } catch (error) {
                console.error('Error fetching orders for monthly revenue:', error);
                setErrorMonthlyRevenue(error?.message || 'An error occurred while fetching orders for monthly revenue.');
            } finally {
                setLoadingMonthlyRevenue(false);
            }
        };
        const fetchMonthlyRevenueOrderDetails = async () => {
            setLoadingMonthlyRevenueDetails(true);
            setErrorMonthlyRevenueDetails(null);
            try {
                const response = await axios.get(`${backendUrl}/api/orders/all`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    withCredentials: true,
                });
                console.log("All Orders Response for Monthly Revenue Details:", response.data);
                if (response.data?.success && response.data.orders) {
                    const now = new Date();
                    const currentYear = now.getFullYear();
                    const currentMonth = now.getMonth();

                    const monthlyOrdersDetails = response.data.orders.filter(order => {
                        const createdAt = new Date(order.createdAt);
                        return createdAt.getFullYear() === currentYear && createdAt.getMonth() === currentMonth;
                    });
                    setMonthlyRevenueOrderDetails(monthlyOrdersDetails);
                } else {
                    setErrorMonthlyRevenueDetails(response.data?.message || 'Failed to fetch monthly order details.');
                }
            } catch (error) {
                console.error('Error fetching monthly order details:', error);
                setErrorMonthlyRevenueDetails(error?.message || 'An error occurred while fetching monthly order details.');
            } finally {
                setLoadingMonthlyRevenueDetails(false);
            }
        };
        const fetchWeeklyRevenue = async () => {
            setLoadingWeeklyRevenue(true);
            setErrorWeeklyRevenue(null);
            try {
                const response = await axios.get(`${backendUrl}/api/orders/all`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    withCredentials: true,
                });
                console.log("All Orders Response for Weekly Revenue:", response.data);
                if (response.data?.success && response.data.orders) {
                    const now = new Date();
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(now.getDate() - now.getDay()); 
                    startOfWeek.setHours(0, 0, 0, 0);
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    endOfWeek.setHours(23, 59, 59, 999);
                    const weeklyOrders = response.data.orders.filter(order => {
                        const createdAt = new Date(order.createdAt);
                        return createdAt >= startOfWeek && createdAt <= endOfWeek;
                    });

                    const calculatedWeeklyRevenue = weeklyOrders.reduce((sum, order) => sum + (order.totalPoints || 0), 0);
                    setWeeklyRevenue(calculatedWeeklyRevenue);
                } else {
                    setErrorWeeklyRevenue(response.data?.message || 'Failed to fetch orders for weekly revenue calculation.');
                }
            } catch (error) {
                console.error('Error fetching orders for weekly revenue:', error);
                setErrorWeeklyRevenue(error?.message || 'An error occurred while fetching orders for weekly revenue.');
            } finally {
                setLoadingWeeklyRevenue(false);
            }
        };

       const fetchWeeklyRevenueOrderDetails = async () => {
    setLoadingWeeklyRevenueDetails(true);
    setErrorWeeklyRevenueDetails(null);
    try {
        const response = await axios.get(`${backendUrl}/api/orders/all`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            withCredentials: true,
        });
        console.log("All Orders Response for Weekly Revenue Details:", response.data);
        if (response.data?.success && response.data.orders) {
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            const weeklyOrdersDetails = response.data.orders.filter(order => {
                const createdAt = new Date(order.createdAt);
                return createdAt >= startOfWeek && createdAt <= endOfWeek;
            });
            setWeeklyRevenueOrderDetails(weeklyOrdersDetails);
        } else {
            setErrorWeeklyRevenueDetails(response.data?.message || 'Failed to fetch weekly order details.');
        }
    } catch (error) {
        console.error('Error fetching weekly order details:', error);
        setErrorWeeklyRevenueDetails(error?.message || 'An error occurred while fetching weekly order details.');
    } finally {
        setLoadingWeeklyRevenueDetails(false);
    }
};
        fetchTotalPurchaseValueDetails();
        fetchAllOrdersForRevenue();
        fetchTotalRevenueOrderDetails()
        fetchMonthlyRevenue();
        fetchMonthlyRevenueOrderDetails();
        fetchWeeklyRevenue();
        fetchWeeklyRevenueOrderDetails();
    }, [backendUrl]);
    const totalProfit = orders.reduce((sum, order) => sum + (order.revenue - order.cost), 0);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    const monthlyOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });
    const monthlyInvestment = monthlyOrders.reduce((sum, order) => sum + order.revenue, 0);
    const monthlyProfit = monthlyOrders.reduce((sum, order) => sum + (order.revenue - order.cost), 0);
    const weeklyOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= startOfWeek && orderDate <= endOfWeek;
    });
    const weeklyProfit = weeklyOrders.reduce((sum, order) => sum + (order.revenue - order.cost), 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const totalOrdersCount = orders.length;
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const handleCloseCalculation = () => {
        setShowCalculation(null);
    };
    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-[#F5F5F5]'}`}>
            <AdminNavbar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <div className="flex-1 p-6">
                <h2 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-[#64332d]'} mb-8`}><u>Revenue & Profit Overview</u></h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card title="Total Investment" onClick={() => handleCardClick("Total Investment")}>
                        <div className="flex items-center justify-center">
                            <DollarSign className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                            {loadingTotalPurchaseValue ? (
                                <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>Loading...</p>
                            ) : errorTotalPurchaseValue ? (
                                <p className={`text-red-500`}>{errorTotalPurchaseValue}</p>
                            ) : (
                                <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${totalPurchaseValue ? totalPurchaseValue.toFixed(2) : '0.00'}</p>
                            )}
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total purchase value of all products in stock.</p>
                    </Card>
                    <Card title="Total Revenue" onClick={() => handleCardClick("Total Revenue")}>
                        <div className="flex items-center justify-center">
                            <DollarSign className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            {loadingTotalRevenue ? (
                                <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>Loading...</p>
                            ) : errorTotalRevenue ? (
                                <p className={`text-red-500`}>{errorTotalRevenue}</p>
                            ) : (
                                <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${totalRevenue !== null ? totalRevenue.toFixed(2) : '0.00'}</p>
                            )}
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total revenue generated from all orders.</p>
                    </Card>
                    <Card title="Total Profit" onClick={() => handleCardClick("Total Profit")}>
                        <div className="flex items-center justify-center">
                            <DollarSign className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${totalProfit.toFixed(2)}</p>
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total profit after deducting costs.</p>
                    </Card>
                    <Card title="Average Order Value" onClick={() => handleCardClick("Average Order Value")}>
                        <div className="flex items-center justify-center">
                            <DollarSign className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${averageOrderValue.toFixed(2) || '0.00'}</p>
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average revenue generated per order.</p>
                    </Card>
                    <Card title="Monthly Profit" onClick={() => handleCardClick("Monthly Profit")}>
                        <div className="flex items-center justify-center">
                            <CalendarDays className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>{monthlyProfit.toFixed(2)}</p>
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Profit for the current month (April 2025).</p>
                    </Card>
                    <Card title="Weekly Revenue" onClick={() => handleCardClick("Weekly Revenue")}>
                        <div className="flex items-center justify-center">
                            <CircleDollarSign className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${weeklyRevenue !== null ? weeklyRevenue.toFixed(2) : '0.00'}</p>
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Revenue for the current week (starting Sunday).</p>
                    </Card>
                    <Card title="Weekly Profit" onClick={() => handleCardClick("Weekly Profit")}>
                        <div className="flex items-center justify-center">
                            <CircleDollarSign className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-lime-400' : 'text-lime-600'}`} />
                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${weeklyProfit.toFixed(2)}</p>
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Profit for the current week (starting Sunday).</p>
                    </Card>
                    <Card title="Ordered Purchase Cost" onClick={() => handleCardClick("Ordered Purchase Cost")}>
                        <div className="flex items-center justify-center">
                            <DollarSign className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${orderedPurchaseCost.toFixed(2)}</p>
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total purchase cost of all items in the placed orders.</p>
                    </Card>
                    <Card title="Monthly Revenue" onClick={() => handleCardClick("Monthly Revenue")}>
                        <div className="flex items-center justify-center">
                            <CalendarDays className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                            {loadingMonthlyRevenue ? (
                                <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>Loading...</p>
                            ) : errorMonthlyRevenue ? (
                                <p className={`text-red-500`}>{errorMonthlyRevenue}</p>
                            ) : (
                                <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${monthlyRevenue !== null ? monthlyRevenue.toFixed(2) : '0.00'}</p>
                            )}
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Revenue for the current month (May 2025).</p>
                    </Card>
                </div>
                {showCalculation === 'Total Investment' && (
                    <InvestmentCalculationDisplay title="Total Investment History"
                        calculation={calculationDetails}
                        onClose={handleCloseCalculation}
                    />
                )}
                {showTotalRevenueDetails && (
                    <TotalRevenueDetailsModal
                        isOpen={showTotalRevenueDetails}
                        onClose={() => setShowTotalRevenueDetails(false)}
                        orderDetails={totalRevenueOrderDetails}
                        loading={loadingTotalRevenueDetails}
                        error={errorTotalRevenueDetails}
                        isDarkMode={isDarkMode}
                    />
                )}
                {showCalculation === 'Total Profit' && (
                    <InvestmentCalculationDisplay
                        title="Total Profit Calculation"
                        calculation={{
                            productDetails: orders.map(o => ({
                                name: `Order ID: ${o.id}`,
                                purchaseCost: o.cost,
                                stockQuantity: 1,
                                totalValue: o.revenue - o.cost,
                            })),
                            totalPurchaseValue: totalProfit,
                        }}
                        onClose={handleCloseCalculation}
                    />
                )}
                <MonthlyRevenueDetailsModal
                    isOpen={showMonthlyRevenueDetails}
                    onClose={() => setShowMonthlyRevenueDetails(false)}
                    orderDetails={monthlyRevenueOrderDetails}
                    loading={loadingMonthlyRevenueDetails}
                    error={errorMonthlyRevenueDetails}
                    isDarkMode={isDarkMode}
                />
                {showCalculation === 'Monthly Profit' && (
                    <InvestmentCalculationDisplay
                        title="Monthly Profit Calculation"
                        calculation={{
                            productDetails: monthlyOrders.map(o => ({
                                name: `Order ID: ${o.id}`,
                                purchaseCost: o.cost,
                                stockQuantity: 1,
                                totalValue: o.revenue - o.cost,
                            })),
                            totalPurchaseValue: monthlyProfit,
                        }}
                        onClose={handleCloseCalculation}
                    />
                )}
                <WeeklyRevenueDetailsModal
                    isOpen={showWeeklyRevenueDetails}
                    onClose={() => setShowWeeklyRevenueDetails(false)}
                    orderDetails={weeklyRevenueOrderDetails}
                    loading={loadingWeeklyRevenueDetails}
                    error={errorWeeklyRevenueDetails}
                    isDarkMode={isDarkMode}
                />
                {showCalculation === 'Weekly Profit' && (
                    <InvestmentCalculationDisplay
                        title="Weekly Profit Calculation"
                        calculation={{
                            productDetails: weeklyOrders.map(o => ({
                                name: `Order ID: ${o.id}`,
                                purchaseCost: o.cost,
                                stockQuantity: 1,
                                totalValue: o.revenue - o.cost,
                            })),
                            totalPurchaseValue: weeklyProfit,
                        }}
                        onClose={handleCloseCalculation} />)}
                {showCalculation === 'Average Order Value' && (
                    <InvestmentCalculationDisplay
                        title="Average Order Value Calculation"
                        calculation={{
                            productDetails: [
                                { name: 'Total Investment', totalValue: totalRevenue },
                                { name: 'Total Orders', totalValue: totalOrdersCount },
                                { name: 'Average Order Value', totalValue: averageOrderValue },],
                            totalPurchaseValue: averageOrderValue,
                        }}
                        onClose={handleCloseCalculation} />
                )} </div> </div>);
};

export default RevenuePage;