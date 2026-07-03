import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId
  userName: string
  userImage?: string
  productId?: mongoose.Types.ObjectId
  rating: number
  title?: string
  text: string
  approved: boolean
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userImage: { type: String },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: 120 },
    text: { type: String, required: true, maxlength: 1000 },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

reviewSchema.index({ productId: 1, approved: 1 })
reviewSchema.index({ userId: 1 })

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema)

export default Review
