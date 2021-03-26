import { NextFunction, Request, Response } from 'express'
import models from '../../models'

export default (req: Request, res: Response, next: NextFunction) => {
  return models.User.findAll({
    raw: true,
  })
    .then((users) => res.json(users))
    .catch(err => next(err))
}
