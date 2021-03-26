import User from './user'
// import Session from './session'
// import RefreshToken from './refreshToken'

const models = {
  User,
  // RefreshToken,
  // Session,
}

Object.entries(models).map(([, model]) => {
  // if (model?.associate) {
  //   model.associate(models)
  // }
  return model
})

export default models

export type MyModels = typeof models
