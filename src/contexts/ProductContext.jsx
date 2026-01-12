import { createContext, useContext, useState } from "react";

const ProductContext = createContext(null);

const INITIAL_PRODUCTS = [
  { id: 1, name: "Wheat Grain", category: "Grains", quantity: 5000, unit: "kg", price: 2.5, status: "in-stock" },
  { id: 2, name: "Rice Basmati", category: "Grains", quantity: 3200, unit: "kg", price: 4.2, status: "in-stock" },
  { id: 3, name: "Corn Seeds", category: "Seeds", quantity: 1500, unit: "kg", price: 3.0, status: "low-stock" },
  { id: 4, name: "Soybean Oil", category: "Oils", quantity: 800, unit: "liters", price: 5.5, status: "in-stock" },
  { id: 5, name: "Coffee Beans", category: "Beverages", quantity: 450, unit: "kg", price: 12.0, status: "in-stock" },
  { id: 6, name: "Sugar Cane", category: "Sweeteners", quantity: 2800, unit: "kg", price: 1.8, status: "in-stock" },
  { id: 7, name: "Cotton Bales", category: "Fibers", quantity: 120, unit: "bales", price: 85.0, status: "low-stock" },
  { id: 8, name: "Cocoa Powder", category: "Beverages", quantity: 0, unit: "kg", price: 8.5, status: "out-of-stock" },
  { id: 9, name: "Olive Oil", category: "Oils", quantity: 600, unit: "liters", price: 15.0, status: "in-stock" },
  { id: 10, name: "Barley", category: "Grains", quantity: 1800, unit: "kg", price: 2.8, status: "in-stock" },
];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map((p) => p.id)) + 1,
      status: product.quantity > 500 ? "in-stock" : product.quantity > 0 ? "low-stock" : "out-of-stock",
    };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          updated.status = updated.quantity > 500 ? "in-stock" : updated.quantity > 0 ? "low-stock" : "out-of-stock";
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const getProduct = (id) => products.find((p) => p.id === id);

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + p.quantity * p.price, 0),
    lowStock: products.filter((p) => p.status === "low-stock").length,
    outOfStock: products.filter((p) => p.status === "out-of-stock").length,
    categories: [...new Set(products.map((p) => p.category))].length,
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        stats,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
