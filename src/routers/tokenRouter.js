import express from 'express'
import { verifyRefreshJWT, createAccessJWT } from '../helpers/jwt.helper.js'
import { getUser, getUserByEmail } from '../models/users/User.model.js'
import { passwordReserOTPNotification } from '../helpers/mail.helper.js'
import { createPasswordResetOTP } from '../models/reset-pin/ResetPin.model.js'
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
            email: user.email,
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

Router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body
    //check if email in db
    console.log(email)
    if (email) {
      const user = await getUserByEmail(email)
      if (user?._id && user?.role === 'admin') {
        //create unique OTP & store in DB
        const result = await createPasswordResetOTP(email)

        //send otp to user email
        if (result?._id) {
          passwordReserOTPNotification({ email, otp: result.otp })
        }
      }
    }

    return res.json({
      status: 'success',
      message:
        ' if your email exists in the system, we will send you an OTP for resetting pasword. Pleae check your email. The OTP will expire in 15 mins',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: 'Internal server error' })
  }
})
export default Router
