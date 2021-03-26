import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { NotFound, InvalidRequest } from '../../lib/errors'
import models from '../../models'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      throw new InvalidRequest(validation)
    }

    const user = await models.User.findOne({
      where: { id: req.params.id },
    })

    if (!user) {
      throw new NotFound('User not found')
    }
      
    res.json(user.format())
  } catch (error) {
    return next(error)
  }
}
