import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import models from '../../models'
import { NotFoundError, InvalidRequestError } from '../../lib/errors'

/**
  @api {delete} /user/:id Delete
  @apiGroup User
  @apiDescription Delete user

  @apiSuccessExample {json} Success
    HTTP/1.1 204 OK

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

    await user.destroy()
    
    return res.sendStatus(204)
  } catch (error) {
    return next(error)
  }
}
