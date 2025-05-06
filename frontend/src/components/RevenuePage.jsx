import React, { useState, useEffect, useContext } from 'react';
import { ArrowUp, ArrowDown, X, DollarSign, CalendarDays, Clock, CircleDollarSign, PackageCheck, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import { DarkmodeContext } from '../context/DarkmodeContext';

// Reusable Card Component
const Card = ({ title, children, className, onClick }) => {
    const { isDarkMode } = useContext(DarkmodeContext);
    return (
        <div
            className={`rounded-xl shadow-md p-6 border cursor-pointer ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-white/10'} ${className}`}
            onClick={onClick}
        >
            <h3 className={`text-lg font-semibold text-center ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'} mb-4`}>{title}</h3>
            {children}
        </div>
    );
};

// Calculation Modal
// Calculation Modal
const InvestmentCalculationDisplay = ({ title, calculation, onClose, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700';
    const fontWeight = 'font-semibold';
    const rowBgLight = isDarkMode ? 'bg-gray-50 dark:bg-gray-800' : 'bg-[#f8f4f0]';
    const rowBgDark = isDarkMode ? 'bg-white dark:bg-gray-700' : 'bg-[#f2ebe1]';
    const totalRowBg = isDarkMode ? 'bg-gray-100 dark:bg-gray-800' : 'bg-[#e4ccb8]';
    const totalTextColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-[#664C36]';
    const headerTextColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-[#664C36]';
    const valueTextColor = isDarkMode ? 'text-gray-800 dark:text-gray-200' : 'text-[#503a2d]';
    const modalBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const titleColor = isDarkMode ? 'text-gray-200' : 'text-[#A2574F]';
    const closeButtonColor = isDarkMode ? 'text-white hover:text-gray-300' : 'text-[#664C36] hover:text-[#3d2d24]';
    const borderBottomColor = isDarkMode ? 'border-gray-100 dark:border-gray-700' : 'border-gray-100';
    const modalContentBg = isDarkMode ? 'bg-white dark:bg-gray-800' : 'bg-white';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
            <div className={`w-[90%] md:w-[600px] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6 border relative ${modalBg}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl ${fontWeight} ${titleColor} mb-4 text-center underline flex-grow`}>{title}</h3>
                    <button onClick={onClose} className={`p-1 rounded-full hover:bg-gray-200 ${closeButtonColor}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
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
                                <tr key={index} className={`${index % 2 === 0 ? rowBgLight : rowBgDark}`}>
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
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className={`py-2 px-3 text-sm ${fontWeight} ${totalTextColor} text-right`}>Total:</td>
                                <td className={`py-2 px-3 text-sm ${fontWeight} ${totalTextColor}`}>${calculation.totalPurchaseValue ? calculation.totalPurchaseValue.toFixed(2) : '0.00'}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};


const MonthlyInvestmentCalculationDisplay = ({ title, calculation, onClose, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700';
    const fontWeight = 'font-semibold';
    const modalBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const titleColor = isDarkMode ? 'text-gray-200' : 'text-[#A2574F]';
    const closeButtonColor = isDarkMode ? 'text-white hover:text-gray-300' : 'text-[#664C36] hover:text-[#3d2d24]';
    const rowBgLight = isDarkMode ? 'bg-gray-50 dark:bg-gray-800' : 'bg-[#f8f4f0]';
    const rowBgDark = isDarkMode ? 'bg-white dark:bg-gray-700' : 'bg-[#f2ebe1]';
    const headerTextColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-[#664C36]';
    const valueTextColor = isDarkMode ? 'text-gray-800 dark:text-gray-200' : 'text-[#503a2d]';
    const totalTextColor = isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-[#664C36]';

    const getMonthName = (monthNumber) => {
        const date = new Date(2000, monthNumber - 1, 1); 
        return date.toLocaleString('default', { month: 'long' });
    };

    const monthName = calculation?.month ? getMonthName(calculation.month) : '';
    const formattedMonthYear = monthName ? `${monthName}-${calculation?.year}` : '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
            <div className={`w-[90%] md:w-[600px] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6 border relative ${modalBg}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl ${fontWeight} ${titleColor} mb-4 text-center underline flex-grow`}>{title}</h3>
                    <button onClick={onClose} className={`p-1 rounded-full hover:bg-gray-200 ${closeButtonColor}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <h4 className={`text-lg ${textColor} ${fontWeight} mb-2`}>
                        Month: {formattedMonthYear}
                    </h4>
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className={`py-2 px-3 text-sm ${fontWeight} ${headerTextColor}`}>Product Name</th>
                                <th className={`py-2 px-3 text-sm ${fontWeight} ${headerTextColor}`}>Purchase Date</th>
                                <th className={`py-2 px-3 text-sm ${fontWeight} ${headerTextColor}`}>Purchase Cost</th>
                                <th className={`py-2 px-3 text-sm ${fontWeight} ${headerTextColor}`}>Stock Quantity</th>
                                <th className={`py-2 px-3 text-sm ${fontWeight} ${headerTextColor}`}>Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {calculation?.productDetails?.map((product, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? rowBgLight : rowBgDark}`}>
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>{product.name}</td>
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>{new Date(product.productAddDate).toLocaleDateString()}</td>
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>${product.purchaseCost ? product.purchaseCost.toFixed(2) : '0.00'}</td>
                                    <td className={`py-2 px-3 text-sm ${valueTextColor}`}>{product.stockQuantity}</td>
                                    <td className={`py-2 px-3 text-sm ${fontWeight} ${valueTextColor}`}>${product.totalValue ? product.totalValue.toFixed(2) : '0.00'}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="4" className={`py-2 px-3 text-sm ${fontWeight} ${totalTextColor} text-right`}>Total:</td>
                                <td className={`py-2 px-3 text-sm ${fontWeight} ${totalTextColor}`}>${calculation?.totalPurchaseValue ? calculation.totalPurchaseValue.toFixed(2) : '0.00'}</td>
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
    const [monthlyPurchaseCostData, setMonthlyPurchaseCostData] = useState(null);
    const [monthlyInvestmentDetails, setMonthlyInvestmentDetails] = useState(null);
    const [loadingMonthlyInvestmentDetails, setLoadingMonthlyInvestmentDetails] = useState(true);
    const [errorMonthlyInvestmentDetails, setErrorMonthlyInvestmentDetails] = useState(null);
    const [loadingMonthlyPurchaseCost, setLoadingMonthlyPurchaseCost] = useState(true);
    const [errorMonthlyPurchaseCost, setErrorMonthlyPurchaseCost] = useState(null);
    const [orders, setOrders] = useState([
        { id: 1, date: '2025-04-15', items: 2, revenue: 25.00, cost: 15.00, status: 'Delivered' },
        { id: 2, date: '2025-04-16', items: 1, revenue: 12.50, cost: 7.50, status: 'Processing' },
        { id: 3, date: '2025-04-18', items: 3, revenue: 40.00, cost: 28.00, status: 'Delivered' },
        { id: 4, date: '2025-04-20', items: 1, revenue: 10.00, cost: 6.00, status: 'Shipped' },
        { id: 5, date: '2025-04-22', items: 2, revenue: 30.00, cost: 20.00, status: 'Delivered' },
        { id: 6, date: '2025-03-28', items: 1, revenue: 15.00, cost: 9.00, status: 'Delivered' },
        { id: 7, date: '2025-03-10', items: 4, revenue: 50.00, cost: 35.00, status: 'Completed' },
    ]);

    const [showCalculation, setShowCalculation] = useState(null);
    const [calculationDetails, setCalculationDetails] = useState({ productDetails: [], totalPurchaseValue: 0 });
    const [totalPurchaseValue, setTotalPurchaseValue] = useState(null);
    const [productPurchaseDetails, setProductPurchaseDetails] = useState([]);
    const [loadingTotalPurchaseValue, setLoadingTotalPurchaseValue] = useState(true);
    const [errorTotalPurchaseValue, setErrorTotalPurchaseValue] = useState(null);

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

        const fetchMonthlyPurchaseCost = async () => {
            setLoadingMonthlyPurchaseCost(true);
            setErrorMonthlyPurchaseCost(null);

            try {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1;

                const response = await fetch(`http://localhost:4000/api/products/monthly-purchase-cost?year=${year}&month=${month}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMonthlyPurchaseCostData(data);
            } catch (error) {
                console.error('Error fetching monthly purchase cost:', error);
                setErrorMonthlyPurchaseCost('Failed to fetch monthly purchase cost.');
            } finally {
                setLoadingMonthlyPurchaseCost(false);
            }
        };

        const fetchDetailedMonthlyPurchaseCost = async () => {
            setLoadingMonthlyInvestmentDetails(true);
            setErrorMonthlyInvestmentDetails(null);

            try {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1;

                const response = await fetch(`http://localhost:4000/api/products/monthly-purchase-cost/details?year=${year}&month=${month}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMonthlyInvestmentDetails(data);
            } catch (error) {
                console.error('Error fetching detailed monthly purchase cost:', error);
                setErrorMonthlyInvestmentDetails('Failed to fetch detailed monthly purchase cost.');
            } finally {
                setLoadingMonthlyInvestmentDetails(false);
            }
        };
        fetchTotalPurchaseValueDetails();
        fetchMonthlyPurchaseCost();
        fetchDetailedMonthlyPurchaseCost()
    }, []);

    const totalRevenue = orders.reduce((sum, order) => sum + order.revenue, 0);
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
    const weeklyRevenue = weeklyOrders.reduce((sum, order) => sum + order.revenue, 0);
    const weeklyProfit = weeklyOrders.reduce((sum, order) => sum + (order.revenue - order.cost), 0);

    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const totalOrdersCount = orders.length;

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleCardClick = (title) => {
        setShowCalculation(title);
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
                    <Card title="Total Profit" onClick={() => handleCardClick("Total Profit")}>
                        <div className="flex items-center justify-center">
                            <DollarSign className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${totalProfit.toFixed(2)}</p>
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total profit after deducting costs.</p>
                    </Card>
                    <Card title="Monthly Investment" onClick={() => handleCardClick("Monthly Investment")}>
                        <div className="flex items-center justify-center">
                            <CalendarDays className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                            {loadingMonthlyPurchaseCost ? (
                                <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>Loading...</p>
                            ) : errorMonthlyPurchaseCost ? (
                                <p className={`text-red-500`}>{errorMonthlyPurchaseCost}</p>
                            ) : (
                                <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${monthlyPurchaseCostData?.monthlyPurchaseCost ? monthlyPurchaseCostData.monthlyPurchaseCost.toFixed(2) : '0.00'}</p>
                            )}
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total purchase cost for the current month ({new Date().toLocaleString('default', { month: 'long' })}).</p>
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
                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${weeklyRevenue.toFixed(2)}</p>
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
                    <Card title="Average Order Value" onClick={() => handleCardClick("Average Order Value")}>
                        <div className="flex items-center justify-center">
                            <DollarSign className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${averageOrderValue.toFixed(2) || '0.00'}</p>
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average revenue generated per order.</p>
                    </Card>
                    <Card title="Total Orders" onClick={() => handleCardClick("Total Orders")}>
                        <div className="flex items-center justify-center">
                            <span className={`w-8 h-8 mr-2 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#e4ccb8] text-[#664C36]'}`}>
                                {totalOrdersCount}
                            </span>
                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>{totalOrdersCount}</p>
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total number of orders placed.</p>
                    </Card>
                </div>

                {showCalculation === 'Total Investment' && (
                    <InvestmentCalculationDisplay title="Total Investment History"
                        calculation={calculationDetails}
                        onClose={handleCloseCalculation}
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

                {showCalculation === 'Monthly Investment' && (
                    <MonthlyInvestmentCalculationDisplay
                        title="Monthly Investment History"
                        calculation={monthlyInvestmentDetails}
                        onClose={handleCloseCalculation}
                        isDarkMode={isDarkMode}
                    />
                )}

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

                {showCalculation === 'Weekly Revenue' && (
                    <InvestmentCalculationDisplay
                        title="Weekly Reven"
                        calculation={{
                            productDetails: weeklyOrders.map(o => ({
                                name: `Order ID: ${o.id}`,
                                purchaseCost: 0,
                                stockQuantity: 1,
                                totalValue: o.revenue,
                            })),
                            totalPurchaseValue: weeklyRevenue,
                        }}
                        onClose={handleCloseCalculation}
                    />
                )}

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
                        onClose={handleCloseCalculation}
                    />
                )}

                {showCalculation === 'Average Order Value' && (
                    <InvestmentCalculationDisplay
                        title="Average Order Value Calculation"
                        calculation={{
                            productDetails: [
                                { name: 'Total Investment', purchaseCost: 0, stockQuantity: 1, totalValue: totalRevenue },
                                { name: 'Total Orders', purchaseCost: 0, stockQuantity: 1, totalValue: totalOrdersCount },
                                { name: 'Average Order Value', purchaseCost: 0, stockQuantity: 1, totalValue: averageOrderValue },
                            ],
                            totalPurchaseValue: averageOrderValue,
                        }}
                        onClose={handleCloseCalculation}
                    />
                )}

                {showCalculation === 'Total Orders' && (
                    <InvestmentCalculationDisplay
                        title="Total Orders Calculation"
                        calculation={{
                            productDetails: orders.map(o => ({
                                name: `Order ID: ${o.id}`,
                                purchaseCost: 0,
                                stockQuantity: 1,
                                totalValue: 1,
                            })),
                            totalPurchaseValue: totalOrdersCount,
                        }}
                        onClose={handleCloseCalculation}
                    />
                )}


            </div>
        </div>
    );
};

export default RevenuePage;