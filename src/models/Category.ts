import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICategoryDocument extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  slug: string
  description: string | null
  image: string | null
  active: boolean
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: null },
    image: { type: String, default: null },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

CategorySchema.virtual('id').get(function () {
  return this._id.toHexString()
})

const Category: Model<ICategoryDocument> =
  mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', CategorySchema)

export default Category
