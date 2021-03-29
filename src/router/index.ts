import { Router, Request, Response, NextFunction } from 'express'
import { json as jsonBodyParser, urlencoded as urlEncodedBodyParser } from 'body-parser'

import { InternalError } from '../lib/errors'
import Context from './middleware/context'
import user from './user'
import auth from './auth'

const router = Router()

router.use(urlEncodedBodyParser({ extended: true }))
router.use(jsonBodyParser())

// Middleware
router.use((req: Request, res: Response, next: NextFunction) => {
  Context.bind(req)
  return next()
})

router.use('/user', user)
router.use('/auth', auth)

// route not found
router.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    message: 'Not Found',
  })
})

// error handler
router.use((error: InternalError | any, req: Request, res: Response, next: NextFunction) => {
  return res.status(error.status || 500).json({
    error: error.message || 'Internal Error',
  });
})


export default router
