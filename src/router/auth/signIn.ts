import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import { InvalidRequest, Unauthorized } from '../../lib/errors'
import Context from '../middleware/context'
import models from '../../models'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      throw new InvalidRequest(validation)
    }

    const user = await models.User.findOne({
      where: { email: req.body.email },
      attributes: ['id', 'password'],
    })

    if (!user) {
      throw new Unauthorized()
    }
    
    const match = await user.comparePassword(req.body.password)
    if (!match) {
      throw new Unauthorized()
    }

    const session = await models.Session.create({
      userId: user.id,
    })

    res.json(session.format())
  } catch (error) {
    return next(error)
  }
}
