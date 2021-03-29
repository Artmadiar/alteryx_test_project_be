import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import models from '../../models'
import db from '../../models/connect'
import { InvalidRequestError, DuplicateResourceError } from '../../lib/errors'

/**
  @api {post} /auth/signup Sign Up
  @apiGroup Auth
  @apiDescription Sign up new user with email, full name and password

  @apiParam {String} email It must be unique in the system
  @apiParam {String} [firstName]
  @apiParam {String} [lastName]
  @apiParam {String} password It has to be at least 6 symbols

  @apiSuccess {String} token Bearer token of the session
  @apiSuccess {Date} expiresAt Expiration date

  @apiSuccessExample {json} Success
    HTTP/1.1 200 OK
    {
      "token": "23a73e41-056d-43b2-9d6d-9fe1243ee14b",
      "expiresAt": "02/04/2021 14:12"
    }

    @apiUse InternalError
    @apiUse InvalidRequestError
    @apiUse DuplicateResourceError
*/
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      throw new InvalidRequestError(validation)
    }

    // validate on duplications
    {
      const user = await models.User.count({
        where: { email: req.body.email },
      });
      if (user) {
        throw new DuplicateResourceError('Email is busy');
      }
    }

    // all changes in one db transaction
    const session = await db.sequelize.transaction(async (transaction) => {
      const user = await models.User.create({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
      }, { transaction })

      const session = await models.Session.create({
        userId: user.id,
      }, { transaction })

      return session
    })

    res.json(session.format())
  } catch (err) {
    return next(err)
  }
}
