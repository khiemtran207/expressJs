var express = require('express');
var router = express.Router();
const upload = require('../configs/multer.config');

/* GET home page. */
router.get('/admin', function(req, res, next) {
  res.render('admin/dashboard' );
});
router.use('/admin/categories', require('./categoryRoutes'));
router.use('/admin/products', require('./productRoutes'));
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image files uploaded!');
  }
  const imagePath = req.file.path;
  res.send(imagePath);
});

module.exports = router;
