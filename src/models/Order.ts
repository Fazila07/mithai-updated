import mongoose, { Schema, Document, Model } from 'mongoose'

// ─── Subdocument Schemas ───────────────────────────────────

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  name: string
  image: string
  price: number
  quantity: number
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
)

export interface IShippingAddress {
  street: string
  city: string
  state: string
  pincode: string
}

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: 'India' },
    pincode: { type: String, required: true },
  },
  { _id: false }
)

// ─── Order Document ────────────────────────────────────────

export type OrderStatusType = 'PENDING' | 'CONFIRMED' | 'IN_PROCESS' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
export type PaymentStatusType = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface IOrderDocument extends Document {
  _id: mongoose.Types.ObjectId
  orderNumber: string
  userId: mongoose.Types.ObjectId | null
  customerName: string
  customerEmail: string
  customerPhone: string
  status: OrderStatusType
  paymentStatus: PaymentStatusType
  paymentMethod: string
  razorpayOrderId: string | null
  razorpayPaymentId: string | null
  subtotal: number
  shippingCharge: number
  tax: number
  discount: number
  total: number
  couponCode: string | null
  notes: string | null
  items: IOrderItem[]
  shippingAddress: IShippingAddress
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'IN_PROCESS', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    paymentMethod: { type: String, default: 'COD' },
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    subtotal: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String, default: null },
    notes: { type: String, default: null },
    items: { type: [OrderItemSchema], required: true },
    shippingAddress: { type: ShippingAddressSchema, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

OrderSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

OrderSchema.index({ orderNumber: 1 })
OrderSchema.index({ userId: 1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ createdAt: -1 })

const Order: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema)

export default Order
