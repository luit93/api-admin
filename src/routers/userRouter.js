import express from 'express'
const Router = express.Router()

import { createUser } from '../models/users/User.model.js'
import { newUserFormValidation } from '../middlewares/validation.middleware.js'
import { hashPassword } from '../helpers/bcrypt.helper.js'

Router.all('/', (req, res, next) => {
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
