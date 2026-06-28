export interface IProduct {
  _id: string
  id?: string
  uniqueId?: string
  name: string
  slug: string
  groupSlug?: string | null
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number | null
  images: string[]
  featuredImage?: string
  category: ICategory | string
  categoryId?: string
  subcategory?: string
  foodType?: string | null
  popularTags?: string[]
  ingredients: string[]
  benefits?: string[]
  stock: number
  sku?: string
  tags: string[]
  featured: boolean
  bestSeller: boolean
  active?: boolean
  rating: number
  reviewCount: number
  salesCount?: number
  weight?: string
  allergens?: string[]
  nutritionFacts?: Record<string, string>
  createdAt: string
  updatedAt: string
  // Size variants (populated from groupSlug)
  sizeVariants?: IProductVariant[]
}

export interface IProductVariant {
  id: string
  slug: string
  weight: string | null
  price: number
  comparePrice: number | null
  stock: number
}

export interface ICategory {
  _id?: string
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  emoji?: string
  active?: boolean
  _count?: { products: number }
}

export interface IUser {
  _id?: string
  id: string
  name: string
  email: string
  phone?: string
  image?: string
  role: 'CUSTOMER' | 'ADMIN'
  createdAt: string
}

export interface IAddress {
  id: string
  _id?: string
  label?: string
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export interface IOrderItem {
  id?: string
  productId: string
  name: string
  image: string
  price: number
  quantity: number
}

export interface IOrder {
  _id: string
  id?: string
  orderNumber: string
  userId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: IOrderItem[]
  shippingAddress: {
    street: string
    city: string
    state: string
    pincode: string
  }
  subtotal: number
  shippingCharge: number
  tax: number
  discount: number
  total: number
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROCESS' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  paymentMethod: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  couponCode?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ICoupon {
  id: string
  code: string
  description?: string
  discountType: 'percentage' | 'flat'
  value: number
  minOrder: number
  maxDiscount?: number | null
  usageLimit?: number | null
  usedCount: number
  perUserLimit: number
  active: boolean
  expiryDate: string
  createdAt: string
  updatedAt: string
}

export interface IReview {
  _id: string
  product: string
  user: IUser | string
  rating: number
  title: string
  body: string
  verified: boolean
  createdAt: string
}

// Cart
export interface CartItem {
  product: IProduct
  quantity: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
  buyNowItem: CartItem | null
  addItem: (product: IProduct, qty?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  setBuyNow: (product: IProduct, qty: number) => void
  clearBuyNow: () => void
  total: number
  itemCount: number
}

// API responses
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Shop filters
export interface ShopFilters {
  category?: string
  foodType?: string[]
  search?: string
  sort?: 'recommended' | 'price-asc' | 'price-desc' | 'bestseller' | 'must-try' | 'newest'
  minPrice?: number
  maxPrice?: number
  tags?: string[]
  popularTags?: string[]
  page?: number
  limit?: number
}

// Filter option counts
export interface FilterOption {
  label: string
  value: string
  count?: number
}