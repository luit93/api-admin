import express from 'express'
import { verifyRefreshJWT, createAccessJWT } from '../helpers/jwt.helper.js'
import { getUser } from '../models/users/User.model.js'
const Router = express.Router()

Router.get('/', async (req, res) => {
  try {
    const { authorization } = req.headers
    console.log(authorization)
    if (authorization) {
      const decoded = verifyRefreshJWT(authorization)
      console.log(decoded)
      if (decoded?.email) {
        //test
        const filter = {
          email: decoded.email,
          refreshJWT: authorization,
        }
        const user = await getUser(filter)
        if (user?._id) {
          //create new accessToken
          const accessJWT = await createAccessJWT({
            _id: user._id,
            email: user._email,
          })
          return res.json({
            status: 'success',
            message: ' AccessJWT generated',
            accessJWT,
          })
        }
      }
    }

    res.status(401).json({ status: 'error', message: ' invalid token' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: 'Internal server error' })
  }
})

export default Router
