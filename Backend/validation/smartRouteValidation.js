import { body } from 'express-validator';

export const smartRouteValidation = [
  body('source')
    .trim()
    .notEmpty()
    .withMessage('Source location is required')
    .isString()
    .withMessage('Source must be a string'),
    
  body('destination')
    .trim()
    .notEmpty()
    .withMessage('Destination location is required')
    .isString()
    .withMessage('Destination must be a string'),
    
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format. Please use ISO 8601 format'),
    
  body('passengers')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Number of passengers must be at least 1')
];