import { Router } from 'express'

import authenticate from '../middleware/authenticate'
import signUp from './signUp'
import signIn from './signIn'
import logOut from './logOut'

import {
  validateSignUp,
  validateSignIn,
} from './validation'

const router = Router()

router.post('/signUp', validateSignUp, signUp)
router.post('/signIn', validateSignIn, signIn)
router.delete('/logOut', authenticate, logOut)


export default router
