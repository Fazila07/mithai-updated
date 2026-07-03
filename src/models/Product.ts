import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPackageSize {
  label: string
  price: number
  comparePrice?: number | null
  stock: number
}

export interface IProductDocument extends Document {
  _id: mongoose.Types.ObjectId
  uniqueId: string
  name: string
  slug: string
  groupSlug: string | null
  categoryId: mongoose.Types.ObjectId
  subcategory: string | null
  foodType: string | null
  popularTags: string[]
  description: string
  shortDescription: string | null
  about: string | null
  price: number
  comparePrice: number | null
  stock: number
  sku: string | null
  weight: string | null
  packageSizes: IPackageSize[]
  tags: string[]
  ingredients: string[]
  benefits: string[]
  images: string[]
  featuredImage: string | null
  bestSeller: boolean
  featured: boolean
  active: boolean
  rating: number
  reviewCount: number
  salesCount: number
  // Product metadata (accordion sections)
  storage: string | null
  allergens: string | null
  nutrition: string | null
  highlights: string[]
  fssaiNumber: string | null
  servingSize: string | null
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProductDocument>(
  {
    uniqueId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    groupSlug: { type: String, default: null },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: String, default: null },
    foodType: { type: String, default: null },
    popularTags: { type: [String], default: [] },
    description: { type: String, required: true },
    shortDescription: { type: String, default: null },
    about: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, default: null },
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, default: null },
    weight: { type: String, default: null },
    packageSizes: {
      type: [{
        label: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        comparePrice: { type: Number, default: null },
        stock: { type: Number, default: 0, min: 0 },
      }],
      default: [],
    },
    tags: { type: [String], default: [] },
    ingredients: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    images: { type: [String], default: [] },
    featuredImage: { type: String, default: null },
    bestSeller: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    // Product metadata (accordion sections)
    storage: { type: String, default: null },
    allergens: { type: String, default: null },
    nutrition: { type: String, default: null },
    highlights: { type: [String], default: [] },
    fssaiNumber: { type: String, default: null },
    servingSize: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Virtual for populating category
ProductSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
})

ProductSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Indexes for common queries
ProductSchema.index({ slug: 1 })
ProductSchema.index({ categoryId: 1 })
ProductSchema.index({ groupSlug: 1 })
ProductSchema.index({ foodType: 1 })
ProductSchema.index({ active: 1, bestSeller: 1 })
ProductSchema.index({ active: 1, featured: 1 })

const Product: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema)

export default Product
