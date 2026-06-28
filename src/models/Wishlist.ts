import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IWishlistDocument extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  productId: mongoose.Types.ObjectId
  createdAt: Date
}

const WishlistSchema = new Schema<IWishlistDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

WishlistSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true })
WishlistSchema.index({ userId: 1 })

const Wishlist: Model<IWishlistDocument> =
  mongoose.models.Wishlist || mongoose.model<IWishlistDocument>('Wishlist', WishlistSchema)

export default Wishlist
