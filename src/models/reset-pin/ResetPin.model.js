import ResetPinSchema from './ResetPin.schema.js'

export const createUniqueResetPin = (userInfo) => {
  return ResetPinSchema(userInfo).save()
}
