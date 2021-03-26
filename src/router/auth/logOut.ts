import { NextFunction, Request, Response } from 'express'
import Context from '../middleware/context'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ctx = Context.get(req)

    await ctx.session?.destroy()
    
    return res.sendStatus(204)
  } catch (error) {
    return next(error)
  }
}
