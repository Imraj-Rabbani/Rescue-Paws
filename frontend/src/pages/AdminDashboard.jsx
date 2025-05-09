import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Boxes, ClipboardList, ArrowRight, ShoppingCart, AlertTriangle, CheckCircle, GripVertical, CreditCard, DollarSign, TrendingUp, PiggyBank } from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import { DarkmodeContext } from '../context/DarkmodeContext';
import axios from 'axios';




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
        if (typeof value === 'number') {
            const animationDuration = 1000;
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
        } else {
            setDisplayValue(value);
        }
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
                    {typeof displayValue === 'number' ? displayValue : value}
                </motion.p>
            </div>
            <Icon className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-[#A2574F] opacity-70'}`} />
        </Card>
    );
};




// Analytics Card with a title and content area
const AnalyticsCard = ({ title, children, chartRef }) => {
    const { isDarkMode } = useContext(DarkmodeContext);
    return (
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/5 backdrop-blur-md'}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#A2574F]'}`}>{title}</h3>
            <div ref={chartRef}>
                {children}
            </div>
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
            dragElastic={0.2}
            onDrag={(event, info) => {
                setPosition(prev => ({
                    x: prev.x + info.delta.x,
                    y: prev.y + info.delta.y
                }));
            }}
            style={{ x: position.x, y: position.y }}
            className={`fixed top-20 right-6 w-80 rounded-xl shadow-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/10 backdrop-blur-md border-white/10'} z-50`}
            initial={{ opacity: 0, x: 50, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
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
    const chartRef = useRef(null);
    const { isDarkMode } = useContext(DarkmodeContext);
    const [totalProducts, setTotalProducts] = useState(0);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
    const [mostOrderedProductsData, setMostOrderedProductsData] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [orders, setOrders] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState(null);
    const [loadingMonthlyRevenue, setLoadingMonthlyRevenue] = useState(true);
    const [errorMonthlyRevenue, setErrorMonthlyRevenue] = useState(null);
    const [totalRevenue, setTotalRevenue] = useState('Loading...');
    const [errorTotalRevenueDetails, setErrorTotalRevenueDetails] = useState(null);
    const [loadingTotalRevenue, setLoadingTotalRevenue] = useState(true);
    const [errorTotalRevenue, setErrorTotalRevenue] = useState(null);
    const [orderedPurchaseCost, setOrderedPurchaseCost] = useState(0);
    const [weeklyRevenueData, setWeeklyRevenueData] = useState([]);
    const [loadingWeeklyRevenueChart, setLoadingWeeklyRevenueChart] = useState(true);
    const [errorWeeklyRevenueChart, setErrorWeeklyRevenueChart] = useState(null);
    const [totalProfit, setTotalProfit] = useState(0);
    const [averageOrderValue, setAverageOrderValue] = useState('Loading...'); // State for AOV
    const [errorAverageOrderValue, setErrorAverageOrderValue] = useState(null); // Error state for AOV
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    //fetch all orders
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setFetchError(null);
            try {
                const res = await axios.get(`${backendUrl}/api/orders/all`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    withCredentials: true,
                });
                if (res.data?.success) {
                    setOrders(res.data.orders);
                } else {
                    const errorMessage = res.data?.message || res.data?.error || 'Failed to fetch orders.';
                    setFetchError(errorMessage);
                }
            } catch (err) {
                const message =
                    err.response?.data?.message ||
                    (err.response ? `Status: ${err.response.status}` :
                        err.request ? 'No server response.' :
                            err.message || 'Request error.');
                setFetchError(message);
            }
            setLoading(false);
        };
        fetchOrders();
    }, [backendUrl]);


    //calculate pending order count
    useEffect(() => {
        if (orders) {
            const pendingCount = orders.filter(order => order.status === 'Pending').length;
            setPendingOrdersCount(pendingCount);
        }
    }, [orders]);




    // Fetch most ordered products
    useEffect(() => {
        const fetchMostOrdered = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
                const response = await axios.get(`${backendUrl}/api/products/most-ordered`);
                setMostOrderedProductsData(response.data);
                console.log("Most ordered products fetched:", response.data);
            } catch (error) {
                console.error("Error fetching most ordered products:", error);
            }
        };
        fetchMostOrdered();
    }, []);


    // Fetch all orders and calculate total revenue
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setFetchError(null);
            try {
                const res = await axios.get(`${backendUrl}/api/orders/all`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    withCredentials: true,
                });
                if (res.data?.success) {
                    setOrders(res.data.orders);




                    const calculatedTotalRevenue = res.data.orders.reduce((sum, order) => {
                        return sum + (order.totalPoints || 0);
                    }, 0);
                    setTotalRevenue(calculatedTotalRevenue);
                } else {
                    const errorMessage = res.data?.message || res.data?.error || 'Failed to fetch orders.';
                    setFetchError(errorMessage);
                }
            } catch (err) {
                const message =
                    err.response?.data?.message ||
                    (err.response ? `Status: ${err.response.status}` :
                        err.request ? 'No server response.' :
                            err.message || 'Request error.');
                setFetchError(message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [backendUrl]);


    useEffect(() => {
        const fetchWeeklyRevenueForChart = async () => {
            setLoadingWeeklyRevenueChart(true);
            setErrorWeeklyRevenueChart(null);
            try {
                const response = await axios.get(`${backendUrl}/api/orders/all`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    withCredentials: true,
                });
                console.log("All Orders Response for Weekly Revenue Chart:", response.data);
                if (response.data?.success && response.data.orders) {
                    const now = new Date();
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(now.getDate() - now.getDay());
                    startOfWeek.setHours(0, 0, 0, 0);
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    endOfWeek.setHours(23, 59, 59, 999);
                    const weeklyRevenueByDay = Array(7).fill(0);
                    response.data.orders.forEach(order => {
                        const createdAt = new Date(order.createdAt);
                        if (createdAt >= startOfWeek && createdAt <= endOfWeek) {
                            const dayIndex = createdAt.getDay();
                            weeklyRevenueByDay[dayIndex] += order.totalPoints || 0;
                        }
                    });
                    // Format data for rendering the chart
                    const formattedData = weeklyRevenueByDay.map((revenue, index) => ({
                        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index],
                        revenue
                    }));
                    setWeeklyRevenueData(formattedData);
                } else {
                    setErrorWeeklyRevenueChart(response.data?.message || 'Failed to fetch orders for weekly revenue chart.');
                }
            } catch (error) {
                console.error('Error fetching orders for weekly revenue chart:', error);
                setErrorWeeklyRevenueChart(error?.message || 'An error occurred while fetching orders for weekly revenue chart.');
            } finally {
                setLoadingWeeklyRevenueChart(false);
            }
        };
        fetchWeeklyRevenueForChart();
    }, [backendUrl]);


    // Calculate Average Order Value
    useEffect(() => {
        if (orders && orders.length > 0) {
            try {
                const totalRevenueValue = orders.reduce((sum, order) => sum + (order.totalPoints || 0), 0);
                const orderCount = orders.length;
                const aov = totalRevenueValue / orderCount;
                setAverageOrderValue(aov.toFixed(2));
                setErrorAverageOrderValue(null);
            } catch (error) {
                console.error("Error calculating Average Order Value:", error);
                setAverageOrderValue('Error');
                setErrorAverageOrderValue("Failed to calculate Average Order Value.");
            }
        } else if (orders && orders.length === 0) {
            setAverageOrderValue('0.00');
            setErrorAverageOrderValue(null);
        } else {
            setAverageOrderValue('Loading...');
            setErrorAverageOrderValue(null);
        }
    }, [orders]);


    // Fetched recentOrders data from orders
    const recentOrders = orders ? orders.slice(0, 3) : [];
    // Placeholder chart data
    const profitTrendsThisWeek = [10, 20, 15, 25, 30, 28, 35];
    const renderBarChart = (data, title) => {
        if (loadingWeeklyRevenueChart) {
            return <div className="text-center text-gray-500">Loading weekly revenue data...</div>;
        }
        if (errorWeeklyRevenueChart) {
            return <div className="text-center text-red-500">Error loading weekly revenue data.</div>;
        }
        if (!data || data.length === 0) {
            return <div className="text-center text-gray-400">No weekly revenue data available.</div>;
        }
        const chartHeight = 200;
        const barWidth = 30;
        const barGap = 20;
        const maxRevenue = Math.max(...data.map(point => point.revenue), 100);
        return (
            <div className="h-[250px] w-full relative" ref={chartRef}>
                <svg className="absolute inset-0 w-full h-full">
                    <g transform="translate(2, 40)">
                        {data.map((point, index) => {
                            const barHeight = (point.revenue / maxRevenue) * 120;
                            const x = index * (barWidth + barGap);
                            const y = chartHeight - barHeight - 40;
                            return (
                                <g key={index}>
                                    <text
                                        x={x + barWidth / 2}
                                        y={y - 10}
                                        fontSize="12"
                                        fontWeight="bold"
                                        fill={isDarkMode ? "white" : "black"}
                                        textAnchor="middle"
                                    >
                                        {point.revenue.toFixed(2)}
                                    </text>
                                    <rect
                                        x={x}
                                        y={y}
                                        width={barWidth}
                                        height={barHeight}
                                        fill="#A2574F"
                                        rx="6"
                                    />
                                    <text
                                        x={x + barWidth / 2}
                                        y={y + barHeight / 2 + 5}
                                        fontSize="10"
                                        fill="white"
                                        textAnchor="middle"
                                    >
                                        {point.day}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>
        );
    };
    // Function to render DONUT chart
    const fixedColors = ['#FFD700', '#9B59B6', '#FF69B4', '#1E90FF', '#2ECC71'];
    const renderDonutChart = (data, title) => {
        if (!data || data.length === 0)
            return <div className="text-gray-400 text-center">No data to display</div>;




        const top5Data = data.slice(0, 5).map(item => ({
            ...item,
            orders: Number(item.orders) || 0,
        }));
        const total = top5Data.reduce((acc, item) => acc + item.orders, 0);
        if (total === 0)
            return <div className="text-gray-400 text-center">No orders to display</div>;
        const chartRadius = 90;
        const holeRadius = 35;
        const svgWidth = chartRadius * 2;
        const svgHeight = chartRadius * 2;
        return (
            <div className="relative w-full h-full top-2 pr-30 flex items-end justify-center">
                <svg width={svgWidth} height={svgHeight}>
                    {top5Data.map((item, index) => {
                        const startAngle = (index === 0
                            ? 0
                            : top5Data.slice(0, index).reduce((acc, curr) => acc + curr.orders, 0) / total) * 360;
                        const angle = (item.orders / total) * 360;
                        const endAngle = startAngle + angle;
                        const midAngle = (startAngle + endAngle) / 2;
                        const percentage = ((item.orders / total) * 100).toFixed(1);
                        const startX = chartRadius + chartRadius * Math.cos((startAngle - 90) * Math.PI / 180);
                        const startY = chartRadius + chartRadius * Math.sin((startAngle - 90) * Math.PI / 180);
                        const endX = chartRadius + chartRadius * Math.cos((endAngle - 90) * Math.PI / 180);
                        const endY = chartRadius + chartRadius * Math.sin((endAngle - 90) * Math.PI / 180);
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        const pathData = `
                      M ${chartRadius} ${chartRadius}
                      L ${startX} ${startY}
                      A ${chartRadius} ${chartRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}
                      L ${chartRadius + holeRadius * Math.cos((endAngle - 90) * Math.PI / 180)} ${chartRadius + holeRadius * Math.sin((endAngle - 90) * Math.PI / 180)}
                      A ${holeRadius} ${holeRadius} 0 ${largeArcFlag} 0 ${chartRadius + holeRadius * Math.cos((startAngle - 90) * Math.PI / 180)} ${chartRadius + holeRadius * Math.sin((startAngle - 90) * Math.PI / 180)}
                      Z`;
                        const percentageX = chartRadius + (chartRadius * 0.65) * Math.cos((midAngle - 90) * Math.PI / 180);
                        const percentageY = chartRadius + (chartRadius * 0.65) * Math.sin((midAngle - 90) * Math.PI / 180);
                        const color = fixedColors[index % fixedColors.length];
                        return (
                            <g key={index}>
                                <path
                                    d={pathData}
                                    fill={color}
                                    stroke="#f3f4f6"
                                    strokeWidth="1"
                                />
                                {percentage > 0 && (
                                    <text
                                        x={percentageX}
                                        y={percentageY}
                                        textAnchor="middle"
                                        fontSize="10"
                                        fontWeight="bold"
                                        fill="black"
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {percentage}%
                                    </text>
                                )}
                            </g>
                        );
                    })}
                    <circle cx={chartRadius} cy={chartRadius} r={holeRadius} fill="white" />
                </svg>




                {/* Legend */}
                <div className={`absolute top-0 right-7 text-[10px] ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {top5Data.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: fixedColors[index % fixedColors.length] }}
                            ></div>
                            <span>{item.name ? item.name.substring(0, 10) : `Product ${index + 1}`}</span>
                        </div>
                    ))}
                </div></div>);
    };




    // Function to render a simple line chart
    const renderLineChart = (data, title) => {
        const availableWidth = chartRef?.current?.offsetWidth || 200;
        if (!chartRef.current) return null;




        const maxDataValue = Math.max(...data);
        const chartHeight = 150;
        const dataPoints = data.length;
        const xStep = availableWidth / (dataPoints - 1);
        const points = data.map((value, index) => {
            const x = index * xStep;
            const y = chartHeight - (value / maxDataValue) * chartHeight;
            return { x, y, value };
        });




        // Generate SVG path string
        let path = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < dataPoints; i++) {
            path += ` L ${points[i].x} ${points[i].y}`;
        }
        return (
            <div className="h-30 top-7 w-full relative " ref={chartRef}>
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




    // Fetch product count from the database
    useEffect(() => {
        const fetchProductCount = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
                if (!backendUrl) {
                    throw new Error("VITE_BACKEND_URL is not defined. Please configure your environment.");
                }
                const response = await fetch(`${backendUrl}/api/products/count`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch product count: ${response.status} - ${errorText}`);
                }
                const data = await response.json();
                setTotalProducts(data.count);
            } catch (error) {
                console.error("Error fetching product count:", error);
                setTotalProducts(0);
            }
        };
        fetchProductCount();
    }, []);




    // Fetch low stock products
    useEffect(() => {
        const fetchLowStockProducts = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
                if (!backendUrl) {
                    throw new Error("VITE_BACKEND_URL is not defined. Please configure your environment.");
                }
                const response = await axios.get(`${backendUrl}/api/products/low-stock`);
                setLowStockProducts(response.data);
            } catch (error) {
                console.error("Error fetching low stock products:", error);
                setLowStockProducts([]);
            }
        };
        fetchLowStockProducts();
    }, []);
    // Fetch total investment (total purchase cost)
    useEffect(() => {
        const fetchAllOrdersForRevenue = async () => {
            setLoadingTotalRevenue(true);
            setErrorTotalRevenue(null);
            console.log("Fetching all orders for revenue and cost calculation...");
            try {
                const response = await axios.get(`${backendUrl}/api/orders/all`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    withCredentials: true,
                });
                if (response.data?.success && response.data.orders) {
                    const fetchedOrders = response.data.orders;
                    setOrders(fetchedOrders);
                    let calculatedTotalRevenue = 0;
                    let calculatedOrderedPurchaseCost = 0;
                    for (const order of fetchedOrders) {
                        calculatedTotalRevenue += (order.totalPoints || 0);
                        if (order.items && Array.isArray(order.items)) {
                            for (const item of order.items) {
                                try {
                                    const productResponse = await axios.get(`${backendUrl}/api/products/${item._id}`);
                                    if (productResponse.data?.success && productResponse.data.product) {
                                        const purchaseCost = productResponse.data.product.purchaseCost || 0;
                                        const quantity = item.quantity || 0;
                                        const itemPurchaseCost = purchaseCost * quantity;
                                        calculatedOrderedPurchaseCost += itemPurchaseCost;
                                    } else {
                                        console.warn(`Could not fetch product details for ID: ${item._id}. Skipping cost calculation for this item.`);
                                    }
                                } catch (error) {
                                    console.error(`Error fetching product details for ID: ${item._id}`, error);
                                }
                            }
                        }
                    }
                    setTotalRevenue(calculatedTotalRevenue);
                    setOrderedPurchaseCost(calculatedOrderedPurchaseCost);
                    setTotalProfit(calculatedTotalRevenue - calculatedOrderedPurchaseCost); // Calculate total profit
                } else {
                    console.error("Failed to fetch orders. Response data:", response.data);
                    setErrorTotalRevenue(response.data?.message || 'Failed to fetch orders.');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                setErrorTotalRevenue(error.message || 'An error occurred while fetching orders.');
            } finally {
                setLoadingTotalRevenue(false);
                console.log("Order fetching and revenue/cost calculation complete. Loading state set to false.");
            }
        };
        fetchAllOrdersForRevenue();
    }, [backendUrl]);
    useEffect(() => {
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
        fetchMonthlyRevenue();
    }, []);
    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-[#F5F5F5]'}`}>
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
                        <DraggablePanel title="Dashboard Notes">
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                                <AlertTriangle className="inline-block w-4 h-4 mr-1 text-yellow-400" />
                                <span className="font-medium">Important:</span> Welcome to our Stray Paw's admin dashboard.
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
                            <StyledLink to="/adminproducts">
                                <OverviewCard
                                    title="Total Products"
                                    value={totalProducts}
                                    icon={() => <Boxes className={isDarkMode ? 'text-blue-400 w-12 h-12' : 'text-blue-600 w-12 h-12'} />}
                                    onClick={() => setActiveTab('Products')}
                                />
                            </StyledLink>
                            <StyledLink to="/adminorders">
                                <OverviewCard
                                    title="Pending Orders"
                                    value={loading ? 'Loading...' : pendingOrdersCount}
                                    icon={() => <ShoppingCart className={isDarkMode ? 'text-yellow-200 w-11 h-11' : 'text-yellow-400 w-11 h-11'} />}
                                    onClick={() => setActiveTab('Orders')}
                                />
                            </StyledLink>
                            <OverviewCard
                                title="Monthly Revenue"
                                value={loadingMonthlyRevenue ? 'Loading...' : errorMonthlyRevenue ? 'Error' : monthlyRevenue !== null ? `$${monthlyRevenue.toFixed(2)}` : '$0.00'}
                                icon={() => <CreditCard className={isDarkMode ? 'text-green-500 w-11 h-11' : 'text-green-600 w-11 h-11'} />}
                                onClick={() => setActiveTab('Revenue')}
                            />
                            <OverviewCard
                                title="Average Order Value"
                                value={loading ? 'Loading...' : errorAverageOrderValue ? 'Error' : averageOrderValue !== 'Loading...' ? `$${averageOrderValue}` : '$0.00'}
                                icon={DollarSign} // Using DollarSign as a relevant icon
                                onClick={() => console.log('Average Order Value card clicked')}
                            />
                        </div>
                        {/* Middle Section: Analytics Panel */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
                            <AnalyticsCard title="Weekly Revenue" chartRef={chartRef}>
                                {renderBarChart(weeklyRevenueData, 'Weekly Revenue')}
                            </AnalyticsCard>
                            <AnalyticsCard title="Most Ordered Products" chartRef={chartRef}>
                                {renderDonutChart(mostOrderedProductsData, 'Most Ordered Products')}
                            </AnalyticsCard>
                            <AnalyticsCard title="Profit Trends This Week" chartRef={chartRef}>
                                {renderLineChart(profitTrendsThisWeek, 'Profit Trends This Week')}
                            </AnalyticsCard>
                        </div>
                        {/* Bottom Section: Quick Tables */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card title={<span><span className="text-3xl mr-1">🛒</span> Recent Orders </span>} className="bg-[#e4c2a6]">
                                <ul className="space-y-3.5 mt-2">
                                    {recentOrders.map(order => (
                                        <li key={order._id} className={isDarkMode ? 'text-gray-300 text-sm' : 'text-[#664C36] text-sm'}>
                                            <span className="font-medium">Order #{order._id}</span> -{' '}
                                            <span
                                                className={
                                                    order.status === 'Pending'
                                                        ? 'text-yellow-500'
                                                        : order.status === 'Shipped'
                                                            ? 'text-blue-500'
                                                            : 'text-green-500'}>
                                                {order.status}
                                            </span>
                                        </li>))}
                                </ul>
                                <StyledLink to="/adminorders" className="mt-4 inline-flex items-center text-sm">
                                    View All Orders <ArrowRight className="w-4 h-4 ml-1" />
                                </StyledLink>
                            </Card>
                            <Card title={<span><span className="text-2xl mr-1">🔴</span> Low Stock Alert </span>} className="bg-[#e4c2a6]">
                                <ul className="space-y-3.5 mt-2">
                                    {lowStockProducts.map((alert, index) => (
                                        <li key={index} className={isDarkMode ? 'text-gray-300 text-sm flex items-center' : 'text-[#664C36] text-sm flex items-center'}>
                                            <AlertTriangle className="w-6 h-6 mr-2 text-red-500 inline-block" />
                                            <span className="font-medium">{alert.name}</span> -{' '}
                                            {alert.stockQuantity} pcs!
                                        </li>))}
                                </ul>
                                <StyledLink to="/adminproducts" className="mt-4 inline-flex items-center text-sm">
                                    Manage Stock <ArrowRight className="w-4 h-4 ml-1" />
                                </StyledLink>
                            </Card>
                            <Card title={<span><span className="text-3xl mr-1">💰</span> Financial Overview</span>} className="bg-[#e4c2a6]">
                                <ul className="space-y-3.5 mt-2">
                                    <li className="flex items-center space-x-2">
                                        <DollarSign className="w-6 h-6 text-[#F44336]" />
                                        <span className={isDarkMode ? 'text-gray-300' : 'text-[#664C36] text-sm flex items-center'}>
                                            <span className="font-semibold">Ordered Purchase Cost</span> — {orderedPurchaseCost?.toFixed(2)}$
                                        </span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <TrendingUp className="w-6 h-6 text-[#00C49F]" />
                                        <span className={isDarkMode ? 'text-gray-300' : 'text-[#664C36] text-sm flex items-center'}>
                                            <span className="font-semibold">Total Revenue</span> — {typeof totalRevenue === 'number' ? `${totalRevenue.toFixed(2)}$` : totalRevenue}
                                        </span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <PiggyBank className="w-6 h-6 text-[#AF19FF]" />
                                        <span className={isDarkMode ? 'text-gray-300' : 'text-[#664C36] text-sm flex items-center'}>
                                            <span className="font-semibold">Net Profit</span> — {totalProfit?.toFixed(2)}$
                                        </span>
                                    </li>
                                </ul>
                                <StyledLink to="/adminrevenue" className="mt-4 inline-flex items-center text-sm font-medium text-[#664C36] hover:underline">
                                    View Detailed Revenue <ArrowRight className="w-4 h-4 ml-1" />
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
                        <StyledLink to="/adminproducts" className="mt-4 inline-flex items-center">
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
                        <StyledLink to="/adminrevenue" className="mt-4 inline-flex items-center">
                            View Revenue Details <ArrowRight className="w-4 h-4 ml-1" />
                        </StyledLink>
                    </div>
                )}
            </div>
        </div >
    );
};
export default AdminDashboard;