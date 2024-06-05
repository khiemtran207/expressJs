const asyncHandler = require("express-async-handler");
const { validateCategory } = require('../middelware/categoriesHandle/validateFormSubmit');
const categoryModel = require('../models/categoryModel')

exports.index = async (req, res) => {
    try {
        const categories = await categoryModel.getAll();
        res.locals.title = "Categories Management";
        res.render('categories/index', {categories: categories});
    } catch (error) {
        console.error('Error in categoryController.index:', error);
    }
};

exports.getOne = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryData = await categoryModel.getOne(categoryId);
        res.status(201).json({
            message: 'Get data category has id: ' + categoryId + "successfully",
            category: categoryData
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'An error occurred while get the category.'
        });
    }
};

exports.update = async (req, res) => {
    try {
        const categoryData = await categoryModel.update(req.body);
        res.status(201).json({
            message: 'Update data category successfully',
            category: categoryData
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'An error occurred while get the category.'
        });
    }
};

exports.create = [
    validateCategory,
    asyncHandler(async (req, res) => {
        try {
            const newCategory = await categoryModel.create(req.body);
            res.status(201).json({
                message: 'Category created successfully',
                category: newCategory
            });
        } catch (error) {
            console.error('Error in categoryController.create:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'An error occurred while creating the category.'
            });
        }
    })
];