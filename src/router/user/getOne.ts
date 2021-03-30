import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { NotFoundError, InvalidRequestError } from '../../lib/errors'
import models from '../../models'

/**
  @api {get} /user/:id Get user
  @apiGroup User

  @apiSuccess (user) {String} id
  @apiSuccess (user) {String} firstName
  @apiSuccess (user) {String} lastName
  @apiSuccess (user) {String} email

  @apiSuccessExample {json} Success
    HTTP/1.1 200 OK
    {
      "user": {
        "id": "14a73e41-056d-43b2-3d6d-9fe1243ee14c",
        "email": "john.doe@email.com",
        "firstName": "John",
        "lastName": "Doe"
      }
    }

  @apiUse InternalError
  @apiUse NotFoundError
  @apiUse InvalidRequestError
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
      
    res.json({
      user: user.format()
    })
  } catch (error) {
    return next(error)
  }
}
