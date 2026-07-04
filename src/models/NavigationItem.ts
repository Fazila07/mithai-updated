import mongoose, { Schema, Document, Model } from 'mongoose'

export interface INavigationItemDocument extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  slug: string
  destinationType: 'page' | 'category' | 'collection' | 'url' | 'filter'
  destinationValue: string
  order: number
  enabled: boolean
  icon: string | null
  createdAt: Date
  updatedAt: Date
}

const NavigationItemSchema = new Schema<INavigationItemDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    destinationType: {
      type: String,
      required: true,
      enum: ['page', 'category', 'collection', 'url', 'filter'],
      default: 'page',
    },
    destinationValue: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
    icon: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

NavigationItemSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

NavigationItemSchema.index({ order: 1 })
NavigationItemSchema.index({ enabled: 1, order: 1 })

const NavigationItem: Model<INavigationItemDocument> =
  mongoose.models.NavigationItem || mongoose.model<INavigationItemDocument>('NavigationItem', NavigationItemSchema)

export default NavigationItem
