import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICouponUsage extends Document {
  userId: string
  couponId: mongoose.Types.ObjectId
  couponCode: string
  orderId: mongoose.Types.ObjectId
  usedAt: Date
}

const couponUsageSchema = new Schema<ICouponUsage>(
  {
    userId: { type: String, required: true, index: true },
    couponId: { type: Schema.Types.ObjectId, ref: 'Coupon', required: true },
    couponCode: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    usedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

couponUsageSchema.index({ userId: 1, couponCode: 1 })

const CouponUsage: Model<ICouponUsage> =
  mongoose.models.CouponUsage || mongoose.model<ICouponUsage>('CouponUsage', couponUsageSchema)

export default CouponUsage
