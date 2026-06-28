import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUserDocument extends Document {
  _id: mongoose.Types.ObjectId
  name: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  password: string | null
  phone: string | null
  role: 'CUSTOMER' | 'ADMIN'
  provider: string | null
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, default: null },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerified: { type: Date, default: null },
    image: { type: String, default: null },
    password: { type: String, default: null },
    phone: { type: String, default: null },
    role: { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
    provider: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Virtual 'id' field for frontend compatibility
UserSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema)

export default User
