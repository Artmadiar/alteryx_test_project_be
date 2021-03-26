import { Request, Response } from 'express'
import { validationResult } from 'express-validator'

import models from '../../models'
import { NotFound, InvalidRequest } from '../../lib/errors'

export default (req: Request, res: Response) => {
  const validation = validationResult(req)
  if (!validation.isEmpty()) {
    throw new InvalidRequest(validation)
  }
  
  return models.User.findOne({
    where: { id: req.params.id }
  })
    .then((user) => {
      if (!user) {
        throw new NotFound('User not found')
      }
      if ('email' in req.body) {
        user.setDataValue('email', req.body.email);
      }
      if ('firstName' in req.body) {
        user.setDataValue('firstName', req.body.firstName);
      }
      if ('lastName' in req.body) {
        user.setDataValue('lastName', req.body.lastName);
      }
      if ('password' in req.body) {
        user.setPassword(req.body.password);
      }

      return user.save();
    })
    .then((user) => res.json(user.format()));
}
