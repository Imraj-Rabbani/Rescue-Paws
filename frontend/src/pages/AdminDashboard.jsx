import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    ClipboardList,
    ArrowRight,
    Users,
    ShoppingCart,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    GripVertical
} from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import { DarkmodeContext } from '../context/DarkmodeContext'; // Import DarkmodeContext

// Reusable Card Component with hover effects and consistent styling
const Card = ({ title, children, className, onClick }) => {
    const { isDarkMode } = useContext(DarkmodeContext);

    return (
        <motion.div
            className={`rounded-xl shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-white/10'} ${className} cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.01]`}
            whileHover={{ scale: 1.01, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
            onClick={onClick}
        >
            <div className="p-6">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>{title}</h3>
                {children}
            </div>
        </motion.div>
    );
};

// Styled Link Component
const StyledLink = ({ to, children, className }) => {
    const { isDarkMode } = useContext(DarkmodeContext);
    return (
        <Link
            to={to}
            className={`transition-colors duration-200 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-[#A2574F] hover:text-[#8c453e]'} ${className}`}
        >
            {children}
        </Link>
    );
};

// Overview Card with icon and value animation
const OverviewCard = ({ title, value, icon: Icon, onClick }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const { isDarkMode } = useContext(DarkmodeContext);

    // Animate the value from 0 to the actual value
    useEffect(() => {
        const animationDuration = 1000; // Adjust for speed
        const frameRate = 60;
        const totalFrames = Math.ceil(animationDuration / (1000 / frameRate));
        let currentFrame = 0;

        const interval = setInterval(() => {
            currentFrame++;
            const progress = Math.min(currentFrame / totalFrames, 1);
            setDisplayValue(Math.ceil(value * progress));

            if (progress >= 1) {
                clearInterval(interval);
            }
        }, 1000 / frameRate);

        return () => clearInterval(interval);
    }, [value]);

    return (
        <Card
            className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md'}`}
            onClick={onClick}
        >
            <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>{title}</h3>
                <motion.p
                    className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#A2574F]'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {displayValue}
                </motion.p>
            </div>
            <Icon className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-[#A2574F] opacity-70'}`} />
        </Card>
    );
};

// Analytics Card with a title and content area
const AnalyticsCard = ({ title, children }) => {
    const { isDarkMode } = useContext(DarkmodeContext);
    return (
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/5 backdrop-blur-md'}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>{title}</h3>
            {children}
        </Card>
    );
};

// Draggable Panel Component
const DraggablePanel = ({ title, children }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const { isDarkMode } = useContext(DarkmodeContext);

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.2} // Add a little elasticity
            onDrag={(event, info) => {
                setPosition(prev => ({
                    x: prev.x + info.delta.x,
                    y: prev.y + info.delta.y
                }));
            }}
            style={{ x: position.x, y: position.y }}
            className={`fixed top-20 right-6 w-80 rounded-xl shadow-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/10 backdrop-blur-md border-white/10'} z-50`}
            initial={{ opacity: 0, x: 50, y: -50 }} // Start off-screen
            animate={{ opacity: 1, x: 0, y: 0 }} // Animate into view
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            <div className="flex items-center gap-2 p-3 bg-[#A2574F] rounded-t-xl cursor-move">
                <GripVertical className="w-4 h-4 text-white/50" />
                <h4 className="text-sm font-medium text-white">{title}</h4>
            </div>
            <div className="p-4">
                {children}
            </div>
        </motion.div>
    );
};

// --- Main Component ---
const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [showDraggablePanel, setShowDraggablePanel] = useState(false);
    const chartRef = useRef(null); // Ref for the chart container
    const { isDarkMode } = useContext(DarkmodeContext);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Sample data for demonstration
    const recentOrders = [
        { id: 123, volunteer: 'Volunteer A', status: 'Pending', date: '2024-07-28' },
        { id: 124, volunteer: 'Volunteer B', status: 'Shipped', date: '2024-07-27' },
        { id: 125, volunteer: 'Volunteer C', status: 'Delivered', date: '2024-07-26' },
    ];

    const lowStockAlerts = [
        { product: 'Product X', quantity: 5 },
        { product: 'Product Y', quantity: 2 },
        { product: 'Product Z', quantity: 1 },
    ];

    const newVolunteerSignups = [
        { name: 'Volunteer D', area: 'Area 1', date: '2024-07-28' },
        { name: 'Volunteer E', area: 'Area 2', date: '2024-07-27' },
        { name: 'Volunteer F', area: 'Area 3', date: '2024-07-26' },
    ];

    // Placeholder chart data
    const weeklyRevenueData = [500, 800, 600, 900, 1200, 1000, 1500]; // Example revenue
    const mostOrderedProductsData = [
        { product: 'Product X', orders: 30 },
        { product: 'Product Y', orders: 25 },
        { product: 'Product Z', orders: 40 },
    ];
    const volunteerPurchaseActivity = [10, 20, 15, 25, 30, 28, 35]; // Example activity

    // Function to render a simple bar chart (placeholder)
    const renderBarChart = (data, title) => {
        if (!chartRef.current) return null; // Ensure ref is attached

        const maxDataValue = Math.max(...data);
        const chartHeight = 150; // Fixed height for consistency
        const barWidth = 30;
        const barSpacing = 10;
        const availableWidth = chartRef.current.offsetWidth;
        const totalBarWidth = (barWidth + barSpacing) * data.length - barSpacing;
        const startX = (availableWidth - totalBarWidth) / 2; // Center the bars

        return (
            <div className="flex items-end h-36 w-full relative overflow-hidden" ref={chartRef}>
                {data.map((value, index) => {
                    const barHeight = (value / maxDataValue) * chartHeight;
                    const x = startX + index * (barWidth + barSpacing);

                    return (
                        <motion.div
                            key={index}
                            className="bg-[#A2574F] rounded-md"
                            style={{
                                width: barWidth,
                                height: barHeight,
                                marginLeft: index > 0 ? barSpacing : 0,
                                position: 'absolute',
                                bottom: 0,
                                left: x,
                            }}
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                                type: 'spring',
                                stiffness: 100,
                            }}
                        >
                            <span className="absolute text-xs text-white bottom-full mb-1 left-1/2 -translate-x-1/2">
                                {value}
                            </span>
                        </motion.div>
                    );
                })}
                <div className={`absolute bottom-0 left-0 w-full h-px ${isDarkMode ? 'bg-gray-700' : 'bg-white/20'}`}></div> {/* X-axis */}
            </div>
        );
    };

    // Function to render a simple pie chart (placeholder)
    const renderPieChart = (data, title) => {
        const total = data.reduce((acc, item) => acc + item.orders, 0);
        const colors = ['#A2574F', '#C0756D', '#D9918A']; // Example colors

        return (
            <div className="flex items-center justify-center relative w-36 h-36">
                {data.map((item, index) => {
                    const startAngle = (index === 0 ? 0 : data.slice(0, index).reduce((acc, curr) => acc + curr.orders, 0) / total) * 360;
                    const angle = (item.orders / total) * 360;
                    const midAngle = startAngle + angle / 2;
                    const radius = 50;

                    // Calculate label position
                    const labelX = radius * Math.cos((midAngle - 90) * (Math.PI / 180));
                    const labelY = radius * Math.sin((midAngle - 90) * (Math.PI / 180));

                    return (
                        <motion.div
                            key={index}
                            style={{
                                backgroundImage: `conic-gradient(
                                    ${colors[index]} ${startAngle}deg,
                                    ${colors[index]} ${startAngle + angle}deg,
                                    transparent ${startAngle + angle}deg
                                )`,
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                position: 'absolute',
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <span
                                className="absolute text-xs text-white"
                                style={{
                                    left: `calc(50% + ${labelX}px)`,
                                    top: `calc(50% + ${labelY}px)`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                {item.product}
                            </span>
                        </motion.div>
                    );
                })}
                <div className={`absolute w-20 h-20 rounded-full flex items-center justify-center text-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white/10 backdrop-blur-md text-[#A2574F]'}`}>
                    Total: {total}
                </div>
            </div>
        );
    };

    // Function to render a simple line chart
    const renderLineChart = (data, title) => {
        if (!chartRef.current) return null;

        const maxDataValue = Math.max(...data);
        const chartHeight = 150;
        const availableWidth = chartRef.current.offsetWidth;
        const dataPoints = data.length;
        const xStep = availableWidth / (dataPoints - 1); // Distance between points
        const points = data.map((value, index) => {
            const x = index * xStep;
            const y = chartHeight - (value / maxDataValue) * chartHeight;
            return { x, y, value }; // Store original value for display
        });

        // Generate SVG path string
        let path = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < dataPoints; i++) {
            path += ` L ${points[i].x} ${points[i].y}`;
        }

        return (
            <div className="h-36 w-full relative overflow-hidden" ref={chartRef}>
                <svg className="absolute inset-0 w-full h-full">
                    <path
                        d={path}
                        stroke="#A2574F"
                        strokeWidth="3"
                        fill="none"
                        className="stroke-dasharray-1000 stroke-dashoffset-1000"
                        style={{
                            animation: 'dash 2s ease-in-out forwards',
                        }}
                    />
                    {points.map((point, index) => (
                        <g key={index}>
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="6"
                                fill="#A2574F"
                                className="scale-0"
                                style={{
                                    animation: `scaleIn 0.5s ease-in-out forwards ${index * 0.2}s`,
                                }}
                            />
                            <text
                                x={point.x}
                                y={point.y - 10}
                                fontSize="12"
                                fill="white"
                                textAnchor="middle"
                                className="opacity-0"
                                style={{
                                    animation: `fadeIn 0.5s ease-in-out forwards ${index * 0.2 + 0.5}s`,
                                }}
                            >
                                {point.value}
                            </text>
                        </g>
                    ))}
                    <style>{`
                        @keyframes dash {
                            to {
                                stroke-dashoffset: 0;
                            }
                        }
                        @keyframes scaleIn {
                            to {
                                scale: 1;
                            }
                        }
                        @keyframes fadeIn {
                            to {
                                opacity: 1;
                            }
                        }
                    `}</style>
                </svg>
                <div className={`absolute bottom-0 left-0 w-full h-px ${isDarkMode ? 'bg-gray-700' : 'bg-white/20'}`}></div>
            </div>
        );
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
                <AnimatePresence>
                    {showDraggablePanel && (
                        <DraggablePanel title="Dashboard Notes"><p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                        <AlertTriangle className="inline-block w-4 h-4 mr-1 text-yellow-400" />
                        <span className="font-medium">Important:</span> This is a demo
                        dashboard. Data is for illustrative purposes only.
                    </p>
                    <ul className={`list-disc list-inside mt-2 space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                        <li>Click on the overview cards to view details.</li>
                        <li>Charts are placeholders; real data will be dynamic.</li>
                        <li>Use the sidebar to navigate to other sections.</li>
                    </ul>
                    <button
                        onClick={() => setShowDraggablePanel(false)}
                        className="mt-4 px-4 py-2 bg-[#A2574F] text-white rounded-md hover:bg-[#8c453e] transition-colors"
                    >
                        <CheckCircle className="w-4 h-4 mr-2 inline-block" />
                        Got it!
                    </button>
                </DraggablePanel>
            )}
        </AnimatePresence>

        {activeTab === 'Dashboard' && (
            <>
                <div className="flex justify-center mb-8">
                    <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-[#64332d]'}`}>
                        <u>Admin Dashboard</u>
                    </h2>
                </div>
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <p className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-[#664C36]'}`}>
                            Welcome to your e-commerce management hub.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowDraggablePanel(true)}
                        className="px-4 py-2 bg-[#A2574F] text-white rounded-md hover:bg-[#8c453e] transition-colors"
                    >
                        <ClipboardList className="w-4 h-4 mr-2 inline-block" />
                        Show Notes
                    </button>
                </div>

                {/* Top Section: Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StyledLink to="/products">
                        <OverviewCard
                            title="Total Products"
                            value={128}
                            icon={Package}
                            onClick={() => setActiveTab('Products')}
                        />
                    </StyledLink>
                    <StyledLink to="/orders">
                        <OverviewCard
                            title="Pending Orders"
                            value={23}
                            icon={ShoppingCart}
                            onClick={() => setActiveTab('Orders')}
                        />
                    </StyledLink>
                    <OverviewCard
                        title="Monthly Revenue"
                        value={5430}
                        icon={TrendingUp}
                        onClick={() => setActiveTab('Revenue')}
                    />
                    <OverviewCard
                        title="Active Volunteers"
                        value={56}
                        icon={Users}
                        onClick={() => setActiveTab('Access')}
                    />
                </div>

                {/* Middle Section: Analytics Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <AnalyticsCard title="Weekly Revenue">
                        {renderBarChart(weeklyRevenueData, 'Weekly Revenue')}
                    </AnalyticsCard>
                    <AnalyticsCard title="Most Ordered Products">
                        {renderPieChart(mostOrderedProductsData, 'Most Ordered Products')}
                    </AnalyticsCard>
                    <AnalyticsCard title="Volunteer Purchase Activity">
                        {renderLineChart(volunteerPurchaseActivity, 'Volunteer Purchase Activity')}
                    </AnalyticsCard>
                </div>

                {/* Bottom Section: Quick Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card title="Recent Orders">
                        <ul className="space-y-3">
                            {recentOrders.map(order => (
                                <li key={order.id} className={isDarkMode ? 'text-gray-300 text-sm' : 'text-[#664C36] text-sm'}>
                                    <span className="font-medium">Order #{order.id}</span> -{' '}
                                    {order.volunteer} -{' '}
                                    <span
                                        className={
                                            order.status === 'Pending'
                                                ? 'text-yellow-500'
                                                : order.status === 'Shipped'
                                                    ? 'text-blue-500'
                                                    : 'text-green-500'
                                        }
                                    >
                                        {order.status}
                                    </span>{' '}
                                    ({order.date})
                                </li>
                            ))}
                        </ul>
                        <StyledLink to="/orders" className="mt-4 inline-flex items-center text-sm">
                            View All Orders <ArrowRight className="w-4 h-4 ml-1" />
                        </StyledLink>
                    </Card>
                    <Card title="Low Stock Alerts">
                        <ul className="space-y-3">
                            {lowStockAlerts.map((alert, index) => (
                                <li key={index} className={isDarkMode ? 'text-gray-300 text-sm flex items-center' : 'text-[#664C36] text-sm flex items-center'}>
                                    <AlertTriangle className="w-4 h-4 mr-1 text-red-500 inline-block" />
                                    <span className="font-medium">{alert.product}</span> -{' '}
                                    {alert.quantity} pcs
                                </li>
                            ))}
                        </ul>
                        <StyledLink to="/products" className="mt-4 inline-flex items-center text-sm">
                            Manage Stock <ArrowRight className="w-4 h-4 ml-1" />
                        </StyledLink>
                    </Card>
                    <Card title="New Volunteer Signups">
                        <ul className="space-y-3">
                            {newVolunteerSignups.map((volunteer, index) => (
                                <li key={index} className={isDarkMode ? 'text-gray-300 text-sm' : 'text-[#664C36] text-sm'}>
                                    <span className="font-medium">{volunteer.name}</span> -{' '}
                                    {volunteer.area} ({volunteer.date})
                                </li>
                            ))}
                        </ul>
                        <StyledLink to="/volunteers" className="mt-4 inline-flex items-center text-sm">
                            View Volunteers <ArrowRight className="w-4 h-4 ml-1" />
                        </StyledLink>
                    </Card>
                </div>
            </>
        )}

        {activeTab === 'Products' && (
            <div className={isDarkMode ? 'bg-gray-800 backdrop-blur-md p-6 rounded-xl shadow-md border border-gray-700' : 'bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/10'}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#A2574F]'} mb-6`}>Products</h2>
                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>This is the Products Management page.</p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>You can Add, edit, and delete products here.</p>
                <StyledLink to="/products" className="mt-4 inline-flex items-center">
                    Go to Products <ArrowRight className="w-4 h-4 ml-1" />
                </StyledLink>
            </div>
        )}

        {activeTab === 'Orders' && (
            <div className={isDarkMode ? 'bg-gray-800 backdrop-blur-md p-6 rounded-xl shadow-md border border-gray-700' : 'bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/10'}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#A2574F]'} mb-6`}>Orders</h2>
                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>This is the Orders Management page.</p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>You can View past orders and orders to be delivered here.</p>
            </div>
        )}

        {activeTab === 'Revenue' && (
            <div className={isDarkMode ? 'bg-gray-800 backdrop-blur-md p-6 rounded-xl shadow-md border border-gray-700' : 'bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/10'}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#A2574F]'} mb-6`}>Revenue</h2>
                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>This is the Revenue page.</p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>You can View Revenue and Profits here.</p>
                <StyledLink to="/revenue" className="mt-4 inline-flex items-center">
                    View Revenue Details <ArrowRight className="w-4 h-4 ml-1" />
                </StyledLink>
            </div>
        )}
        
    </div>
</div >
);
};

export default AdminDashboard;