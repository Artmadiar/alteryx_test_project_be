import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import models from '../../models'
import { NotFoundError, InvalidRequestError } from '../../lib/errors'

/**
  @api {post} /user/:id Update
  @apiGroup User
  @apiDescription Update user

  @apiParam {String} [email]
  @apiParam {String} [firstName]
  @apiParam {String} [lastName]
  @apiParam {String} [password] It has to be at least 6 symbols

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
    @apiUse NotFoundError
*/
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      throw new InvalidRequestError(validation)
    }

    const user = await models.User.findOne({
      where: { id: req.params.id }
    })
      
    if (!user) {
      throw new NotFoundError('User not found')
    }
    if ('email' in req.body) {
      user.setDataValue('email', req.body.email);
    }
    if ('firstName' in req.body) {
      user.setDataValue('firstName', req.body.firstName);
    }
    if ('lastName' in req.body) {
      user.setDataValue('lastName', req.body.lastName);
    }
    if ('password' in req.body) {
      user.setPassword(req.body.password);
    }

    await user.save()

    res.json({
      user: user.format()
    })
  } catch (error) {
    return next(error)
  }
}
