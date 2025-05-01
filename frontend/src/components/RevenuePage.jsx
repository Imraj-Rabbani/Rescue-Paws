import React, { useState, useEffect, useContext } from 'react';
import { ArrowUp, ArrowDown, DollarSign, CalendarDays, Clock, CircleDollarSign, PackageCheck, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import { DarkmodeContext } from '../context/DarkmodeContext';

// --- Helper Components ---

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

// Calculation Display Component
const CalculationDisplay = ({ title, calculation, onClose }) => {
    return (
        <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-lg rounded-md p-6 z-50 max-h-[80vh] overflow-y-auto`}>
            <h3 className={`text-xl font-semibold mb-4 text-[#A2574F]`}>{title} Calculation</h3>
            <pre className={`whitespace-pre-wrap break-words text-sm text-gray-700 font-family: 'Arial', sans-serif; line-height: 1.4;`}>
                {calculation}
            </pre>
            <button onClick={onClose} className={`mt-4 px-4 py-2 rounded-md bg-[#e4ccb8] text-[#664C36] hover:bg-[#d1b39d]`}>Close</button>
        </div>
    );
};

const RevenuePage = () => {
    const { isDarkMode } = useContext(DarkmodeContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('Revenue');
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
    const [calculationDetails, setCalculationDetails] = useState('');

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
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.revenue, 0);
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
        let details = '';
        switch (title) {
            case 'Total Revenue':
                details = orders.map(order => `Order ID: ${order.id}\nRevenue: $${order.revenue.toFixed(2)}`).join('\n\n');
                details += `\n\n--------------------\nTotal Revenue = $${totalRevenue.toFixed(2)}`;
                break;
            case 'Total Profit':
                details = orders.map(order => `Order ID: ${order.id}\nRevenue: $${order.revenue.toFixed(2)}\nCost: $${order.cost.toFixed(2)}\nProfit: $${(order.revenue - order.cost).toFixed(2)}`).join('\n\n');
                details += `\n\n--------------------\nTotal Profit = $${totalProfit.toFixed(2)}`;
                break;
            case 'Monthly Revenue':
                details = monthlyOrders.map(order => `Order ID: ${order.id}\nDate: ${order.date}\nRevenue: $${order.revenue.toFixed(2)}`).join('\n\n');
                details += `\n\n--------------------\nMonthly Revenue (April 2025) = $${monthlyRevenue.toFixed(2)}`;
                break;
            case 'Monthly Profit':
                details = monthlyOrders.map(order => `Order ID: ${order.id}\nDate: ${order.date}\nRevenue: $${order.revenue.toFixed(2)}\nCost: $${order.cost.toFixed(2)}\nProfit: $${(order.revenue - order.cost).toFixed(2)}`).join('\n\n');
                details += `\n\n--------------------\nMonthly Profit (April 2025) = $${monthlyProfit.toFixed(2)}`;
                break;
            case 'Weekly Revenue':
                details = weeklyOrders.map(order => `Order ID: ${order.id}\nDate: ${order.date}\nRevenue: $${order.revenue.toFixed(2)}`).join('\n\n');
                details += `\n\n--------------------\nWeekly Revenue (starting Sunday) = $${weeklyRevenue.toFixed(2)}`;
                break;
            case 'Weekly Profit':
                details = weeklyOrders.map(order => `Order ID: ${order.id}\nDate: ${order.date}\nRevenue: $${order.revenue.toFixed(2)}\nCost: $${order.cost.toFixed(2)}\nProfit: $${(order.revenue - order.cost).toFixed(2)}`).join('\n\n');
                details += `\n\n--------------------\nWeekly Profit (starting Sunday) = $${weeklyProfit.toFixed(2)}`;
                break;
            case 'Average Order Value':
                details = `Total Revenue: $${totalRevenue.toFixed(2)}\nTotal Orders: ${totalOrdersCount}\n\n--------------------\nAverage Order Value = $<span class="math-inline">\{averageOrderValue\.toFixed\(2\)\} \(</span>{totalRevenue.toFixed(2)} / ${totalOrdersCount})`;
                break;
            case 'Total Orders':
                details = orders.map(order => `Order ID: ${order.id}\nDate: ${order.date}`).join('\n\n');
                details += `\n\n--------------------\nTotal Orders = ${totalOrdersCount}`;
                break;
            default:
                details = '';
        }
        setCalculationDetails(details);
    };

    const handleCloseCalculation = () => {
        setShowCalculation(null);
        setCalculationDetails('');
    };

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-[#F5F5F5]'}`}>
            {/* Sidebar */}
            <AdminNavbar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Main Content Area */}
            <div className="flex-1 p-6">
                <h2 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-[#64332d]'} mb-8`}><u>Revenue & Profit Overview</u></h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card title="Total Revenue" onClick={() => handleCardClick("Total Revenue")}>
                        <div className="flex items-center justify-center">
                            <DollarSign className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${totalRevenue.toFixed(2)}</p>
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total earnings from all orders.</p>
                    </Card>
                    <Card title="Total Profit" onClick={() => handleCardClick("Total Profit")}>
                        <div className="flex items-center justify-center">
                            <DollarSign className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${totalProfit.toFixed(2)}</p>
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total profit after deducting costs.</p>
                    </Card>
                    <Card title="Monthly Revenue" onClick={() => handleCardClick("Monthly Revenue")}>
                        <div className="flex items-center justify-center">
                            <CalendarDays className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${monthlyRevenue.toFixed(2)}</p>
                        </div>
                        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Revenue for the current month (April 2025).</p>
                    </Card>
                    <Card title="Monthly Profit" onClick={() => handleCardClick("Monthly Profit")}>
                        <div className="flex items-center justify-center">
                            <CalendarDays className={`w-8 h-8 mr-2 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>${monthlyProfit.toFixed(2)}</p>
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

                {showCalculation && (
                    <CalculationDisplay
                        title={showCalculation}
                        calculation={calculationDetails}
                        onClose={handleCloseCalculation}
                    />
                )}

                {/* New Section: Revenue Trends (Growth Removed) */}
                
                {/* You could add other relevant financial insights here */}
                {/* For example, top performing products, payment method statistics, etc. */}

            </div>
        </div>
    );
};

export default RevenuePage;