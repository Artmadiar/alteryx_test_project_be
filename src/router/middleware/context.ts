import { Request } from 'express'
import { ServerError } from '../../lib/errors'
import { UserInstance } from '../../models/user'
import { SessionInstance } from '../../models/session'

export default class Context {
  static _bindings = new WeakMap<Request, Context>()

  user: UserInstance | any
  session: SessionInstance | undefined

  constructor () {}

  static bind(req: Request) : void {
    const ctx = new Context()
    Context._bindings.set(req, ctx)
  }

  static get(req: Request): Context {
    const ctx = Context._bindings.get(req)
    if (!ctx) {
      throw new ServerError('Context is lost')
    }
    return ctx
  }
}