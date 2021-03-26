import { NextFunction, Request, Response } from 'express'
import models from '../../models'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await models.User.findAll()
    const response = users.map(user => user.format())
    res.json(response)
   } catch (error) {
    return next(error)
   }
}
