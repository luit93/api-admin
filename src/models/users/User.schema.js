import mongoose from 'mongoose'

const UserSchema = mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      default: 'inactive',
    },
    fname: {
      type: String,
      required: true,
      default: '',
      maxLength: 30,
    },
    lname: {
      type: String,
      required: true,
      default: '',
      maxLength: 30,
    },

    dob: {
      type: Date,
      required: true,
      default: null,
    },
    email: {
      type: String,
      required: true,
      default: '',
      maxLength: 50,
      unique: true,
      index: 1,
    },
    password: {
      type: String,
      required: true,
      default: '',
      minLength: 6,
    },
    phone: {
      type: String,
      default: '',
      maxLength: 30,
    },
    address: {
      type: String,
      required: true,
      default: '',
      maxLength: 100,
    },
    gender: {
      type: String,
      required: true,
      default: '',
    },
    isEmailConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      default: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('User', UserSchema)
