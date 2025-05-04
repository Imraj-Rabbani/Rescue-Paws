import React, { useState, useContext } from 'react';
import {Edit, Trash2, Save, X, AlertTriangle, Info, Truck, CheckCircle, Clock } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import { DarkmodeContext } from '../context/DarkmodeContext';

const OrderPage = () => {
    const [orders, setOrders] = useState([
        { id: '1', customerName: 'John Doe', orderDate: '2024-01-15', deliveryDate: '2024-01-20', status: 'Delivered', total: 120.00, items: ['Product A', 'Product B'] },
        { id: '2', customerName: 'Jane Smith', orderDate: '2024-02-01', deliveryDate: '2024-02-05', status: 'Out for Delivery', total: 85.50, items: ['Product C'] },
        { id: '3', customerName: 'John Doe', orderDate: '2024-02-10', deliveryDate: '2024-02-15', status: 'Pending Dispatch', total: 200.00, items: ['Product D', 'Product E', 'Product F'] },
        { id: '4', customerName: 'Alice Johnson', orderDate: '2024-03-01', deliveryDate: '2024-03-10', status: 'Delivered', total: 50.00, items: ['Product G'] },
        { id: '5', customerName: 'Bob Williams', orderDate: '2024-03-15', deliveryDate: '2024-03-20', status: 'Out for Delivery', total: 95.00, items: ['Product H', 'Product I'] },
        { id: '6', customerName: 'Charlie Brown', orderDate: '2024-04-01', deliveryDate: '2024-04-07', status: 'Pending Dispatch', total: 150.75, items: ['Product J', 'Product K'] },
        { id: '7', customerName: 'Diana Prince', orderDate: '2024-04-10', deliveryDate: '2024-04-18', status: 'Delivered', total: 75.20, items: ['Product L'] },
    ]);

    const [editingOrderId, setEditingOrderId] = useState(null);
    const [newOrder, setNewOrder] = useState({
        id: '',
        customerName: '',
        orderDate: '',
        deliveryDate: '',
        status: '',
        total: '',
        items: [],
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
            filtered = orders.filter(order => order.status === 'Pending Dispatch');
        }
        return filtered;
    };

    const handleAddOrder = () => {
        if (
            !newOrder.id ||
            !newOrder.customerName ||
            !newOrder.orderDate ||
            !newOrder.deliveryDate ||
            !newOrder.status ||
            !newOrder.total
        ) {
            setError('Please fill in all fields.');
            return;
        }

        const totalNum = Number(newOrder.total);
        if (isNaN(totalNum)) {
            setError('Total must be a valid number.');
            return;
        }

        setOrders([...orders, { ...newOrder, total: totalNum, id: crypto.randomUUID(), items: newOrder.items }]);
        setNewOrder({
            id: '',
            customerName: '',
            orderDate: '',
            deliveryDate: '',
            status: '',
            total: '',
            items: [],
        });
        setError('');
    };

    const handleEditOrder = (order) => {
        setEditingOrderId(order.id);
        setNewOrder(order);
    };

    const handleSaveOrder = () => {
        if (!newOrder.id ||
            !newOrder.customerName ||
            !newOrder.orderDate ||
            !newOrder.deliveryDate ||
            !newOrder.status ||
            !newOrder.total) {
            setError('Please fill in all fields.');
            return;
        }
        const totalNum = Number(newOrder.total);
        if (isNaN(totalNum)) {
            setError('Total must be a valid number.');
            return;
        }

        if (editingOrderId) {
            setOrders(
                orders.map((order) =>
                    order.id === editingOrderId ? { ...newOrder, total: totalNum } : order
                )
            );
        } else {
            setOrders([...orders, { ...newOrder, id: crypto.randomUUID(), total: totalNum, items: newOrder.items }]);
        }
        setEditingOrderId(null);
        setNewOrder({
            id: '',
            customerName: '',
            orderDate: '',
            deliveryDate: '',
            status: '',
            total: '',
            items: [],
        });
        setError('');
    };

    const handleDeleteOrder = (id) => {
        setOrderToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteOrder = () => {
        setOrders(orders.filter((order) => order.id !== orderToDelete));
        setIsDeleteModalOpen(false);
        setOrderToDelete(null);
    };

    const cancelDeleteOrder = () => {
        setIsDeleteModalOpen(false);
        setOrderToDelete(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder({ ...newOrder, [name]: value });
    };

    const handleCloseModal = () => {
        setEditingOrderId(null);
        setNewOrder({
            id: '',
            customerName: '',
            orderDate: '',
            deliveryDate: '',
            status: '',
            total: '',
            items: [],
        });
        setError('');
    };

    const setOrderView = (viewType) => {
        setFilterView(viewType);
    };

    const getStatusComponent = (status) => {
        const baseClass = "inline-flex items-center rounded-full px-2 py-1 text-xs border";
        const textBaseClass = "ml-0";
        const iconClass = "h-3 w-3 mr-1";
        switch (status) {
            case 'Pending Dispatch':
                return <span className={`${baseClass} ${isDarkMode ? 'bg-indigo-800 text-indigo-100 border-indigo-700' : 'bg-indigo-100 text-indigo-800 border-indigo-300'} ${textBaseClass}`}><Clock className={`${iconClass} w-4 h-4 mr-1`} /> Pending Dispatch</span>;
            case 'Out for Delivery':
                return <span className={`${baseClass} ${isDarkMode ? 'bg-orange-800 text-orange-100 border-orange-700' : 'bg-orange-100 text-orange-800 border-orange-300'} ${textBaseClass}`}><Truck className={`${iconClass} w-4 h-4 mr-1`} /> Shipped</span>;
            case 'Delivered':
                return <span className={`${baseClass} ${isDarkMode ? 'bg-green-800 text-green-100 border-green-700' : 'bg-green-100 text-green-800 border-green-300'} ${textBaseClass}`}><CheckCircle className={`${iconClass} w-4 h-4 mr-1`} /> Delivered</span>;
            default:
                return <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{status}</span>;
        }
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
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Order ID</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Customer</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Order Date</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Delivery Date</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Status</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Total</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
                                    {getFilteredOrders().map((order) => (
                                        <tr key={order.id}>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>{order.id}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>{order.customerName}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>{order.orderDate}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>{order.deliveryDate}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm`}>{getStatusComponent(order.status)}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>${order.total.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => openDetailsModal(order)}
                                                        className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
                                                    >
                                                        <Info className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditOrder(order)}
                                                        className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOrder(order.id)}
                                                        className="text-[#A2574F] hover:text-[#64332d]
                            px-2 py-1 rounded"
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

                {editingOrderId !== null && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h2 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-[#A2574F]'}`} id="modal-title">
                                                {editingOrderId ? 'Edit Order' : 'Add Order'}
                                            </h2>
                                            <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                {editingOrderId
                                                    ? 'Make changes to the order below. Click save when you\'re done.'
                                                    : 'Enter order details below.'}
                                            </p>
                                            {error && (
                                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                                                    <strong className="font-bold">Error: </strong>
                                                    <span className="block sm:inline">{error}</span>
                                                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                                        <AlertTriangle className="h-6 w-6 fill-current" />
                                                    </span>
                                                </div>
                                            )}
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <label htmlFor="orderId" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Order ID</label>
                                                    <input
                                                        id="orderId"
                                                        name="id"
                                                        value={newOrder.id}
                                                        onChange={handleInputChange}
                                                        className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <label htmlFor="customerName" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Customer Name</label>
                                                    <input
                                                        id="customerName"
                                                        name="customerName"
                                                        value={newOrder.customerName}
                                                        onChange={handleInputChange}
                                                        className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <label htmlFor="orderDate" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Order Date</label>
                                                    <input
                                                        id="orderDate"
                                                        type="date"
                                                        name="orderDate"
                                                        value={newOrder.orderDate}
                                                        onChange={handleInputChange}
                                                        className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <label htmlFor="deliveryDate" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Delivery Date</label>
                                                    <input
                                                        id="deliveryDate"
                                                        type="date"
                                                        name="deliveryDate"
                                                        value={newOrder.deliveryDate}
                                                        onChange={handleInputChange}
                                                        className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <label htmlFor="status" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Status</label>
                                                    <input
                                                        id="status"
                                                        name="status"
                                                        value={newOrder.status}
                                                        onChange={handleInputChange}
                                                        className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <label htmlFor="total" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Total</label>
                                                    <input
                                                        id="total"
                                                        type="number"
                                                        name="total"
                                                        value={newOrder.total}
                                                        onChange={handleInputChange}
                                                        className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                        required
                                                    />
                                                </div>
                                                {/* Add items input here if needed for editing */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}>
                                    <button
                                        type="submit"
                                        onClick={handleSaveOrder}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#A2574F] text-base font-medium text-white hover:bg-[#64332d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2574F] sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        <Save className="mr-2 h-4 w-4 inline-block" /> {editingOrderId ? 'Save' : 'Add'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-grey-900 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2574F] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${isDarkMode ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : ''}`}
                                    >
                                        <X className="mr-2 h-4 w-4 inline-block" /> Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


        {/* Delete Confirmation Modal */}
        <div className="fixed z-10 inset-0 overflow-y-auto" style={{ display: isDeleteModalOpen ? 'block' : 'none' }}>
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className={isDarkMode ? "inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" : "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"}>
              <div className={isDarkMode ? "bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4" : "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"}>
                <div className="sm:flex sm:items-start justify-center">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-center">
                    <h2 className={isDarkMode ? "text-lg leading-6 font-medium text-white text-center" : "text-lg leading-6 font-medium text-[#A2574F] text-center"} id="modal-title">
                      Are you sure?
                    </h2>
                    <p className={isDarkMode ? "text-sm text-gray-300 text-center" : "text-sm text-[#664C36] text-center"}>
                      Are you sure you want to delete this order?
                    </p>
                  </div>
                </div>
              </div>
              <div className={isDarkMode ? "bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-center" : "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-center"}>
                <button
                  type="button"
                  onClick={confirmDeleteOrder}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#A2574F] text-base font-medium text-white hover:bg-[#64332d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2574F] sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  onClick={cancelDeleteOrder}
                  className={isDarkMode ? "mt-3 w-full inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2574F] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" : "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2574F] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"}
                >
                  No, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrderDetails && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h2 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-[#A2574F]'}`} id="modal-title">
                        Order Details
                      </h2>
                      <div className="mt-2">
                        <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                          <strong>Order ID:</strong> {selectedOrderDetails.id}
                        </p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                          <strong>Customer Name:</strong> {selectedOrderDetails.customerName}
                        </p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                          <strong>Order Date:</strong> {selectedOrderDetails.orderDate}
                        </p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                          <strong>Delivery Date:</strong> {selectedOrderDetails.deliveryDate}
                        </p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                          <strong>Status:</strong> {selectedOrderDetails.status}
                        </p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                          <strong>Total:</strong> ${selectedOrderDetails.total.toFixed(2)}
                        </p>
                        {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 && (
                          <div>
                            <strong className={isDarkMode ? 'text-white' : 'text-[#A2574F]'}>Items:</strong>
                            <ul className={isDarkMode ? 'text-gray-300 list-disc ml-5' : 'text-[#664C36] list-disc ml-5'}>
                              {selectedOrderDetails.items.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selectedOrderDetails.items && selectedOrderDetails.items.length === 0 && (
                          <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                            <strong>Items:</strong> No items in this order.
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
      </div>
    </div>
  );
};

export default OrderPage;
