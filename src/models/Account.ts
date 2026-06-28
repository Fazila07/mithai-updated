import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAccountDocument extends Document {
  userId: mongoose.Types.ObjectId
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string | null
  access_token: string | null
  expires_at: number | null
  token_type: string | null
  scope: string | null
  id_token: string | null
  session_state: string | null
}

const AccountSchema = new Schema<IAccountDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
  refresh_token: { type: String, default: null },
  access_token: { type: String, default: null },
  expires_at: { type: Number, default: null },
  token_type: { type: String, default: null },
  scope: { type: String, default: null },
  id_token: { type: String, default: null },
  session_state: { type: String, default: null },
})

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true })

const Account: Model<IAccountDocument> =
  mongoose.models.Account || mongoose.model<IAccountDocument>('Account', AccountSchema)

export default Account
