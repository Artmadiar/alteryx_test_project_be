import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import models from '../../models'
import db from '../../models/connect'
import { InvalidRequest, DuplicateResource } from '../../lib/errors'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      throw new InvalidRequest(validation)
    }

    // validate on duplications
    {
      const user = await models.User.count({
        where: { email: req.body.email },
      });
      if (user) {
        throw new DuplicateResource('Email is busy');
      }
    }

    // all changes in one db transaction
    const session = await db.sequelize.transaction(async (transaction) => {
      const user = await models.User.create({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
      }, { transaction })

      const session = await models.Session.create({
        userId: user.id,
      }, { transaction })

      return session
    })

    res.json(session.format())
  } catch (err) {
    return next(err)
  }
}
