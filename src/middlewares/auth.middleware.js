import { verifyAccessJWT } from '../helpers/jwt.helper.js'
import { getSession } from '../models/session/Session.model.js'
import { getUserById } from '../models/users/User.model.js'
export const isAdminAuth = async (req, res, next) => {
  try {
    //check
    const { authorization } = req.headers
    if (authorization) {
      const decoded = verifyAccessJWT(authorization)
      console.log(decoded)
      if (decoded === 'jwt expired') {
        return res.status(403).json({ status: 'error', message: 'jwt expired' })
      }
      if (decoded?.email) {
        //check if token exists in database
        const session = await getSession({ token: authorization })
        if (session?._id) {
          const userId = session.userId
          const user = await getUserById(session.userId)
          if (user?.role === 'admin') {
            //   req.user = user
            return next()
          }
          //get user from database
        }
      }
    }
    res.status(401).json({ status: 'error', message: 'unauthinticated' })
    //get accessJWT
    //validate the tokens
    // next()
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: 'internal server error' })
  }
}
