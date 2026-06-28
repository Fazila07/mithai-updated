import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAddressDocument extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  label: string | null
  name: string
  phone: string
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

const AddressSchema = new Schema<IAddressDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    label: { type: String, default: null },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: null },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

AddressSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

AddressSchema.index({ userId: 1 })

const Address: Model<IAddressDocument> =
  mongoose.models.Address || mongoose.model<IAddressDocument>('Address', AddressSchema)

export default Address
