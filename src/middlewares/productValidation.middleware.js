import Joi from 'joi'

const bool = Joi.boolean()
const slug = Joi.string().max(120).required()
const title = Joi.string().max(100).required()
const price = Joi.number().max(10000).required()
const longStr = Joi.string().max(3000).allow('').allow(null)
const shortStr = Joi.string().max(120).allow('').allow(null)
const date = Joi.date().allow('').allow(null)
const num = Joi.number().max(10000)
const _id = Joi.string().max(30).required()

//slug,title,status, price, quantity, description,sale price, saleStartDate,saleEndDate,brand, categories
//slug, image

export const newProductFormValidation = (req, res, next) => {
  const schema = Joi.object({
    status: bool.required(),
    title,
    price: num,
    qty: num,
    description: longStr.required(),
    categories: longStr,
    salePrice: num,
    saleStartDate: date,

    saleEndDate: date,
    brand: shortStr,
  })

  const result = schema.validate(req.body) //{value: {}, error: "msg"}
  if (result.error) {
    return res.json({
      status: 'error',
      message: result.error.message,
    })
  }
  req.body.categories = req.body.categories?.split(',')

  next()
}

export const updateProductFormValidation = (req, res, next) => {
  const schema = Joi.object({
    _id,
    status: bool.required(),
    title,
    price: num,
    qty: num,
    description: longStr.required(),
    categories: longStr,
    images: longStr,
    imgToDelete: longStr,
    oldImages: longStr,
    salePrice: num,
    saleStartDate: date,
    saleEndDate: date,
    brand: shortStr,
  })
  console.log(req.body)
  const result = schema.validate(req.body) //{value: {}, error: "msg"}
  if (result.error) {
    return res.json({
      status: 'error',
      message: result.error.message,
    })
  }
  const { categories, images, imgToDelete, oldImages } = req.body
  req.body.categories = categories?.split(',')
  req.body.images = images?.split(',')
  req.body.oldImages = oldImages?.split(',')
  req.body.imgToDelete = imgToDelete?.split(',')
  next()
}
