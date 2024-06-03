// const model = require('models/db');
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res) => {
    res.render('admin/products/index');
});
