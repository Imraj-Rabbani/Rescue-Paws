import axios from 'axios';

const API_URL = 'http://localhost:4000/api/products'; // Update if you deployed it somewhere

// Fetch all products
export const getAllProducts = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
};

// Fetch single product (optional for detail page)
export const getProductById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    return null;
  }
};
