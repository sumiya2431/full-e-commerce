const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UserController');

router.get('/products', userController.getProducts);
router.post('/wishlist', userController.addToWishlist);
router.post('/cart', userController.addToCart);
router.post('/orders', userController.placeOrder);
router.post('/reviews', userController.addReview);
module.exports = rsoutesr;