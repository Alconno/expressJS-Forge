const { body, param, query, validationResult } = require('express-validator');

const validationRulesMap = {
    paginated: [
        query('search').optional().isString()
            .withMessage('Invalid search parameter. It must be a string'),

        query('sortField').optional().custom(value => {
            const lowercasedValue = value.toLowerCase();
            const isValid = ['handle', 'name', 'website', 'country', 'created_at'].includes(lowercasedValue);
            return isValid;
        }).withMessage('Invalid sortField parameter. It must be either handle, name, website, country or created_at'),
            
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
        body('handle').notEmpty().withMessage('Handle cannot be empty'),
        body('name').notEmpty().withMessage('Name cannot be empty'),
        body('website').isURL().withMessage('Invalid website URL'),
        body('country').notEmpty().withMessage('Country cannot be empty'),
        body('created_by').isUUID().notEmpty().withMessage('Company must be created by someone'),
    ],
    show: [
        param('company_id').isUUID().notEmpty().withMessage('Company ID is required'),
    ],
    update: [
        param('company_id').isUUID().notEmpty().withMessage('Company ID is required'),
        body('handle').optional().notEmpty().withMessage('Handle cannot be empty'),
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('website').optional().isURL().withMessage('Invalid website URL'),
        body('country').optional().notEmpty().withMessage('Country cannot be empty'),
    ],
    delete: [
        param('company_id').isUUID().notEmpty().withMessage('Company ID is required'),
    ],
    deactivate: [
        param('company_id').isUUID().notEmpty().withMessage('Company ID is required'),
    ],
    activate: [
        param('company_id').isUUID().notEmpty().withMessage('Company ID is required'),
    ],
};

const validateCompanyRequest = (requestType) => {
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
    validateCompanyRequest,
};