import Joi from 'joi'

const bool = Joi.boolean()
const slug = Joi.string().max(120).required()
const title = Joi.string().max(100).required()
const price = Joi.number().max(10000).required()
const longStr = Joi.string().max(3000).allow('').allow(null)
const shortStr = Joi.string().max(120).allow('').allow(null)
const date = Joi.date().allow('').allow(null)
const num = Joi.number().max(10000)

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

  console.log(req.body)

  const result = schema.validate(req.body) //{value: {}, error: "msg"}
  console.log(result)
  if (result.error) {
    return res.json({
      status: 'error',
      message: result.error.message,
    })
  }
  next()
}
