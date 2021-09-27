import express from 'express'
import slugify from 'slugify'
import {
  createCategory,
  deleteCategory,
} from '../models/category/Category.model.js'
import { newCategoryValidation } from '../middlewares/validation.middleware.js'
const Router = express.Router()
Router.all('/', (req, res, next) => {
  console.log('from category router')
  next()
})

//create category
Router.post('/', newCategoryValidation, async (req, res) => {
  try {
    console.log(req.body)
    const { name, parentCat } = req.body
    //slugify
    const slug = slugify(name, { lower: true })
    const newCat = { name, slug, parentCat }
    const result = await createCategory(newCat)
    console.log(result)
    if (result?._id) {
      return res.json({
        status: 'success',
        message: 'New category has been created',
      })
    }
    res.json({
      status: 'error',
      message: 'Unable to create the category,pleasy try again',
    })
  } catch (error) {
    // console.log(error)
    let msg = 'Error, unable to process your request, please try again later'
    if (error.message.includes('E11000 duplicate key error collection')) {
      msg = 'this category already exists'
    }
    res.status(500).json({
      status: 'error',
      message: msg,
    })
  }
})
//delete category
Router.delete('/:_id', async (req, res) => {
  try {
    console.log(req.body)
    const { _id } = req.params

    if (_id) {
      const result = await deleteCategory(_id)
      console.log(result)
      if (result?._id) {
        return res.json({
          status: 'success',
          message: 'The category ahs been deleted',
        })
      }
    }
    res.json({
      status: 'error',
      message: 'Unable to delete the category,pleasy try again',
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      status: 'error',
      message: msg,
    })
  }
})

export default Router
