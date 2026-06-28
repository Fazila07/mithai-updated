import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISessionDocument extends Document {
  sessionToken: string
  userId: mongoose.Types.ObjectId
  expires: Date
}

const SessionSchema = new Schema<ISessionDocument>({
  sessionToken: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expires: { type: Date, required: true },
})

const Session: Model<ISessionDocument> =
  mongoose.models.Session || mongoose.model<ISessionDocument>('Session', SessionSchema)

export default Session
