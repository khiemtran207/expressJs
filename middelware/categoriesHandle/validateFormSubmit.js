const { body, validationResult } = require('express-validator');

exports.validateCategory = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .isLength({ max: 255 }).withMessage('Name must be at most 255 characters'),

    body('slug')
        .notEmpty().withMessage('Slug is required')
        .isString().withMessage('Slug must be a string')
        .isLength({ max: 255 }).withMessage('Slug must be at most 255 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors });
        }
        next();
    },
];
