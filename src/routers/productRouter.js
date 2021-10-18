import express from 'express'
import { verifyRefreshJWT, createAccessJWT } from '../helpers/jwt.helper.js'
import { getUser, getUserByEmail } from '../models/users/User.model.js'
import { passwordReserOTPNotification } from '../helpers/mail.helper.js'
import { createPasswordResetOTP } from '../models/reset-pin/ResetPin.model.js'
import {
  createProduct,
  getProducts,
  getSingleProduct,
  getSingleProductByID,
  updateProduct,
  deleteProductById,
  updateProductById,
} from '../models/product/Product.model.js'
import slugify from 'slugify'
import {
  newProductFormValidation,
  updateProductFormValidation,
} from '../middlewares/productValidation.middleware.js'
const Router = express.Router()
//get all or single product
Router.get('/:slug?', async (req, res) => {
  try {
    const { slug } = req.params
    let result = null
    if (slug) {
      result = await getSingleProduct({ slug })
    } else {
      result = await getProducts()
    }
    //server side validation

    //store product info
    console.log(req.body)
    return res.json({
      status: 'success',
      message: ' products as requested',
      result,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

//create product
Router.post('/', newProductFormValidation, async (req, res) => {
  try {
    const { title } = req.body
    const slug = slugify(title, { lower: true })
    const result = await createProduct({ ...req.body, slug })
    if (result?._id) {
      return res.json({
        status: 'success',
        message: ' product generated',
      })
    }
    return res.json({
      status: 'error',
      message: ' unable t create product',
    })
  } catch (error) {
    let msg = error.message
    if (error.message.includes('E11000 duplicate key error collection:')) {
      msg = "The prod name/slug can't be the same"
    }
    res.json({ status: 'error', message: msg })
  }
})
//delete product
Router.delete('/:_id', async (req, res) => {
  try {
    const { _id } = req.params
    const product = await deleteProductById(_id)
    if (product?._id) {
      return res.json({
        status: 'success',
        message: ' product deleted',
      })
    }
    res.json({
      status: 'error',
      message: ' unable to delete product',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})
//update product
Router.put('/', updateProductFormValidation, async (req, res) => {
  try {
    const { _id, ...product } = req.body
    const result = await updateProductById(_id, product)
    if (result?._id) {
      return res.json({
        status: 'success',
        message: ' product updated',
      })
    }

    res.json({
      status: 'error',
      message: ' unable to update product',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default Router
