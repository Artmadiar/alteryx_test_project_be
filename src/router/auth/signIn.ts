import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import { InvalidRequestError, UnauthorizedError } from '../../lib/errors'
import models from '../../models'

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

    res.json(session.format())
  } catch (error) {
    return next(error)
  }
}
