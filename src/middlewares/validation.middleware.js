import Joi from 'joi'
const shortStr = Joi.string().max(30).required().alphanum()
const email = Joi.string().email({ minDomainSegments: 2 }).max(30).required()
const str = Joi.string().max(30)
export const newUserFormValidation = (req, res, next) => {
  console.log(req.body)
  const schema = Joi.object({
    fname: Joi.string().max(30).required().alphanum(),
    lname: Joi.string().max(30).required().alphanum(),
    dob: Joi.date().allow('').allow(null),
    email,
    password: Joi.string().min(6).max(50).required().alphanum(),
    phone: Joi.string().max(50).allow(''),
    gender: Joi.string().max(6).allow(''),
    address: Joi.string().max(100).allow(''),
  })

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

export const emailVerificationValidation = (req, res, next) => {
  const schema = Joi.object({
    otp: shortStr,
    email,
  })

  const result = schema.validate(req.body)
  console.log(result)
  if (result.error) {
    return res.json({
      status: 'error',
      message: result.error.message,
    })
  }
  next()
}
export const newCategoryValidation = (req, res, next) => {
  const schema = Joi.object({
    name: str.required(),
    parentCat: str.allow('').allow(null),
  })

  const result = schema.validate(req.body)
  console.log(result)
  if (result.error) {
    return res.json({
      status: 'error',
      message: result.error.message,
    })
  }
  next()
}
