import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IHamper extends Document {
  name: string
  slug: string
  description: string
  image?: string
  categorySlug: string
  active: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

const hamperSchema = new Schema<IHamper>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    image: { type: String, default: null },
    categorySlug: { type: String, default: '' },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Hamper: Model<IHamper> =
  mongoose.models.Hamper || mongoose.model<IHamper>('Hamper', hamperSchema)

export default Hamper
