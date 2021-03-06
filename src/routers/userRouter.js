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
  userProfileUpdateNotification,
} from '../helpers/mail.helper.js'
import {
  createUser,
  activeUser,
  getUserByEmail,
  updateUserById,
  updateUserByFilter,
} from '../models/users/User.model.js'
import {
  newUserFormValidation,
  emailVerificationValidation,
  adminLoginValidation,
  updateUserFormValidation,
  updatePasswordFormValidation,
  resetPasswordFormValidation,
} from '../middlewares/validation.middleware.js'
import { hashPassword, verifyPassword } from '../helpers/bcrypt.helper.js'
import { getJWTs } from '../helpers/jwt.helper.js'
import { isAdminAuth } from '../middlewares/auth.middleware.js'
const Router = express.Router()
Router.all('/', async (req, res, next) => {
  console.log('hit it')
  next()
})

Router.get('/', isAdminAuth, (req, res) => {
  try {
    const user = req.user
    user.refreshJWT = undefined
    user.password = undefined
    res.json({
      status: 'success',
      message: 'user profile',
      user,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'internal server error',
    })
  }
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

//update profile
Router.put('/', isAdminAuth, updateUserFormValidation, async (req, res) => {
  try {
    const { _id, email } = req.user
    const result = await updateUserById(_id, req.body)

    if (result?._id) {
      //TODO update user with email notification
      userProfileUpdateNotification(email)

      return res.json({
        status: 'success',
        message: 'Your profile has been updated',
        result,
      })
    }

    res.json({
      status: 'error',
      message: 'Unable to process your request, please try again later',
    })
  } catch (error) {
    console.log(error.message)
    res.json({
      status: 'error',
      message:
        'Error, unable to process your request, Please contact administration.',
    })
  }
})
//update password
Router.patch(
  '/',
  isAdminAuth,
  updatePasswordFormValidation,
  async (req, res) => {
    try {
      const { _id, email } = req.user
      const { password, currentPassword } = req.body
      // const result = await updateUserById(_id, req.body)
      //check current password against the one in DB
      const isMatched = verifyPassword(currentPassword, req.user.password)
      console.log(isMatched, 'isMatched')
      if (isMatched) {
        //encrypt the new password
        const hashedPass = hashPassword(password)
        //update user table with new password
        const result = hashedPass
          ? await updateUserById(_id, { password: hashedPass })
          : null
        console.log(result, 'result ===')
        if (result?._id) {
          //send confirmation email
          userProfileUpdateNotification(email)

          return res.json({
            status: 'success',
            message: 'Your password has been updated',
          })
        }
      }

      res.json({
        status: 'error',
        message: 'Unable to process your request, please try again later',
      })
    } catch (error) {
      console.log(error)
      res.json({
        status: 'error',
        message:
          'Error, unable to process your request, Please contact administration.',
      })
    }
  }
)

//reset password
Router.patch(
  '/reset-password',
  resetPasswordFormValidation,
  async (req, res) => {
    try {
      console.log(req.body)
      const { email, otp, password } = req.body
      //check if otp and email are valid in the db
      const otpInfo = await findUniqueReset({ otp, email })
      if (otpInfo?._id) {
        //encruypt password
        const hashedPass = hashPassword(password)
        const filter = { email }
        const obj = { password: hashedPass }
        //update password in user table in db
        const user = hashedPass ? await updateUserByFilter(filter, obj) : null

        if (user?._id) {
          //send email notification about the change
          userProfileUpdateNotification(email)
          //remove the email & otp
          deleteUniqueReset({ otp, email })
          return res.json({
            status: 'success',
            message: 'Your password has been changed',
          })
        }
      }

      res.json({
        status: 'error',
        message: 'Invalid request, please try again later',
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'error', message: 'internal server error' })
    }
  }
)
export default Router
