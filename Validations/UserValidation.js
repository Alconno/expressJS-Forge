const { body, param, query, validationResult } = require('express-validator');

const validationRulesMap = {
    paginated: [
        query('search').optional().isString()
            .withMessage('Invalid search parameter. It must be a string'),
        
        query('sortField').optional().custom(value => {
            const lowercasedValue = value.toLowerCase();
            const isValid = ['first_name', 'last_name', 'email'].includes(lowercasedValue);
            return isValid;
        }).withMessage('Invalid sortField parameter. It must be either first_name, last_name, or email'),
        
        query('sortOrder').optional().custom(value => ['ASC', 'DESC'].includes(value.toUpperCase()))
            .withMessage('Invalid sortOrder parameter. It must be ASC or DESC'),

        query('page').optional().custom(value => !isNaN(parseInt(value)))
            .withMessage('Invalid page parameter. It must be a valid number'),

        query('pageSize').optional().custom(value => !isNaN(parseInt(value)))
            .withMessage('Invalid pageSize parameter. It must be a valid number'),

        query('filterBy').optional().custom(value => {
            const lowercasedValue = value.toLowerCase();
            const isValid = ['deleted', 'notdeleted'].includes(lowercasedValue);
            return isValid;
        }).withMessage('Invalid filterBy parameter. It must be either deleted or notDeleted'),
    ],
    create: [
        body('email').isEmail().withMessage('Invalid email address'),
        body('first_name').notEmpty().withMessage('First name cannot be empty'),
        body('last_name').notEmpty().withMessage('Last name cannot be empty'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    show: [
        param('user_id').isUUID().notEmpty().withMessage('User ID is required'),
    ],
    update: [
        param('user_id').isUUID().notEmpty().withMessage('User ID is required'),
        body('email').optional().isEmail().withMessage('Invalid email address'),
        body('first_name').optional().notEmpty().withMessage('First name cannot be empty'),
        body('last_name').optional().notEmpty().withMessage('Last name cannot be empty'),
    ],
    delete: [
        param('user_id').isUUID().notEmpty().withMessage('User ID is required'),
    ],
    deactivate: [
        param('user_id').isUUID().notEmpty().withMessage('User ID is required'),
    ],
    activate: [
        param('user_id').isUUID().notEmpty().withMessage('User ID is required'),
    ],
};

const validateUserRequest = (requestType) => {
    const validationRules = validationRulesMap[requestType] || [];

    return [
        ...validationRules,
        (req, res, next) => {
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                return next();
            }

            return res.status(400).json({ errors: errors.array() });
        },
    ];
};

module.exports = {
    validateUserRequest,
};