const express = require('express');
const router = express.Router();

const crudProductController = require('../controllers/productController');

router.get('/', crudProductController.index);

module.exports = router;
