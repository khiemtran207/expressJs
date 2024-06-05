const { body, validationResult } = require('express-validator');

const validateCreateForm = [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('slug').trim().notEmpty().withMessage('Slug is required.'),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = {
    validateCreateForm,
};