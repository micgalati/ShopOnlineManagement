import axios from "axios";
import backendUrl from "../../config";
import Products from "../../views/products";

const api = axios.create({
  baseURL: `${backendUrl}`,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleApiError = (error) => {
  console.log("Error during API call:", error);
  throw error;
};

const getAllProducts = async () => {
    try {
        const response = await api.get(`/products/`, {
           headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const ProductsAPI = {
    getAllProducts,
};

export default ProductsAPI;