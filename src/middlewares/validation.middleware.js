import Joi from 'joi'

export const newUserFormValidation = (req, res, next) => {
  console.log(req.body)
  const schema = Joi.object({
    fname: Joi.string().max(30).required().alphanum(),
    lname: Joi.string().max(30).required().alphanum(),
    dob: Joi.date().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).max(30).required(),
    password: Joi.string().min(6).max(50).required().alphanum(),
    phone: Joi.string().max(50),
    gender: Joi.string().max(6).required(),
    address: Joi.string().max(100).required(),
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
