const express = require('express');
const router = express.Router();

const crudCategoryController = require('../controllers/categoryController');

router.get('/', crudCategoryController.index);
router.post('/create',crudCategoryController.create);
router.get('/get-one/:id',crudCategoryController.getOne);
router.post('/update/:id',crudCategoryController.update);

module.exports = router;
