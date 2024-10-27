const { body, param, validationResult } = require('express-validator');

const validationRulesMap = {
  create: [
    body('name').notEmpty().withMessage('Department name cannot be empty'),
    param('company_id').isUUID().notEmpty().withMessage('Company ID is required'),
    body('created_by').isUUID().notEmpty().withMessage('Department must be created by someone'),
    body('parent_id').optional().isUUID().notEmpty().withMessage('Department must have a valid existing parent'),
  ],
  show: [
    param('company_id').isUUID().notEmpty().withMessage('Company ID is required'),
    param('department_id').isUUID().notEmpty().withMessage('Department ID is required'),
  ],
  update: [
    param('company_id').isUUID().notEmpty().withMessage('Company ID is required'),
    param('department_id').isUUID().notEmpty().withMessage('Department ID is required'),
    body('name').optional().notEmpty().withMessage('Department name cannot be empty'),
  ],
  deactivate: [
    param('company_id').isUUID().notEmpty().withMessage('Company ID is required'),
    param('department_id').isUUID().notEmpty().withMessage('Department ID is required'),
  ],
  activate: [
    param('company_id').isUUID().notEmpty().withMessage('Company ID is required'),
    param('department_id').isUUID().notEmpty().withMessage('Department ID is required'),
  ],
  delete: [
    param('company_id').isUUID().notEmpty().withMessage('Company ID is required'),
    param('department_id').isUUID().notEmpty().withMessage('Department ID is required'),
  ],
};

const validateDepartmentRequest = (requestType) => {
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
  validateDepartmentRequest,
};
