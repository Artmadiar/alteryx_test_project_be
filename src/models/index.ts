import User from './user'
import Session from './session'

const models = {
  User,
  Session,
}

// associate
User.hasMany(Session)
Session.belongsTo(User)

export default models

export type MyModels = typeof models
