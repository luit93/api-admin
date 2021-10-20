import PaymentOptionSchema from './PaymentOption.schema.js'

export const createAPaymentOtion = (obj) => {
  return PaymentOptionSchema(obj).save()
}

export const getAPaymentOption = (_id) => {
  return PaymentOptionSchema.findById(_id)
}
export const getPaymentOptions = (filter) => {
  return PaymentOptionSchema.find(filter)
}
export const deletePaymentOption = (_id) => {
  return PaymentOptionSchema.findByIdAndDelete(_id)
}
