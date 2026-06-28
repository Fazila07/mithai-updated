import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICartDocument extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  productId: mongoose.Types.ObjectId
  quantity: number
  createdAt: Date
}

const CartSchema = new Schema<ICartDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1, min: 1 },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

CartSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Each user can only have one entry per product
CartSchema.index({ userId: 1, productId: 1 }, { unique: true })
CartSchema.index({ userId: 1 })

const Cart: Model<ICartDocument> =
  mongoose.models.Cart || mongoose.model<ICartDocument>('Cart', CartSchema)

export default Cart
