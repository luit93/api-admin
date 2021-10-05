import SessionSchema from './Session.schema.js'

export const createAccessSession = (sessionObj) => {
  return SessionSchema(sessionObj).save()
}

export const getSession = (filter) => {
  return SessionSchema.findOne(filter)
}
