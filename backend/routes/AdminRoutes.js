const express = require('express');
const router = express.Router();
const { 
    getProducts, addProduct, updateProduct, deleteProduct, 
    getCategories, addCategory, updateCategory, deleteCategory ,addProductsFromAPI 
} = require('../controllers/AdminController');  

router.get('/products', getProducts);         
router.post('/addingproduct', addProduct);    
router.put('/updateproduct/:id', updateProduct); 
router.delete('/deleteproduct/:id', deleteProduct); 
router.post("/products/fetchFromAPI", addProductsFromAPI);


router.get('/categories', getCategories);         
router.post('/addcategory', addCategory);         
router.put('/updatecategory/:id', updateCategory); 
router.delete('/deletecategory/:id', deleteCategory); 

module.exports = router;

