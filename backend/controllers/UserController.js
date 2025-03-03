
const { client } = require('../config/db');

exports.getProducts = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error('Error while getting products:', error);
    }
};
///e-commerce=# CREATE TABLE Wishlist (
//     id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
//     product_id INT NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );    
exports.addToWishlist = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        await client.query('INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)', [userId, productId]);
        res.status(200).json({ message: 'Item added to wishlist' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// e-commerce=# CREATE TABLE Cart (
//     id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
//     product_id INT NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
//     quantity INT NOT NULL CHECK (quantity > 0),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

exports.addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        await client.query('INSERT INTO Cart (user_id, product_id, quantity) VALUES ($1, $2, $3)', [userId, productId, quantity]);
        res.status(200).json({ message: 'Item added to cart' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



exports.placeOrder = async (req, res) => {
    const { userId } = req.body;

    try {
        
        const cartItems = await client.query(
            'SELECT product_id, quantity FROM cart WHERE user_id = $1',
            [userId]
        );

        if (cartItems.rows.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const date = new Date();
        const products = cartItems.rows.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
        }));

        
        await client.query(
            'INSERT INTO orders (user_id, products, status, payment_status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)',
            [userId, JSON.stringify(products), 'Pending', 'unpaid', date, date]
        );

        // Clear the user's cart after placing the order
        await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);

        res.status(200).json({ message: 'Order placed successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



exports.addReview = async (req, res) => {
    const { userId, productId, rating, comment } = req.body;

    try {
      
        await client.query(
            'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4)',
            [userId, productId, rating, comment]
        );

        res.status(200).json({ message: 'Review added successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.error('Error while adding review:', err);
    }
};
