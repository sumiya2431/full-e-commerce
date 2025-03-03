const { client } = require("../config/db");
const axios = require("axios");

// ✅ GET all products
exports.getProducts = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM products');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error getting products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



// ✅ ADD a new product
exports.addProduct = async (req, res) => {
    const { title, description, price, category_id, stock, images, rating } = req.body;
    const createdAt = new Date();
    const updatedAt = new Date();

    try {
        const result = await client.query(
            `INSERT INTO products (title, description, price, category_id, stock, image, rating, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [title, description, price, category_id, stock, images, rating, createdAt, updatedAt]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ UPDATE a product dynamically with correct parameter indexing
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No fields provided for update" });
    }

    const allowedFields = ["title", "description", "price", "category_id", "stock", "image", "rating"];
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in updates) {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = $${index}`);
            values.push(updates[key]);
            index++;
        }
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: "Invalid fields provided" });
    }

    // ✅ Correctly add updated_at at the next available index
    values.push(new Date());
    fields.push(`updated_at = $${index}`);
    index++; // Increment for updated_at

    values.push(id); // Add product ID at the last index

    const query = `
        UPDATE products 
        SET ${fields.join(", ")}
        WHERE id = $${index} 
        RETURNING *;
    `;

    try {
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// ✅ DELETE a product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ GET all categories
exports.getCategories = async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM categories");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error getting categories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ ADD A NEW CATEGORY WITH VALIDATION
exports.addCategory = async (req, res) => {
    const { category_name, parent_category } = req.body;
    const createdAt = new Date();
    const updatedAt = new Date();

    // 🚨 Validate input (category_name is required)
    if (!category_name || category_name.trim() === "") {
        return res.status(400).json({ message: "category_name is required" });
    }

    try {
        const result = await client.query(
            `INSERT INTO categories (category_name, parent_category, created_at, updated_at) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [category_name, parent_category || null, createdAt, updatedAt]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};




// ✅ UPDATE a category
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { category_name, parent_category } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Category ID is required" });
    }
    if (!category_name) {
        return res.status(400).json({ message: "Category name is required!" });
    }

    try {
        const result = await client.query(
            `UPDATE categories 
             SET category_name = $1, parent_category = $2, updated_at = NOW() 
             WHERE id = $3 RETURNING *`,
            [category_name, parent_category, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category updated successfully", category: result.rows[0] });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.addProductsFromAPI = async (req, res) => {
    try {
        // Fetch products from the external API
        const response = await axios.get("https://fakestoreapi.com/products");
        const products = response.data;

        console.log("API Response:", response.data);

        if (!Array.isArray(products)) {
            return res.status(500).json({ message: "Invalid API response" });
        }
        
        const createdAt = new Date();
        const updatedAt = new Date();

        for (const product of products) {
            const { title, description, price, category, stock, image, rating } = product;

            // ✅ Ensure category exists or insert it
            let categoryId;
            const categoryResult = await client.query(
                `SELECT id FROM categories WHERE category_name = $1 LIMIT 1`,
                [category]
            );

            if (categoryResult.rows.length > 0) {
                categoryId = categoryResult.rows[0].id;
            } else {
                console.log("Category not found, inserting new category...");
                const newCategory = await client.query(
                    `INSERT INTO categories (category_name, created_at, updated_at) 
                     VALUES ($1, $2, $3) RETURNING id`,
                    [category, createdAt, updatedAt]
                );
                categoryId = newCategory.rows[0].id;
            }

            // ✅ Insert product into database
            await client.query(
                `INSERT INTO products (title, description, price, category_id, stock, image, rating, created_at, updated_at) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [title, description, price, categoryId, stock || 0, image || "", rating || 0, createdAt, updatedAt]
            );
        }

        res.status(201).json({ message: "Products added successfully!" });

    } catch (error) {
        console.error("Error fetching and inserting products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


