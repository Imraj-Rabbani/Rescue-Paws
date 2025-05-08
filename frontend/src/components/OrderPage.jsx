import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import {Trash2, AlertTriangle, Info, Truck, CheckCircle, Clock } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import { DarkmodeContext } from '../context/DarkmodeContext';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({
        userId: '',
        items: [],
        userInfo: {
            name: '',
            phone: '',
            address: '',
            promo: '',
            shipping: '',
        },
        donation: 0,
        totalPoints: 0,
        status: 'Pending',
        id: '',
        customerName: '',
        total: 0,
        orderDate: '',
        deliveryDate: '',
    });
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('Orders');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [filterView, setFilterView] = useState('');
    const { isDarkMode } = useContext(DarkmodeContext);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const { backendUrl } = useContext(AppContext);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(null); 

    useEffect(() => {
        fetchOrders();
    }, [backendUrl]);

    const fetchOrders = async () => {
        setLoading(true);
        setFetchError(null);
        try {
            const response = await axios.get(`${backendUrl}/api/orders/all`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                withCredentials: true,
            });
            if (response.data.success) {
                setOrders(response.data.orders);
            } else {
                setFetchError(response.data.message || 'Failed to fetch orders.');
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setFetchError(error.message || 'An unexpected error occurred while fetching orders.');
        } finally {
            setLoading(false);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const openDetailsModal = (order) => {
        setSelectedOrderDetails(order);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedOrderDetails(null);
    };

    const getFilteredOrders = () => {
        let filtered = orders;

        if (filterView === 'delivered') {
            filtered = orders.filter(order => order.status === 'Delivered');
        } else if (filterView === 'outfordelivery') {
            filtered = orders.filter(order => order.status === 'Out for Delivery');
        } else if (filterView === 'queued') {
            filtered = orders.filter(order => order.status === 'Pending');
        }
        return filtered;
    };

    const handleDeleteOrder = (id) => {
        setOrderToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteOrder = async () => {
        try {
            const response = await axios.delete(`<span class="math-inline">\{backendUrl\}/api/orders/</span>{orderToDelete}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                withCredentials: true,
            });

            if (response.data.success) {
                fetchOrders();
                setIsDeleteModalOpen(false);
                setOrderToDelete(null);
            } else {
                setError(response.data.message || 'Failed to delete order.');
            }

        } catch (error) {
            console.error("Error deleting order:", error);
            setError(error.message || 'Failed to delete order');
        }
    };

    const cancelDeleteOrder = () => {
        setIsDeleteModalOpen(false);
        setOrderToDelete(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('userInfo.')) {
            const userInfoPart = name.split('.')[1];
            setNewOrder({
                ...newOrder,
                userInfo: {
                    ...newOrder.userInfo,
                    [userInfoPart]: value,
                },
            });
        } else {
            setNewOrder({ ...newOrder, [name]: value });
        }
    };

    const setOrderView = (viewType) => {
        setFilterView(viewType);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setStatusUpdateLoading(orderId);
        try {
            const response = await axios.put(
                `${backendUrl}/api/orders/${orderId}`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
                ));
            } else {
                setError(response.data.message || 'Failed to update order status.');
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            setError(error.message || 'An unexpected error occurred while updating order status.');
        } finally {
            setStatusUpdateLoading(null);
        }
    };
    const getStatusComponent = (status) => {
        const baseClass = "inline-flex items-center rounded-full px-2 py-1 text-xs border";
        const textBaseClass = "ml-0";
        const iconClass = "h-3 w-3 mr-1";
        switch (status) {
            case 'Pending':
                return <span className={`${baseClass} ${isDarkMode ? 'bg-indigo-800 text-indigo-100 border-indigo-700' : 'bg-indigo-100 text-indigo-800 border-indigo-300'} ${textBaseClass}`}><Clock className={`${iconClass} w-4 h-4 mr-1`} /> Pending</span>;
            case 'Out for Delivery':
                return <span className={`${baseClass} ${isDarkMode ? 'bg-orange-800 text-orange-100 border-orange-700' : 'bg-orange-100 text-orange-800 border-orange-300'} ${textBaseClass}`}><Truck className={`${iconClass} w-4 h-4 mr-1`} /> Shipped</span>;
            case 'Delivered':
                return <span className={`${baseClass} ${isDarkMode ? 'bg-green-800 text-green-100 border-green-700' : 'bg-green-100 text-green-800 border-green-300'} ${textBaseClass}`}><CheckCircle className={`${iconClass} w-4 h-4 mr-1`} /> Delivered</span>;
            default:
                return <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{status}</span>;
        }
    };

    if (loading) {
        return <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-[#F5F5F5]'}`}><p className={isDarkMode ? 'text-white' : 'text-gray-800'}>Loading orders...</p></div>;
    }
    if (fetchError) {
        return <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-[#F5F5F5]'}`}><p className={`text-red-500`}>Error loading orders: {fetchError}</p></div>;
    }
    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-[#F5F5F5]'}`}>
            <AdminNavbar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <div className="flex-1 p-6">
                <h1 className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-[#64332d]'}`}><u>Orders Details</u></h1>
                <div className="mt-8"></div>
                <div className={`shadow-md rounded-md flex justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="w-full">
                        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-[#f5f5f5]'} p-4 rounded-t-md`}>
                            <h2 className={`text-lg font-semibold text-center ${isDarkMode ? 'text-white' : 'text-[#A2574F]'}`}>
                                {filterView === '' && 'All Orders'}
                                {filterView === 'delivered' && 'Past Orders'}
                                {filterView === 'outfordelivery' && 'Orders in Transit'}
                                {filterView === 'queued' && 'Queued Orders'}
                            </h2>
                            <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                                {filterView === '' && 'View all orders'}
                                {filterView === 'delivered' && 'View orders that have been successfully delivered'}
                                {filterView === 'outfordelivery' && 'View orders currently in transit'}
                                {filterView === 'queued' && 'View orders waiting for dispatch'}
                            </p>
                            <div className="relative inline-block">
                                <select
                                    value={filterView}
                                    onChange={(e) => setOrderView(e.target.value)}
                                    className={`appearance-none border rounded-md shadow-sm py-2 px-3 focus:outline-none
                                        ${isDarkMode
                                            ? 'text-white bg-gray-900 border-gray-600 focus:ring-2 focus:ring-white focus:border-black'
                                            : 'text-[#664C36] bg-white border-gray-300 focus:ring-2 focus:ring-[#A2574F] focus:border-[#A2574F]'
                                        }`}
                                >
                                    <option value="">All Orders</option>
                                    <option value="delivered">Past Orders</option>
                                    <option value="outfordelivery">Orders in Transit</option>
                                    <option value="queued">Queued Orders</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <table className="min-w-full">
                                <thead className={isDarkMode ? "bg-gray-600" : "bg-[#e4ccb8]"}>
                                    <tr>
                                        <th className={`px-6 py-3 pr-5 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Order ID</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Customer</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Order Confirmation Date</th>
                                        {filterView === 'delivered' && (
                                            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Delivery Date</th>
                                        )}
                                        <th className={`pl-12 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Status</th>
                                        <th className={`px-6 py-3 pl-4 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Total</th>
                                        <th className={`pl-25 py-3 pr-9 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
                                    {getFilteredOrders().map((order) => (
                                        <tr key={order._id}>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>{order._id}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>{order.userInfo?.name}</td>
                                            <td className={`px-6 py-4 pr-8 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            {filterView === 'delivered' && (
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>
                                                    {order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                            )}
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                                                <div className="flex items-center">
                                                    {getStatusComponent(order.status)}
                                                    <select
                                                        value={orders.find(o => o._id === order._id)?.status || order.status}
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                        className={`ml-2 text-xs rounded-md shadow-sm focus:outline-none
                                                        ${isDarkMode
                                                                ? 'text-white bg-gray-900 border-gray-600 focus:ring-2 focus:ring-white focus:border-black'
                                                                : 'text-[#664C36] bg-white border-gray-300 focus:ring-2 focus:ring-[#A2574F] focus:border-[#A2574F]'
                                                            }`}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Out for Delivery">Out for Delivery</option>
                                                        <option value="Delivered">Delivered</option>
                                                    </select>
                                                    {statusUpdateLoading === order._id && (
                                                        <svg className="animate-spin h-4 w-4 text-blue-500 ml-1" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>${order.totalPoints}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => openDetailsModal(order)}
                                                        className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
                                                    >
                                                        <Info className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOrder(order._id)}
                                                        className="text-[#A2574F] hover:text-[#64332d] px-2 py-1 rounded"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            
                {selectedOrderDetails && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-7 py-6 pb-20 text-center sm:block sm:p-0 backdrop-blur-md">
                            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h2 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-[#A2574F]'}`} id="modal-title">
                                                Order Details
                                            </h2>
                                            <div className="mt-2">
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong>Order ID:</strong> {selectedOrderDetails._id}
                                                </p>
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong>Customer Name:</strong> {selectedOrderDetails.userInfo?.name}
                                                </p>
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong>Phone:</strong> {selectedOrderDetails.userInfo?.phone}
                                                </p>
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong>Address:</strong> {selectedOrderDetails.userInfo?.address}
                                                </p>
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong>Order Date:</strong> {new Date(selectedOrderDetails.createdAt).toLocaleDateString()}
                                                </p>
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong>Status:</strong> {selectedOrderDetails.status}
                                                </p>
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong>Total Points:</strong> {selectedOrderDetails.totalPoints}
                                                </p>
                                                {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 && (
                                                    <div>
                                                        <strong className={isDarkMode ? 'text-white' : 'text-[#A2574F]'}>Items:</strong>
                                                        <ul className={isDarkMode ? 'text-gray-300 list-disc ml-5' : 'text-[#664C36] list-disc ml-5'}>
                                                            {selectedOrderDetails.items.map((item, index) => (
                                                                <li key={index}>
                                                                    {item.name} (Qty: {item.quantity}, Price: ${item.sellingPrice})
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {selectedOrderDetails.items && selectedOrderDetails.items.length === 0 && (
                                                    <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                        <strong>Items:</strong> No items in this order.
                                                    </p>
                                                )}
                                                {selectedOrderDetails.donation > 0 && (
                                                    <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                        <strong>Donation:</strong> ${selectedOrderDetails.donation}
                                                    </p>
                                                )}
                                                {selectedOrderDetails.userInfo?.promo && (
                                                    <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                        <strong>Promo Code:</strong> {selectedOrderDetails.userInfo.promo}
                                                    </p>
                                                )}
                                                {selectedOrderDetails.userInfo?.shipping && (
                                                    <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                        <strong>Shipping Method:</strong> {selectedOrderDetails.userInfo.shipping}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}>
                                    <button
                                        type="button"
                                        onClick={closeDetailsModal}
                                        className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-grey-900 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2574F] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${isDarkMode ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : ''}`}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        
                {isDeleteModalOpen && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 backdrop-blur-md">

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                            <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${isDarkMode ? 'bg-gray-800' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <AlertTriangle className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`} id="modal-headline">
                                                Confirm Delete
                                            </h3>
                                            <div className="mt-2">
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                                    Are you sure you want to delete this order? This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${isDarkMode ? 'bg-gray-700' : ''}`}>
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={confirmDeleteOrder}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium ${isDarkMode ? 'text-gray-300 bg-gray-800 border-gray-500' : 'text-gray-700'} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                                        onClick={cancelDeleteOrder}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderPage;