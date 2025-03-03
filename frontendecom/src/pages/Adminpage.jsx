import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, Table } from "../components/ui"; 

// import { Button, Input, Table } from "@/components/ui";
import "../styles/Admin.css"; 

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    stock: "",
    image: "",
    rating: "",
  });

  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/products");
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/categories");
    setCategories(res.data);
  };

  const addProduct = async () => {
    await axios.post("http://localhost:5000/api/admin/addingproduct", newProduct);
    fetchProducts();
  };

  const updateProduct = async () => {
    await axios.put(`http://localhost:5000/api/admin/updateproduct/${editingProduct.id}`, editingProduct);
    setEditingProduct(null);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/deleteproduct/${id}`);
    fetchProducts();
  };

  const addCategory = async () => {
    await axios.post("http://localhost:5000/api/admin/addcategory", { category_name: newCategory });
    fetchCategories();
  };

  const updateCategory = async () => {
    await axios.put(`http://localhost:5000/api/admin/updatecategory/${editingCategory.id}`, { category_name: editingCategory.category_name });
    setEditingCategory(null);
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/deletecategory/${id}`);
    fetchCategories();
  };

  return (
    <div className="admin-panel">
      <h1 className="admin-title">⚙️ Admin Panel ⚙️</h1>

      <div className="section">
        <h2>➕ Add New Product</h2>
        <Input placeholder="📝 Title" onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} />
        <Input placeholder="📜 Description" onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
        <Input placeholder="💰 Price" type="number" onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
        <Button className="btn-add" onClick={addProduct}>Add Product ✅</Button>
      </div>

      <div className="section">
        <h2>📂 Add New Category</h2>
        <Input placeholder="🏷️ Category Name" onChange={(e) => setNewCategory(e.target.value)} />
        <Button className="btn-add" onClick={addCategory}>Add Category ✅</Button>
      </div>

      <h2 className="section-title">🛍️ Products</h2>
      <Table className="custom-table">
        <thead>
          <tr>
            <th>📌 Title</th>
            <th>📜 Description</th>
            <th>💰 Price</th>
            <th>🛠️ Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                {editingProduct?.id === product.id ? (
                  <Input value={editingProduct.title} onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })} />
                ) : (
                  product.title
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <Input value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
                ) : (
                  product.description
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <Input value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
                ) : (
                  product.price
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <Button className="btn-update" onClick={updateProduct}>Save</Button>
                ) : (
                  <>
                    <Button className="btn-edit" onClick={() => setEditingProduct(product)}>✏️ Edit</Button>
                    <Button className="btn-delete" onClick={() => deleteProduct(product.id)}>❌ Delete</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="section-title">📋 Categories</h2>
      <Table className="custom-table">
        <thead>
          <tr>
            <th>🏷️ Name</th>
            <th>🛠️ Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                {editingCategory?.id === category.id ? (
                  <Input value={editingCategory.category_name} onChange={(e) => setEditingCategory({ ...editingCategory, category_name: e.target.value })} />
                ) : (
                  category.category_name
                )}
              </td>
              <td>
                {editingCategory?.id === category.id ? (
                  <Button className="btn-update" onClick={updateCategory}>Save</Button>
                ) : (
                  <>
                    <Button className="btn-edit" onClick={() => setEditingCategory(category)}>✏️ Edit</Button>
                    <Button className="btn-delete" onClick={() => deleteCategory(category.id)}>❌ Delete</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminPanel;
