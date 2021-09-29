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

export const getUserByEmail = (email) => {
  return UserSchema.findOne({ email })
}
