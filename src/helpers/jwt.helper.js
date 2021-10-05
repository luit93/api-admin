import jwt from 'jsonwebtoken'
import { createAccessSession } from '../models/session/Session.model.js'
import { setRefreshJWT } from '../models/users/User.model.js'

export const createAccessJWT = async ({ _id, email }) => {
  const token = jwt.sign({ email }, process.env.SECRET_ACCESS_JWT, {
    expiresIn: '15m',
  })
  //store in db
  const obj = {
    type: 'acessJWT',
    userId: _id,
    token,
  }
  const result = await createAccessSession(obj)
  if (result._id) {
    return token
  }
  return false
}
const createRefreshJWT = async ({ _id, email }) => {
  const token = jwt.sign({ email }, process.env.SECRET_REFRESH_JWT, {
    expiresIn: '30d',
  })
  const result = await setRefreshJWT(_id, token)
  if (result._id) {
    return token
  }
  return false
}

export const verifyRefreshJWT = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_REFRESH_JWT)
  } catch (error) {
    return false
  }
}
export const verifyAccessJWT = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_ACCESS_JWT)
  } catch (error) {
    return false
  }
}

export const getJWTs = async (userInfo) => {
  const accessJWT = await createAccessJWT(userInfo)
  const refreshJWT = await createRefreshJWT(userInfo)
  return { accessJWT, refreshJWT }
}
