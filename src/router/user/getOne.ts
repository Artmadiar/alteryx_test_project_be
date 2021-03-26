import { Request, Response } from 'express'
import models from '../../models'

export default (req: Request, res: Response) => {
  return models.User.findOne({
    where: { id: req.params.id },
    raw: true,
  })
    .then((user) => res.json(user))
}
