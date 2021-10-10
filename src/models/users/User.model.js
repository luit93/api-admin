import UserSchema from './User.schema.js'

export const createUser = (newUser) => {
  return UserSchema(newUser).save()
}

export const activeUser = (email) => {
  return UserSchema.findOneAndUpdate(
    { email },
    { status: 'active', isEmailConfirmed: true },
    { new: true }
  )
}

export const getUserById = (_id) => {
  return UserSchema.findById(_id)
}
export const getUserByEmail = (email) => {
  return UserSchema.findOne({ email })
}
export const setRefreshJWT = (_id, refreshJWT) => {
  return UserSchema.findByIdAndUpdate(_id, { refreshJWT })
  // return UserSchema.findByIdAndUpdate(_id,{refreshJWT:refreshJWT})
}

export const getUser = (filter) => {
  return UserSchema.findOne(filter)
}

export const updateUserById = (_id, obj) => {
  return UserSchema.findByIdAndUpdate(_id, obj)
}
