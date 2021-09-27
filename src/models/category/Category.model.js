import CategorySchema from './Category.schema.js'

export const createCategory = (newCat) => {
  return CategorySchema(newCat).save()
}
export const getCategory = () => {
  return CategorySchema.find()
}
export const deleteCategory = (_id) => {
  return _id ? CategorySchema.findByIdAndDelete(_id) : false
}
