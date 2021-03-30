import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import models from '../../models'
import db from '../../models/connect'
import { InvalidRequestError, DuplicateResourceError } from '../../lib/errors'

/**
  @api {post} /auth/signUp Sign Up
  @apiGroup Auth
  @apiDescription Sign up new user with email, full name and password

  @apiParam {String} email
  @apiParam {String} [firstName]
  @apiParam {String} [lastName]
  @apiParam {String} password It has to be at least 6 symbols

  @apiSuccess (session) {String} token Bearer token of the session
  @apiSuccess (session) {Date} expiresAt Expiration date
  @apiSuccess (user) {String} id
  @apiSuccess (user) {String} firstName
  @apiSuccess (user) {String} lastName
  @apiSuccess (user) {String} email

  @apiSuccessExample {json} Success
    HTTP/1.1 200 OK
    {
      "session": {
        "token": "23a73e41-056d-43b2-9d6d-9fe1243ee14b",
        "expiresAt": "02/04/2021 14:12"
      },
      "user": {
        "id": "id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@mail.com"
      }
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
    const { user, session } = await db.sequelize.transaction(async (transaction) => {
      const user = await models.User.create({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
      }, { transaction })

      const session = await models.Session.create({
        userId: user.id,
      }, { transaction })

      return { user, session }
    })

    res.json({
      user: user.format(),
      session: session.format(),
    })
  } catch (err) {
    return next(err)
  }
}
