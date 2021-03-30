import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import { InvalidRequestError, UnauthorizedError } from '../../lib/errors'
import models from '../../models'

/**
  @api {post} /auth/signIn Sign In
  @apiGroup Auth
  @apiDescription Sign in with email and password

  @apiParam {String} email
  @apiParam {String} password It has to be at least 6 symbols

  @apiSuccess (session) {String} token Bearer token of the session
  @apiSuccess (session) {Date} expiresAt Expiration date

  @apiSuccessExample {json} Success
    HTTP/1.1 200 OK
    {
      "session": {
        "token": "23a73e41-056d-43b2-9d6d-9fe1243ee14b",
        "expiresAt": "02/04/2021 14:12"
      }
    }

    @apiUse InternalError
    @apiUse UnauthorizedError
    @apiUse InvalidRequestError
*/
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      throw new InvalidRequestError(validation)
    }

    const user = await models.User.findOne({
      where: { email: req.body.email },
      attributes: ['id', 'password'],
    })

    if (!user) {
      throw new UnauthorizedError()
    }
    
    const match = await user.comparePassword(req.body.password)
    if (!match) {
      throw new UnauthorizedError()
    }

    const session = await models.Session.create({
      userId: user.id,
    })

    res.json({
      session: session.format()
    })
  } catch (error) {
    return next(error)
  }
}
