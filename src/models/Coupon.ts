import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICouponDocument extends Document {
  _id: mongoose.Types.ObjectId
  code: string
  description: string | null
  discountType: 'percentage' | 'flat'
  value: number
  minOrder: number
  maxDiscount: number | null
  usageLimit: number | null
  usedCount: number
  perUserLimit: number
  active: boolean
  expiryDate: Date
  createdAt: Date
  updatedAt: Date
}

const CouponSchema = new Schema<ICouponDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: null },
    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrder: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
    expiryDate: { type: Date, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

CouponSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

const Coupon: Model<ICouponDocument> =
  mongoose.models.Coupon || mongoose.model<ICouponDocument>('Coupon', CouponSchema)

export default Coupon
