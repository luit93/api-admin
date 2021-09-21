import mongoose from 'mongoose'

const ResetPinSchema = mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Reset_pin', ResetPinSchema)
