import express from 'express'
import {
  createUniqueResetPin,
  findUniqueReset,
  deleteUniqueReset,
} from '../models/reset-pin/ResetPin.model.js'
import { getRandomOTP } from '../helpers/otp.helper.js'
import {
  emailProcessor,
  emailVerifivationWelcome,
} from '../helpers/mail.helper.js'

import {
  createUser,
  activeUser,
  getUserByEmail,
} from '../models/users/User.model.js'
import {
  newUserFormValidation,
  emailVerificationValidation,
  adminLoginValidation,
} from '../middlewares/validation.middleware.js'
import { hashPassword, verifyPassword } from '../helpers/bcrypt.helper.js'
import { getJWTs } from '../helpers/jwt.helper.js'
import { isAdminAuth } from '../middlewares/auth.middleware.js'
const Router = express.Router()
Router.all('/', async (req, res, next) => {
  console.log('hit it')
  next()
})
Router.post('/', newUserFormValidation, async (req, res) => {
  try {
    //hash password
    const t1 = Date.now()
    const hashPass = hashPassword(req.body.password)
    const t2 = Date.now()
    console.log(hashPass, `time taken to hash password= ` + (t2 - t1) + `ms`)
    req.body.password = hashPass
    const result = await createUser(req.body)
    if (result?._id) {
      //create unique code
      const optLength = 8
      const otp = getRandomOTP(optLength)
      const uniqueCombo = {
        otp,
        email: result.email,
      }
      const uniquePinData = await createUniqueResetPin(uniqueCombo)
      console.log(uniquePinData)
      if (uniquePinData?._id) {
        emailProcessor(uniqueCombo)
      }
      //send email to client with verif link
      return res.json({
        status: 'success',
        message:
          'user has been created. We have sent an verification link to your email. Please respond by clicking for verification',
        result,
      })
    }
    console.log(req.body)
    res.json({
      status: 'error',
      message: 'Unable to create user',
    })
  } catch (error) {
    console.log(error.message)
    let msg = 'Error, unable to create new user, please contact admin'
    if (error.message.includes('E11000 duplicate key error collection')) {
      msg = 'The user already exist associated to your email.'
    }
    res.json({
      status: 'error',
      message: msg,
    })
  }
})

Router.post(
  '/email-verification',
  emailVerificationValidation,
  async (req, res) => {
    try {
      console.log(req.body)
      // check if
      const result = await findUniqueReset(req.body)
      if (result?._id) {
        //if yes, then update the user status to active
        const isUserActive = await activeUser(req.body.email)
        if (isUserActive?._id) {
          //then send welcome email to user
          emailVerifivationWelcome(req.body.email)
          deleteUniqueReset(req.body)
          //
          return res.json({
            status: 'success',
            message: 'Your email has been verified, sign in now',
          })
        }
      }
      res.json({ status: 'error', message: 'invalid or expired link' })
    } catch (error) {
      console.log(error)
      res.json({
        status: 'error',
        message: 'Error,unable to process your request',
      })
    }
  }
)

//log in
Router.post('/login', adminLoginValidation, async (req, res) => {
  try {
    console.log(req.body)
    const { email, password } = req.body
    //1 find user by email
    const user = await getUserByEmail(email)
    if (user?._id) {
      //bcrypt and verify password
      const isPassMatched = verifyPassword(password, user.password)
      if (isPassMatched) {
        user.password = undefined
        const tokens = await getJWTs({ _id: user._id, email })
        return res.json({
          status: 'success',
          message: 'Login successful',
          user,
          tokens,
        })
      }
    }
    res.json({
      status: 'error',
      message: 'invalid login details',
    })
  } catch (error) {
    console.log(error)
    res.json({
      status: 'error',
      message: 'Error,unable to log you in',
    })
  }
})
// Router.get('/', (req, res) => {
//   res.json({
//     status: 'ok',
//     message: 'get message',
//   })
// })
// Router.post()
// Router.patch()
// Router.delete()

export default Router
