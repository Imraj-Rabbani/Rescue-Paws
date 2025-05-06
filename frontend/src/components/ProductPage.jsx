import React, { useState, useEffect, useContext } from 'react';
import { Plus, Edit, Trash2, Save, X, PlusCircle, MinusCircle, Info } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import { DarkmodeContext } from '../context/DarkmodeContext';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        id: '',
        name: '',
        description: '',
        purchaseCost: 0,
        sellingPrice: 0,
        imageUrl: '',
        stockQuantity: 0,
        category: '', // New field for category
        features: [], // New field for features
        productAddDate: new Date(), // New field for product add date
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('Products');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const { isDarkMode } = useContext(DarkmodeContext);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const openDetailsModal = (product) => {
        setSelectedProductDetails(product);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedProductDetails(null);
    };

    // Load products from the database on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/products');
                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);
    const handleAddProduct = () => {
        setIsEditing(false);
        setNewProduct({
            id: '',
            name: '',
            description: '',
            purchaseCost: 0,
            sellingPrice: 0,
            imageUrl: '',
            stockQuantity: 0,
            category: '', // Reset category
            features: [], // Reset features
            productAddDate: new Date(), // Set initial add date
        });
        setIsDialogOpen(true);
    };
    const handleSaveProduct = async () => {
        try {
            const productData = isEditing ? editingProduct : newProduct;
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `http://localhost:4000/api/products/${editingProduct.id}` : 'http://localhost:4000/api/products';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to ${isEditing ? 'update' : 'add'} product: ${response.status} - ${errorMessage}`);
            }
            const savedProduct = await response.json();
            if (isEditing) {
                setProducts(products.map((p) => (p.id === editingProduct.id ? savedProduct : p)));
            } else {
                setProducts([...products, savedProduct]);
            }
            setIsDialogOpen(false);
            setIsEditing(false);
            setNewProduct({ id: '', name: '', description: '', purchaseCost: 0, sellingPrice: 0, imageUrl: '', stockQuantity: 0, category: '', features: [], productAddDate: new Date() });
            setEditingProduct(null);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };
    const handleEditProduct = (product) => {
        setIsEditing(true);
        setEditingProduct(product);
        setNewProduct({ ...product });
        setIsDialogOpen(true);
    };
    const handleDeleteProduct = (id) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const confirmDeleteProduct = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/products/${productToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Failed to delete product: ${response.status}`);
            }
            setProducts(products.filter((p) => p.id !== productToDelete));
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };
    const cancelDeleteProduct = () => {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (isEditing) {
            setEditingProduct({ ...editingProduct, [name]: value });
        } else {
            setNewProduct({ ...newProduct, [name]: value });
        }

    };
    // Handler for category input change
    const handleCategoryChange = (e) => {
        const { value } = e.target;
        if (isEditing) {
            setEditingProduct({ ...editingProduct, category: value });
        } else {
            setNewProduct({ ...newProduct, category: value });
        }
    };

    // Handler for features input change
    const handleFeaturesChange = (e) => {
        const { value } = e.target;
        if (isEditing) {
            setEditingProduct({ ...editingProduct, features: value.split(',').map(item => item.trim()) });
        } else {
            setNewProduct({ ...newProduct, features: value.split(',').map(item => item.trim()) });
        }
    };

    const handleImageChange = (e) => {
        const { files } = e.target;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    const imageUrl = event.target.result;
                    if (isEditing) {
                        setEditingProduct({ ...editingProduct, imageUrl });
                    } else {
                        setNewProduct({ ...newProduct, imageUrl });
                    }
                }
            };
            reader.readAsDataURL(files[0]);
        }
    };
    const handleCloseModal = () => {
        setIsDialogOpen(false);
        setIsEditing(false);
        setNewProduct({
            id: '',
            name: '',
            description: '',
            purchaseCost: 0,
            sellingPrice: 0,
            imageUrl: '',
            stockQuantity: 0,
            category: '',
            features: [],
            productAddDate: new Date(),
        });
        setEditingProduct(null);
    };
    const handleIncreaseStock = async (productId) => {
        const updatedProducts = products.map(product => {
            if (product.id === productId) {
                const newQuantity = (product.stockQuantity || 0) + 1;
                updateStockInDatabase(productId, newQuantity);
                return { ...product, stockQuantity: newQuantity };
            }
            return product;
        }); setProducts(updatedProducts);
    };
    const handleDecreaseStock = async (productId) => {
        const updatedProducts = products.map(product => {
            if (product.id === productId && (product.stockQuantity || 0) > 0) {
                const newQuantity = (product.stockQuantity || 0) - 1;
                updateStockInDatabase(productId, newQuantity);
                return { ...product, stockQuantity: newQuantity };
            }
            return product;
        });
        setProducts(updatedProducts);
    };
    const updateStockInDatabase = async (productId, newQuantity) => {
        try {
            const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stockQuantity: newQuantity }),
            });
            if (!response.ok) {
                console.error(`Failed to update stock for product ${productId}: ${response.status}`);
                const originalProduct = products.find(p => p.id === productId);
                setProducts(products.map(p => p.id === productId ? originalProduct : p));
            }
        } catch (error) {
            console.error('Error updating product stock:', error);
            const originalProduct = products.find(p => p.id === productId);
            setProducts(products.map(p => p.id === productId ? originalProduct : p));
        }
    };
    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-[#F5F5F5]'}`}>
            <AdminNavbar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                activeTab={activeTab}
                setActiveTab={setActiveTab} />
            <div className="flex-1 p-6">
                <h1 className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-[#64332d]'}`}><u>Products Details</u></h1>
                <div className={`shadow-md rounded-md flex justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="w-full">
                        <div className={`p-4 rounded-t-md ${isDarkMode ? 'bg-gray-800' : 'bg-[#f5f5f5]'}`}>
                            <h2 className={`text-lg font-semibold text-center ${isDarkMode ? 'text-white' : 'text-[#A2574F]'}`}>Product List</h2>
                            <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>View and manage your products</p>
                        </div>
                        <div className="p-4">
                            <table className="min-w-full">
                                <thead className={isDarkMode ? "bg-gray-600" : "bg-[#e4ccb8]"}>
                                    <tr>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Image</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>ID</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Name</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Stock</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {product.imageUrl && (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="h-16 w-16 rounded object-cover"
                                                    />)}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>{product.id}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>{product.name}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-[#664C36]'}`}>
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => handleDecreaseStock(product.id)}
                                                        className="text-red-500 hover:text-red-700 focus:outline-none" >
                                                        <MinusCircle className="h-4 w-4" />
                                                    </button>
                                                    <span className="mx-2">{product.stockQuantity || 0}</span>
                                                    <button
                                                        onClick={() => handleIncreaseStock(product.id)}
                                                        className="text-green-500 hover:text-green-700 focus:outline-none" >
                                                        <PlusCircle className="h-4 w-4" />
                                                    </button>
                                                </div></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => openDetailsModal(product)}
                                                        className=" text-gray-500 hover:text-gray-700 px-2 py-1 rounded" >
                                                        <Info className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditProduct(product)}
                                                        className=" text-blue-500 hover:text-blue-700 px-2 py-1 rounded" >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className=" text-[#A2574F] hover:text-[#64332d] px-2 py-1 rounded" >
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
                {/* Add Product Section */}
                <div className={`mt-8 shadow-md rounded-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-[#A2574F]'}`}>Add New Product</h2>
                            <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>Add a new product to the list</p>
                        </div>
                        <button
                            onClick={handleAddProduct}
                            className="bg-[#A2574F] hover:bg-[#64332d] text-white font-bold py-2 px-4 rounded"
                        >
                            <Plus className="mr-2 h-4 w-4 inline-block" /> Add Product
                        </button>
                    </div>
                </div>
                <div className="fixed z-10 inset-0 overflow-y-auto" style={{ display: isDialogOpen ? 'block' : 'none' }}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 backdrop-blur-md">
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h2 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-[#A2574F]'}`} id="modal-title">
                                            {isEditing ? 'Edit Product' : 'Add Product'} </h2>
                                        <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                            {isEditing
                                                ? 'Make changes to the product below. Click save when you are done.'
                                                : 'Enter product details below.'}
                                        </p>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <label htmlFor="id" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                                                    Product ID
                                                </label>
                                                <input
                                                    id="id"
                                                    name="id"
                                                    value={isEditing ? editingProduct?.id || '' : newProduct.id}
                                                    onChange={handleInputChange}
                                                    className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                    required
                                                    readOnly={isEditing}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <label htmlFor="productAddDate" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                                                    Product Add Date
                                                </label>
                                                <input
                                                    id="productAddDate"
                                                    type="date"
                                                    name="productAddDate"
                                                    value={isEditing ? new Date(editingProduct?.productAddDate).toISOString().split('T')[0] : new Date(newProduct.productAddDate).toISOString().split('T')[0]}
                                                    onChange={handleInputChange}
                                                    className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                    readOnly={isEditing}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <label htmlFor="name" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                                                    Name
                                                </label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    value={isEditing ? editingProduct?.name || '' : newProduct.name}
                                                    onChange={handleInputChange}
                                                    className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <label htmlFor="description" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                                                    Description
                                                </label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    value={isEditing ? editingProduct?.description || '' : newProduct.description}
                                                    onChange={handleInputChange}
                                                    className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <label htmlFor="purchaseCost" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                                                    Purchase Cost
                                                </label>
                                                <input
                                                    id="purchase"
                                                    type="number"
                                                    name="purchaseCost"
                                                    value={isEditing ? editingProduct?.purchaseCost || 0 : newProduct.purchaseCost}
                                                    onChange={handleInputChange}
                                                    className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <label htmlFor="sellingPrice" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                                                    Selling Price
                                                </label>
                                                <input
                                                    id="sellingPrice"
                                                    type="number"
                                                    name="sellingPrice"
                                                    value={isEditing ? editingProduct?.sellingPrice || 0 : newProduct.sellingPrice}
                                                    onChange={handleInputChange}
                                                    className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                    required
                                                />
                                            </div>
                                            {/* Stock Quantity Field */}
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <label htmlFor="stockQuantity" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                                                    Stock Quantity
                                                </label>
                                                <input
                                                    id="stockQuantity"
                                                    type="number"
                                                    name="stockQuantity"
                                                    value={isEditing ? editingProduct?.stockQuantity || 0 : newProduct.stockQuantity}
                                                    onChange={handleInputChange}
                                                    className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <label htmlFor="category" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                                                    Category
                                                </label>
                                                <input
                                                    id="category"
                                                    type="text"
                                                    name="category"
                                                    value={isEditing ? editingProduct?.category || '' : newProduct.category}
                                                    onChange={handleCategoryChange}
                                                    className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <label htmlFor="features" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                                                    Features (comma-separated)
                                                </label>
                                                <input
                                                    id="features"
                                                    type="text"
                                                    name="features"
                                                    value={isEditing ? editingProduct?.features?.join(', ') || '' : newProduct.features?.join(', ')}
                                                    onChange={handleFeaturesChange}
                                                    className={`col-span-3 rounded border px-3 py-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <label htmlFor="image" className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                                                    Image
                                                </label>
                                                <div className="col-span-3">
                                                    <input
                                                        id="image"
                                                        type="file"
                                                        name="image"
                                                        onChange={handleImageChange}
                                                        className={`${isDarkMode ? 'file:bg-gray-700 file:text-white file:border-gray-600 text-white' : ''}`}
                                                        accept="image/*"
                                                    />
                                                    {isEditing && editingProduct?.imageUrl && (
                                                        <img
                                                            src={editingProduct.imageUrl}
                                                            alt="Product Preview"
                                                            className="mt-2 h-16 w-16 rounded object-cover"
                                                        />)}
                                                    {!isEditing && newProduct.imageUrl && (
                                                        <img
                                                            src={newProduct.imageUrl}
                                                            alt="Product Preview"
                                                            className="mt-2 h-16 w-16 rounded object-cover"
                                                        />)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <button
                                    type="submit"
                                    onClick={handleSaveProduct}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#A2574F] text-base font-medium text-white hover:bg-[#64332d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2574F] sm:ml-3 sm:w-auto sm:text-sm" >
                                    <Save className="mr-2 h-4 w-4 inline-block" /> {isEditing ? 'Save' : 'Add'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2  text-base font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2574F] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`} >
                                    <X className="mr-2 h-4 w-4 inline-block" /> Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Details Modal */}
                <div className="fixed z-10 inset-0 overflow-y-auto" style={{ display: isDetailsModalOpen ? 'block' : 'none' }}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 backdrop-blur-md">
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-[#A2574F]'}`} id="modal-title">
                                            Product Details
                                        </h3>
                                        {selectedProductDetails && (
                                            <div className="mt-2">
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong> ID: </strong> {selectedProductDetails.id}
                                                </p>
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong> Added On:</strong> {new Date(selectedProductDetails.productAddDate).toLocaleDateString()}
                                                </p>
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong> Name: </strong> {selectedProductDetails.name}
                                                </p>
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong> Description: </strong>{selectedProductDetails.description}
                                                </p>
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong> Purchase Cost:</strong> {selectedProductDetails.purchaseCost?.toFixed(2)}$
                                                </p>
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong> Selling Price: </strong> {selectedProductDetails.sellingPrice?.toFixed(2)}$
                                                </p>
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong> Stock Quantity:</strong> {selectedProductDetails.stockQuantity}
                                                </p>
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong> Category:</strong> {selectedProductDetails.category}
                                                </p>
                                                {selectedProductDetails.features && selectedProductDetails.features.length > 0 && (
                                                    <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                        <strong> Features:</strong> {selectedProductDetails.features.join(', ')}
                                                    </p>
                                                )}
                                                <p className={isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}>
                                                    <strong> Added On:</strong> {new Date(selectedProductDetails.productAddDate).toLocaleDateString()}
                                                </p>
                                                {selectedProductDetails.imageUrl && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={selectedProductDetails.imageUrl}
                                                            alt={selectedProductDetails.name}
                                                            className="h-24 w-24 rounded object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <button
                                    type="button"
                                    className={`w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2574F] sm:ml-3 sm:w-auto sm:text-sm ${isDarkMode ? 'bg-gray-800 text-bg-white border-gray-700 hover:bg-gray-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                    onClick={closeDetailsModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Delete Confirmation Modal */}
                <div className="fixed z-10 inset-0 overflow-y-auto" style={{ display: isDeleteModalOpen ? 'block' : 'none' }}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 backdrop-blur-md">
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="sm:flex sm:items-start justify-center">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-center">
                                        <h2 className={`text-lg leading-6 font-medium text-center ${isDarkMode ? 'text-white' : 'text-[#A2574F]'}`} id="modal-title">
                                            Are you sure?
                                        </h2>
                                        <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-[#664C36]'}`}>
                                            Are you sure you want to delete this product?
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <button
                                    type="button"
                                    onClick={confirmDeleteProduct}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#A2574F] text-base font-medium text-white hover:bg-[#64332d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2574F] sm:ml-3 sm:w-auto sm:text-sm" >
                                    Yes, Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelDeleteProduct}
                                    className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2  text-base font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2574F] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${isDarkMode ? 'bg-gray-800 text-bg-white border-gray-700 hover:bg-gray-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    No, Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProductPage;