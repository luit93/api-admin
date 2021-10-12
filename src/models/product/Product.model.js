import ProductSchema from './Product.schema.js'

export const createProduct = (prodInfo) => {
  return ProductSchema(prodInfo).save()
}

export const getProducts = () => {
  return ProductSchema.find()
}

export const getSingleProduct = (filter) => {
  return ProductSchema.findOne(filter)
}

export const getSingleProductByID = (_id) => {
  return ProductSchema.findById(_id)
}

export const updateProduct = (filter, obj) => {
  return ProductSchema.findOneAndUpdate(filter, obj)
}
export const updateProductById = (_id, obj) => {
  return ProductSchema.findByIdAndUpdate(_id, obj)
}

export const deleteProductById = (_id) => {
  return _id ? ProductSchema.findByIdAndDelete(_id) : null
}
