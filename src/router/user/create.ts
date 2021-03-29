import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import models from '../../models'
import { InvalidRequestError, DuplicateResourceError } from '../../lib/errors'

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

    res.json(user.format())
  } catch (err) {
    return next(err)
  }
}
