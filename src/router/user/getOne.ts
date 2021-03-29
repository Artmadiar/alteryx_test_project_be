import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { NotFoundError, InvalidRequestError } from '../../lib/errors'
import models from '../../models'

/**
  @api {get} /auth/user Get user info
  @apiGroup User

  @apiHeader {String} Authorization Bearer ${token}

  @apiSuccess {String} token Bearer token of the session
  @apiSuccess {Object} user User
  @apiSuccess {Number} user.id ID of the user
  @apiSuccess {String} user.email Email of the user
  @apiSuccess {String} user.fullName
  @apiSuccess {String} user.avatarUrl Avatar of the user
  @apiSuccess {Boolean} user.isApproved is user approved
  @apiSuccess {String} user.registrationType "email" | "facebook" | "google"
  @apiSuccess {Number} user.templateId
  @apiSuccess {Boolean} user.hasPassword
  @apiSuccess {String} user.subscription
  @apiSuccess {Boolean} user.superadmin
  @apiSuccess {Boolean} user.showStatistics
  @apiSuccess {String} user.domain

  @apiSuccessExample {json} Success
    HTTP/1.1 200 OK
    {
      "accessToken": "23a73e41-056d-43b2-9d6d-9fe1243ee14b",
      "user": {
        "id": 1,
        "email": "john@email.com",
        "fullName": "Full Name",
        "avatarUrl": "https://the.winter/is/coming",
        "isApproved": true,
        "registrationType": "email",
        "templateId": 23,
        "hasPassword": true,
        "subscription": "monthly",
        "hasFreeDoman": true
      }
    }

  @apiUse InternalError
  @apiUse UnauthorizedError
*/
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      throw new InvalidRequestError(validation)
    }

    const user = await models.User.findOne({
      where: { id: req.params.id },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }
      
    res.json(user.format())
  } catch (error) {
    return next(error)
  }
}
