import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import models from '../../models'
import { InvalidRequestError, DuplicateResourceError } from '../../lib/errors'

/**
  @api {post} /user Create
  @apiGroup User
  @apiDescription Create new user

  @apiParam {String} email
  @apiParam {String} [firstName]
  @apiParam {String} [lastName]
  @apiParam {String} password It has to be at least 6 symbols

  @apiSuccess (user) {String} id
  @apiSuccess (user) {String} firstName
  @apiSuccess (user) {String} lastName
  @apiSuccess (user) {String} email

  @apiSuccessExample {json} Success
    HTTP/1.1 200 OK
    {
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

    const user = await models.User.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    })

    res.json({
      user: user.format()
    })
  } catch (err) {
    return next(err)
  }
}
