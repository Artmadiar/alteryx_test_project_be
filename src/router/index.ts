import { Router, Request, Response, NextFunction } from 'express'
import { json as jsonBodyParser, urlencoded as urlEncodedBodyParser } from 'body-parser'

import { ServerError } from '../lib/errors'
import user from './user'

const router = Router()

router.use(urlEncodedBodyParser({ extended: true }))
router.use(jsonBodyParser())

router.use('/user', user)

// route not found
router.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    message: 'Not Found',
  })
})

// error handler
router.use((error: ServerError | any, req: Request, res: Response, next: NextFunction) => {
  return res.status(error.status || 500).json({
    error: error.message || 'Internal Error',
  });
})


export default router
