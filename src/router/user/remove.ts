import { Request, Response } from 'express'
import models from '../../models'

export default (req: Request, res: Response) => {
  return models.User.findAll()
    .then((users) => res.json(users))
}
