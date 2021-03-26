import { body, param, ValidationChain } from 'express-validator'


export const validateCreation: ValidationChain[] = [
  body('email').isEmail().withMessage('Email is wrong'),
  body('firstName').notEmpty().withMessage('First Name is wrong'),
  body('lastName').notEmpty().withMessage('Last Name is wrong'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password is wrong'),
];

export const validateUpdating: ValidationChain[] = [
  param('id').notEmpty().isUUID().withMessage('ID is wrong'),
  body('email').isEmail().withMessage('Email is wrong'),
  body('firstName').notEmpty().withMessage('First Name is wrong'),
  body('lastName').notEmpty().withMessage('Last Name is wrong'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password is wrong'),
];

export const validateDeleting: ValidationChain[] = [
  param('id').notEmpty().isUUID().withMessage('ID is wrong'),
];

export const validateGetOne: ValidationChain[] = [
  param('id').notEmpty().isUUID().withMessage('ID is wrong'),
];
