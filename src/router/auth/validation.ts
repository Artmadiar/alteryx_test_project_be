import { body, ValidationChain } from 'express-validator'


export const validateSignUp: ValidationChain[] = [
  body('email').isEmail().withMessage('Email is wrong'),
  body('firstName').notEmpty().withMessage('First Name is wrong'),
  body('lastName').notEmpty().withMessage('Last Name is wrong'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password is wrong'),
];

export const validateSignIn: ValidationChain[] = [
  body('email').isEmail().withMessage('Email is wrong'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password is wrong'),
];
