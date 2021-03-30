import { NextFunction, Request, Response } from 'express'
import Context from '../middleware/context'

/**
  @api {post} /auth/logOut Log Out
  @apiGroup Auth
  @apiDescription Destroy current session

  @apiHeader {String} Authorization Bearer ${token}

  @apiSuccessExample {json} Success
    HTTP/1.1 204 OK

    @apiUse InternalError
    @apiUse UnauthorizedError
*/
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ctx = Context.get(req)

    await ctx.session?.destroy()
    
    return res.sendStatus(204)
  } catch (error) {
    return next(error)
  }
}
