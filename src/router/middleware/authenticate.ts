import { Request, Response, NextFunction } from 'express'
import parseBearerToken from 'parse-bearer-token'
import isUUID from 'validator/lib/isUUID'
import { ModelCtor } from 'sequelize'

import { ServerError, Unauthorized } from '../../lib/errors'
import models from '../../models'
import db from '../../models/connect'
import { UserInstance } from '../../models/user'
import Context from './context'

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = parseBearerToken(req)
  const Op = db.Op

  if (!token || !isUUID(token)) {
    return next(new ServerError('Token is invalid'))
  }

  try {
    const session = await models.Session.findOne({
      attributes: ['id', 'token'],
      where: {
        token,
        expiresAt: {
          [Op.gt]: Date.now(),
        },
      },
      include: [{
        model: models.User,
        required: true,
        attributes: ['id'],
      }],
    })

    if (!session) {
      return next(new Unauthorized())
    }

    const ctx = Context.get(req)
    ctx.session = session
    ctx.user = session.user

    return next()
  } catch (error) {
    throw new ServerError(error)
  }
}
