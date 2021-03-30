import { NextFunction, Request, Response } from 'express'
import models from '../../models'

/**
  @api {get} /user List
  @apiGroup User
  @apiDescription Get list of users

  @apiSuccess {String} id
  @apiSuccess {String} firstName
  @apiSuccess {String} lastName
  @apiSuccess {String} email

  @apiSuccessExample {json} Success
    HTTP/1.1 200 OK
    [{
      "id": "id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@mail.com"
    }]

    @apiUse InternalError
*/
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await models.User.findAll()
    const response = users.map(user => user.format())
    res.json(response)
   } catch (error) {
    return next(error)
   }
}
