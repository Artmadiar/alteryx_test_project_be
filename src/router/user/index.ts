import { Router } from 'express'

import getOne from './getOne'
import getAll from './getAll'
import create from './create'
import update from './update'
import remove from './remove'

import {
  validateCreation,
  validateUpdating,
  validateDeleting,
  validateGetOne,
} from './validation'

const router = Router()

router.get('/', getAll)
router.get('/:id', validateGetOne, getOne)
router.post('/', validateCreation, create)
router.post('/:id', validateUpdating, update)
router.delete('/:id', validateDeleting, remove)


export default router
